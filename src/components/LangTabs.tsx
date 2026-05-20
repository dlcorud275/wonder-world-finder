import type { Language } from "@/lib/content-data";

export function LangTabs({
  value,
  onChange,
}: {
  value: Language;
  onChange: (v: Language) => void;
}) {
  const opts: { id: Language; label: string }[] = [
    { id: "en", label: "🇺🇸 English" },
    { id: "ko", label: "🇰🇷 한글" },
  ];
  return (
    <div className="inline-flex p-1 rounded-full bg-secondary border border-border">
      {opts.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}