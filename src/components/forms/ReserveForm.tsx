'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { lagosMinutes, nextDays } from '@/lib/dates';
import { formatTime } from '@/lib/hours';
import { buildReservationMessage, isValidNgPhone } from '@/lib/whatsapp';
import { Chips, Field, FieldGroup, Stepper } from './fields';
import { useToday } from './useToday';
import { WhatsAppSubmit } from './WhatsAppSubmit';

type Props = {
  brand: string;
  whatsapp: string;
  slots: string[];
  maxGuests: number;
  sections: string[];
  /** concept slug → section name, for ?section=<slug> */
  sectionBySlug: Record<string, string>;
  serverToday: string;
};

const BUFFER_MIN = 30;

export function ReserveForm({ brand, whatsapp, slots, maxGuests, sections, sectionBySlug, serverToday }: Props) {
  const params = useSearchParams();
  const today = useToday(serverToday);
  const days = useMemo(() => nextDays(today, 14), [today]);
  const [date, setDate] = useState(today);
  const [time, setTime] = useState<string>('');
  const [guests, setGuests] = useState(Math.min(2, maxGuests));
  const [section, setSection] = useState(sections[0]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [tried, setTried] = useState(false);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const s = sectionBySlug[params.get('section') ?? ''];
    if (s) setSection(s);
  }, [params, sectionBySlug]);
  useEffect(() => setNow(lagosMinutes()), [date]);
  useEffect(() => setDate((d) => (d < today ? today : d)), [today]);

  const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
  const past = (t: string) => date === today && now !== null && toMin(t) < now + BUFFER_MIN;
  // A slot that has passed since it was picked is dropped.
  const chosen = time && !past(time) ? time : '';

  const errors = {
    time: tried && !chosen && 'Pick a time.',
    name: tried && !name.trim() && 'Tell us who to save the seat for.',
    phone: tried && !isValidNgPhone(phone) && 'Enter an 11-digit number (or +234…).',
  };

  const build = () => {
    setTried(true);
    if (!chosen || !name.trim() || !isValidNgPhone(phone)) return null;
    return buildReservationMessage({ brand, date, time: chosen, guests, section, name, phone, note });
  };

  return (
    <form className="flex flex-col gap-7" onSubmit={(e) => e.preventDefault()} noValidate>
      <FieldGroup label="Date">
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-wrap lg:px-0" role="radiogroup" aria-label="Date">
          {days.map((d) => {
            const on = d.iso === date;
            return (
              <button
                key={d.iso}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setDate(d.iso)}
                className={`flex h-[68px] w-[58px] shrink-0 flex-col items-center justify-center gap-0.5 rounded-card border transition-colors ${on ? 'border-text bg-text text-bg' : 'border-line hover:border-text'}`}
              >
                <span className="text-[11px] tracking-[0.1em] uppercase">{d.dow}</span>
                <span className="text-[20px] font-semibold leading-tight">{d.day}</span>
              </button>
            );
          })}
        </div>
      </FieldGroup>

      <FieldGroup label="Time">
        <Chips name="Time" options={slots} value={chosen} onChange={setTime} disabled={past} label={(t) => formatTime(t)} />
        {errors.time && <span className="text-[13px] text-error">{errors.time}</span>}
      </FieldGroup>

      <div className="flex items-center justify-between border-y border-line py-3.5">
        <span className="text-[15px] font-semibold">Guests</span>
        <Stepper label="guests" value={guests} onChange={setGuests} min={1} max={maxGuests} />
      </div>
      {guests >= maxGuests && <p className="-mt-4 text-[13px] text-muted">Bigger group? Use the events form and we&apos;ll set up a room.</p>}

      <FieldGroup label="Section">
        <Chips name="Section" options={sections} value={section} onChange={setSection} />
      </FieldGroup>

      <div className="flex flex-col gap-4">
        <Field label="Your name" value={name} onChange={setName} error={errors.name} autoComplete="name" />
        <Field label="Phone" value={phone} onChange={setPhone} error={errors.phone} type="tel" inputMode="tel" autoComplete="tel" />
        <Field label="Note (birthday, high chair, allergies)" value={note} onChange={setNote} />
      </div>

      <WhatsAppSubmit number={whatsapp} label="Send booking on WhatsApp" build={build} note="Opens WhatsApp with your booking filled in." />
    </form>
  );
}
