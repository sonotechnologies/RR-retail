const COLORS: Record<string, string> = {
  new: 'var(--accent)',
  spicy: '#B23A1E',
  'sold out': 'var(--muted)',
};

export function Tag({ children }: { children: string }) {
  const c = COLORS[children.toLowerCase()] ?? 'var(--muted)';
  return (
    <span className="rounded-full border px-[7px] py-[3px] text-[10px] font-bold uppercase leading-none tracking-[0.12em]" style={{ borderColor: c, color: c }}>
      {children}
    </span>
  );
}
