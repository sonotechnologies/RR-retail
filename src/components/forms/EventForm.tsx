'use client';

import { useState } from 'react';
import { addDays } from '@/lib/dates';
import { buildEventMessage, isValidNgPhone } from '@/lib/whatsapp';
import { Chips, Field, FieldGroup } from './fields';
import { useToday } from './useToday';
import { WhatsAppSubmit } from './WhatsAppSubmit';

type Props = { brand: string; whatsapp: string; occasions: string[]; spaces: string[]; budgets: string[]; serverToday: string };

export function EventForm({ brand, whatsapp, occasions, spaces, budgets, serverToday }: Props) {
  const today = useToday(serverToday);
  const spaceOptions = [...spaces, 'Not sure yet'];
  const [occasion, setOccasion] = useState(occasions[0]);
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState('');
  const [space, setSpace] = useState(spaceOptions[spaceOptions.length - 1]);
  const [budget, setBudget] = useState(budgets[0]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [details, setDetails] = useState('');
  const [tried, setTried] = useState(false);

  const n = Number(guests);
  const errors = {
    date: tried && (!date || date < today) && 'Pick a date.',
    guests: tried && !(n > 0) && 'Roughly how many?',
    name: tried && !name.trim() && 'Who should we talk to?',
    phone: tried && !isValidNgPhone(phone) && 'Enter an 11-digit number (or +234…).',
  };

  const build = () => {
    setTried(true);
    if (!date || date < today || !(n > 0) || !name.trim() || !isValidNgPhone(phone)) return null;
    return buildEventMessage({ brand, occasion, date, guests: n, space, budget, name, phone, details });
  };

  return (
    <form className="flex flex-col gap-7" onSubmit={(e) => e.preventDefault()} noValidate>
      <FieldGroup label="Occasion">
        <Chips name="Occasion" options={occasions} value={occasion} onChange={setOccasion} />
      </FieldGroup>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Date" type="date" min={addDays(today, 1)} value={date} onChange={setDate} error={errors.date} />
        <Field label="Guests" type="number" inputMode="numeric" min={1} value={guests} onChange={setGuests} error={errors.guests} />
      </div>
      <FieldGroup label="Space">
        <Chips name="Space" options={spaceOptions} value={space} onChange={setSpace} />
      </FieldGroup>
      <FieldGroup label="Budget">
        <Chips name="Budget" options={budgets} value={budget} onChange={setBudget} />
      </FieldGroup>
      <div className="flex flex-col gap-4">
        <Field label="Name" value={name} onChange={setName} error={errors.name} autoComplete="name" />
        <Field label="Phone" value={phone} onChange={setPhone} error={errors.phone} type="tel" inputMode="tel" autoComplete="tel" />
        <Field label="Tell us about it" value={details} onChange={setDetails} multiline />
      </div>
      <WhatsAppSubmit number={whatsapp} label="Send enquiry" variant="primary" build={build} note="Opens WhatsApp. Our events lead replies within a day." />
    </form>
  );
}
