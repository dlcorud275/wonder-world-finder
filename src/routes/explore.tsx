import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { ContentRow, ContentCard } from "@/components/ContentCard";
import { CONTENT, STAGES, type Stage, type Kind, type Language } from "@/lib/content-data";
import { LangTabs } from "@/components/LangTabs";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/explore")({
  head: () => ({ meta: [{ title: "탐색 — 키즈네스트" }] }),
  component: Explore,
});

function Explore() {
  const [stage, setStage] = useState<Stage | "all">(() => {
    if (typeof window === "undefined") return "all";
    const saved = window.localStorage.getItem("explore-stage");
    return (saved as Stage | "all") || "all";
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("explore-stage", stage);
    }
  }, [stage]);
  const [kind, setKind] = useState<Kind | "all">("all");
  const [lang, setLang] = useState<Language>("en");
  const [q, setQ] = useState("");

  const results = CONTENT.filter((c) => {
    if (stage !== "all" && c.stage !== stage) return false;
    if (kind !== "all" && c.kind !== kind) return false;
    if ((c.language ?? "ko") !== lang) return false;
    if (q && !`${c.title} ${c.creator} ${c.tags.join(" ")}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const books = results.filter((c) => c.kind === "book");
  const videos = results.filter((c) => c.kind === "video");
  const showBooks = kind === "all" || kind === "book";
  const showVideos = kind === "all" || kind === "video";

  return (
    <AppShell>
      <header className="px-5 pt-8 pb-3">
        <h1 className="text-2xl font-bold">탐색</h1>
        <p className="text-sm text-muted-foreground">단계와 형식으로 골라보세요</p>
        <div className="mt-3"><LangTabs value={lang} onChange={setLang} /></div>
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

      <div className="mt-5 pb-8 space-y-6">
        {results.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-12">결과가 없어요</p>
        ) : (
          <>
            {showBooks && books.length > 0 && (
              <section>
                <div className="px-5 flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-foreground">📚 책</h2>
                  <span className="text-xs text-muted-foreground">{books.length}개</span>
                </div>
                <div className="px-5 space-y-2">
                  {books.map((c) => <ContentRow key={c.id} item={c} />)}
                </div>
              </section>
            )}

            {showVideos && videos.length > 0 && (
              <section>
                <div className="px-5 flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-foreground">🎬 영상</h2>
                  <span className="text-xs text-muted-foreground">{videos.length}개</span>
                </div>
                <VideoCarousel items={videos} />
              </section>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}

function VideoCarousel({ items }: { items: typeof CONTENT }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const offset = dir === "left" ? -240 : 240;
    el.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto px-5 pb-2 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item) => (
          <div key={item.id} className="snap-start shrink-0 w-[170px]">
            <ContentCard item={item} />
          </div>
        ))}
      </div>
      {items.length > 2 && (
        <>
          <button
            onClick={() => scroll("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 size-8 rounded-full bg-background/90 border border-border shadow-sm flex items-center justify-center text-foreground"
            aria-label="이전"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 size-8 rounded-full bg-background/90 border border-border shadow-sm flex items-center justify-center text-foreground"
            aria-label="다음"
          >
            <ChevronRight className="size-4" />
          </button>
        </>
      )}
    </div>
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