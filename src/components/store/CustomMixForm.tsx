'use client';

import { useState } from 'react';
import { buildCustomMixMessage } from '@/lib/whatsapp';
import { useBag } from './bag';
import { useStoreSite } from './StoreSiteContext';

type Item = { slug: string; name: string; min: number };
type Row = { id: number; slug: string; pieces: string };

const field = 'h-11 rounded-card border border-line bg-bg px-2.5 text-[16px] text-text outline-none focus:border-accent lg:text-[14px]';

/** "Request a custom mix": items + quantities, sent to WhatsApp (preview first). */
export function CustomMixForm({ items }: { items: Item[] }) {
  const site = useStoreSite();
  const showMessage = useBag((s) => s.showMessage);
  const first = items[0];
  const [rows, setRows] = useState<Row[]>(first ? [{ id: 0, slug: first.slug, pieces: String(first.min) }] : []);
  const [error, setError] = useState(false);
  if (!first) return null;

  const update = (id: number, patch: Partial<Row>) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const addRow = () => {
    const next = items.find((i) => !rows.some((r) => r.slug === i.slug)) ?? first;
    setRows((rs) => [...rs, { id: Math.max(...rs.map((r) => r.id), 0) + 1, slug: next.slug, pieces: String(next.min) }]);
  };
  const send = () => {
    const picked = rows.map((r) => ({ slug: r.slug, name: items.find((i) => i.slug === r.slug)?.name ?? r.slug, pieces: Number(r.pieces) || 0 })).filter((r) => r.pieces > 0);
    if (!picked.length) return setError(true);
    setError(false);
    showMessage({ title: 'Custom mix', text: buildCustomMixMessage({ shortName: site.shortName, siteUrl: site.siteUrl, items: picked }) });
  };

  return (
    <div className="flex flex-col gap-3">
      {rows.map((r, n) => (
        <div key={r.id} className="flex items-center gap-2">
          <label className="sr-only" htmlFor={`mix-item-${r.id}`}>
            Item {n + 1}
          </label>
          <select id={`mix-item-${r.id}`} value={r.slug} onChange={(e) => update(r.id, { slug: e.target.value })} className={`${field} min-w-0 flex-1`}>
            {items.map((i) => (
              <option key={i.slug} value={i.slug}>
                {i.name}
              </option>
            ))}
          </select>
          <label className="sr-only" htmlFor={`mix-qty-${r.id}`}>
            Pieces
          </label>
          <input
            id={`mix-qty-${r.id}`}
            value={r.pieces}
            onChange={(e) => update(r.id, { pieces: e.target.value.replace(/\D/g, '').slice(0, 4) })}
            inputMode="numeric"
            placeholder="Pcs"
            className={`${field} w-[70px] text-center`}
          />
          <button
            type="button"
            onClick={() => setRows((rs) => (rs.length > 1 ? rs.filter((x) => x.id !== r.id) : rs))}
            disabled={rows.length === 1}
            aria-label={`Remove item ${n + 1}`}
            className="h-11 w-9 text-[18px] text-muted hover:text-text disabled:opacity-30"
          >
            ×
          </button>
        </div>
      ))}
      <button type="button" onClick={addRow} className="h-9 self-start rounded-full border border-dashed border-muted px-3.5 text-[13px] font-bold hover:border-text">
        + Add item
      </button>
      {error && <p className="text-[13px] font-bold text-sale">Add how many pieces you want.</p>}
      <button type="button" onClick={send} className="h-[50px] rounded-full bg-wa text-[15px] font-extrabold text-wa-ink transition-colors hover:bg-[#2BE06F]">
        Send custom mix on WhatsApp
      </button>
    </div>
  );
}
