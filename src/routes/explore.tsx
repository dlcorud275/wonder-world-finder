import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ContentRow } from "@/components/ContentCard";
import { CONTENT, STAGES, type Stage, type Kind } from "@/lib/content-data";
import { Search } from "lucide-react";

export const Route = createFileRoute("/explore")({
  head: () => ({ meta: [{ title: "탐색 — 키즈네스트" }] }),
  component: Explore,
});

function Explore() {
  const [stage, setStage] = useState<Stage | "all">("all");
  const [kind, setKind] = useState<Kind | "all">("all");
  const [q, setQ] = useState("");

  const results = CONTENT.filter((c) => {
    if (stage !== "all" && c.stage !== stage) return false;
    if (kind !== "all" && c.kind !== kind) return false;
    if (q && !`${c.title} ${c.creator} ${c.tags.join(" ")}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <AppShell>
      <header className="px-5 pt-8 pb-3">
        <h1 className="text-2xl font-bold">탐색</h1>
        <p className="text-sm text-muted-foreground">단계와 형식으로 골라보세요</p>
      </header>

      <div className="px-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="제목, 저자, 태그 검색"
            className="w-full bg-card border border-border rounded-2xl pl-10 pr-4 py-3 text-sm outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="px-5 mt-4 flex gap-2 overflow-x-auto pb-1">
        <Chip active={stage === "all"} onClick={() => setStage("all")}>전체</Chip>
        {STAGES.map((s) => (
          <Chip key={s.id} active={stage === s.id} onClick={() => setStage(s.id)}>
            {s.label} {s.ages}
          </Chip>
        ))}
      </div>

      <div className="px-5 mt-2 flex gap-2">
        {(["all", "book", "video"] as const).map((k) => (
          <Chip key={k} active={kind === k} onClick={() => setKind(k)} variant="outline">
            {k === "all" ? "모두" : k === "book" ? "📚 책" : "🎬 영상"}
          </Chip>
        ))}
      </div>

      <div className="px-5 mt-5 space-y-2">
        {results.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-12">결과가 없어요</p>
        ) : (
          results.map((c) => <ContentRow key={c.id} item={c} />)
        )}
      </div>
    </AppShell>
  );
}

function Chip({
  active,
  onClick,
  children,
  variant = "solid",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  variant?: "solid" | "outline";
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
        active
          ? "bg-primary text-primary-foreground border-primary"
          : variant === "outline"
          ? "bg-transparent border-border text-foreground"
          : "bg-card border-border text-foreground"
      }`}
    >
      {children}
    </button>
  );
}