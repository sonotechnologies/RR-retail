'use client';

import { useEffect, useState } from 'react';
import { Button, type ButtonVariant } from '@/components/ui/Button';
import { waLink } from '@/lib/whatsapp';

type Props = {
  number: string;
  label: string;
  /** Validates the form; returns the message to send, or null when invalid (the form shows its errors). */
  build: () => string | null;
  variant?: ButtonVariant;
  note?: string;
  onSent?: () => void;
};

/** Opens wa.me with the message in a new tab, shows "Opening WhatsApp…", then offers "Copy message"
 *  in case WhatsApp didn't open. */
export function WhatsAppSubmit({ number, label, build, variant = 'whatsapp', note, onSent }: Props) {
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!sending) return;
    const t = setTimeout(() => setSending(false), 2400);
    return () => clearTimeout(t);
  }, [sending]);

  const send = () => {
    const text = build();
    if (!text) return;
    setMessage(text);
    setCopied(false);
    setSending(true);
    window.open(waLink(number, text), '_blank', 'noopener');
    onSent?.();
  };

  const copy = async () => {
    if (!message) return;
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
    } catch {
      window.prompt('Copy this message:', message);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <Button type="button" variant={variant} size="lg" onClick={send} loading={sending} icon={variant === 'whatsapp' && !sending} className="w-full !h-[54px] text-[16px]">
        {sending ? 'Opening WhatsApp…' : label}
      </Button>
      {message ? (
        <p className="text-center text-[13px] text-muted">
          WhatsApp didn&apos;t open?{' '}
          <button type="button" onClick={copy} className="font-semibold text-text underline">
            {copied ? 'Copied' : 'Copy message'}
          </button>{' '}
          and send it to {formatIntl(number)}.
        </p>
      ) : (
        note && <p className="text-center text-[13px] text-muted">{note}</p>
      )}
    </div>
  );
}

const formatIntl = (n: string) => `+${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6, 9)} ${n.slice(9)}`.trim();
