'use client';

import { useState } from 'react';
import { addDays } from '@/lib/dates';
import { buildCakeMessage, isValidNgPhone } from '@/lib/whatsapp';
import { Chips, Field, FieldGroup } from './fields';
import { useToday } from './useToday';
import { WhatsAppSubmit } from './WhatsAppSubmit';

type Props = {
  brand: string;
  whatsapp: string;
  types: string[];
  sizes: string[];
  flavours: string[];
  budgets: string[];
  serverToday: string;
};

const LEAD_DAYS = 2;

export function CakeForm({ brand, whatsapp, types, sizes, flavours, budgets, serverToday }: Props) {
  const today = useToday(serverToday);
  const earliest = addDays(today, LEAD_DAYS);
  const [type, setType] = useState(types[0]);
  const [date, setDate] = useState('');
  const [size, setSize] = useState(sizes[Math.min(1, sizes.length - 1)]);
  const [flavour, setFlavour] = useState(flavours[0]);
  const [message, setMessage] = useState('');
  const [budget, setBudget] = useState(budgets[Math.min(1, budgets.length - 1)]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [tried, setTried] = useState(false);

  const isCake = type.toLowerCase() === 'cake';
  const dateOk = !!date && date >= earliest;
  const errors = {
    date: tried && !dateOk && (date ? 'We need a little more notice. Pick a later date.' : 'When do you need it?'),
    name: tried && !name.trim() && 'Tell us who the order is for.',
    phone: tried && !isValidNgPhone(phone) && 'Enter an 11-digit number (or +234…).',
  };

  const build = () => {
    setTried(true);
    if (!dateOk || !name.trim() || !isValidNgPhone(phone)) return null;
    return buildCakeMessage({ brand, date, type, size, flavour, message: isCake ? message : undefined, budget, name, phone });
  };

  return (
    <form className="flex flex-col gap-7" onSubmit={(e) => e.preventDefault()} noValidate>
      <FieldGroup label="What do you need?">
        <Chips name="Type" layout="grid3" options={types} value={type} onChange={setType} />
      </FieldGroup>
      <Field label="Date needed" type="date" min={earliest} value={date} onChange={setDate} error={errors.date} />
      <FieldGroup label="Size">
        <Chips name="Size" options={sizes} value={size} onChange={setSize} />
      </FieldGroup>
      <FieldGroup label="Flavour">
        <Chips name="Flavour" options={flavours} value={flavour} onChange={setFlavour} />
      </FieldGroup>
      {isCake && <Field label="Message on the cake" value={message} onChange={setMessage} maxLength={60} />}
      <FieldGroup label="Budget">
        <Chips name="Budget" options={budgets} value={budget} onChange={setBudget} />
      </FieldGroup>
      <div className="flex flex-col gap-4">
        <Field label="Your name" value={name} onChange={setName} error={errors.name} autoComplete="name" />
        <Field label="Phone" value={phone} onChange={setPhone} error={errors.phone} type="tel" inputMode="tel" autoComplete="tel" />
      </div>
      <p className="rounded-card border border-dashed border-line p-4 text-[14px] leading-[1.55] text-muted">
        Have a reference picture? Send it to us on WhatsApp right after this message.
      </p>
      <WhatsAppSubmit number={whatsapp} label="Send request on WhatsApp" build={build} />
    </form>
  );
}
