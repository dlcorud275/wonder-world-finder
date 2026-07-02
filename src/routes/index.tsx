import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/AppShell";
import { getChildProfile } from "@/lib/child-profile";
import { Settings, Loader2, Sparkles, X, Search } from "lucide-react";
import { ApiBookCard } from "@/components/ApiBookCard";
import { AdBanner } from "@/components/AdBanner";
import { analyzeUrlFn, type AnalyzedBook } from "@/lib/analyze-url.functions";
import type { PopularBook } from "@/services/libraryApi";

export const Route = createFileRoute("/")({
  component: Index,
});

interface AnalysisEntry {
  id: string;
  url: string;
  sourceTitle: string;
  books: AnalyzedBook[];
  createdAt: number;
}

function Index() {
  const profile = getChildProfile();
  const analyzeUrl = useServerFn(analyzeUrlFn);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyses, setAnalyses] = useState<AnalysisEntry[]>([]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;
    setError(null);
    setLoading(true);
    try {
      const value = input.trim();
      const result = await analyzeUrl({ data: { input: value } });
      if (result.books.length === 0) {
        setError("이 글에서 추천 도서를 찾지 못했어요.");
      } else {
        setAnalyses((prev) => [
          {
            id: `${Date.now()}`,
            url: value,
            sourceTitle: result.sourceTitle || value,
            books: result.books,
            createdAt: Date.now(),
          },
          ...prev,
        ]);
        setInput("");
      }
    } catch (err: any) {
      setError(err?.message ?? "분석에 실패했어요.");
    } finally {
      setLoading(false);
    }
  }

  function removeEntry(id: string) {
    setAnalyses((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <AppShell>
      <header className="px-5 pt-8 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold tracking-widest text-primary uppercase">🍓 Kidsnest</p>
            <h1 className="text-2xl font-bold mt-1 leading-snug">
              블로그 · 유튜브 · 책 제목<br />무엇이든 추천 목록으로! ✨
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {profile.name} · 교육 인플루언서·주제 분석
            </p>
          </div>
          <Link
            to="/settings"
            aria-label="설정"
            className="shrink-0 p-2.5 rounded-full bg-secondary border-2 border-border text-foreground shadow-[0_2px_0_0_var(--color-accent)]"
          >
            <Settings className="size-4" />
          </Link>
        </div>
      </header>

      <section className="px-5">
        <form onSubmit={onSubmit} className="rounded-3xl border-2 border-border bg-card p-3 shadow-[0_3px_0_0_var(--color-accent)]">
          <label className="flex items-center gap-2 text-xs font-bold text-primary mb-2">
            <Search className="size-3.5" /> 블로그 URL · 유튜브 · 책제목 · 인플루언서 이름
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="예: 잠수네, 노부영, https://youtu.be/..."
              className="flex-1 rounded-2xl border-2 border-border bg-background px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-primary/30"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-primary text-primary-foreground px-3 py-2 text-sm font-bold disabled:opacity-60 active:scale-95 transition-transform shadow-[0_3px_0_0_var(--color-accent)]"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              분석
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">
            블로그 본문이 없어도 괜찮아요. 책 제목, 저자, 유튜버 이름, 관심 주제만 넣어도 AI가 추천 목록을
            만들어줘요. 🐣
          </p>
          {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
        </form>
      </section>

      {analyses.length === 0 && !loading && (
        <section className="px-5 mt-8 text-center text-xs text-muted-foreground">
          <p className="text-2xl mb-2">🍓 🎨 📚</p>
          <p>아직 분석한 글이 없어요.</p>
          <p className="mt-1">관심 있는 키워드나 링크를 붙여넣어 보세요.</p>
        </section>
      )}

      {analyses.map((entry) => (
        <section key={entry.id} className="px-5 mt-7">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="min-w-0">
              <h2 className="text-base font-bold truncate">{entry.sourceTitle}</h2>
              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-muted-foreground truncate block hover:text-primary"
              >
                {entry.url}
              </a>
              <p className="text-[11px] text-primary mt-0.5 font-semibold">
                추천 도서 {entry.books.length}권
              </p>
            </div>
            <button
              onClick={() => removeEntry(entry.id)}
              aria-label="목록에서 제거"
              className="shrink-0 p-1.5 rounded-full bg-secondary border border-border text-muted-foreground"
            >
              <X className="size-3.5" />
            </button>
          </div>
          <div className="space-y-2">
            {entry.books.map((b, i) => (
              <div key={i} className="space-y-1">
                <ApiBookCard book={toPopularBook(b)} readingLevel={b.readingLevel} />
                {b.reason && (
                  <p className="text-[11px] text-muted-foreground px-3 leading-relaxed">
                    “{b.reason}”
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="px-5 mt-8">
        <AdBanner />
      </section>
    </AppShell>
  );
}

function toPopularBook(b: AnalyzedBook): PopularBook {
  return {
    isbn: b.isbn,
    title: b.title,
    author: b.author,
    publisher: b.publisher,
    imageUrl: b.imageUrl,
  };
}
