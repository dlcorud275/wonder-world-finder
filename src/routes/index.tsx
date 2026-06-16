import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/AppShell";
import { getChildProfile } from "@/lib/child-profile";
import { Settings, Loader2, Link2, Sparkles, X } from "lucide-react";
import { ApiBookCard } from "@/components/ApiBookCard";
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
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyses, setAnalyses] = useState<AnalysisEntry[]>([]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim() || loading) return;
    setError(null);
    setLoading(true);
    try {
      const result = await analyzeUrl({ data: { url: url.trim() } });
      if (result.books.length === 0) {
        setError("이 글에서 추천 도서를 찾지 못했어요.");
      } else {
        setAnalyses((prev) => [
          {
            id: `${Date.now()}`,
            url: url.trim(),
            sourceTitle: result.sourceTitle || url.trim(),
            books: result.books,
            createdAt: Date.now(),
          },
          ...prev,
        ]);
        setUrl("");
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
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">Kidsnest</p>
            <h1 className="text-2xl font-bold mt-1">
              블로그 속 추천 도서를{"\n"}한 번에 모아드려요
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {profile.name} · 교육 인플루언서 글 분석
            </p>
          </div>
          <Link
            to="/settings"
            aria-label="설정"
            className="shrink-0 p-2 rounded-full bg-secondary border border-border text-foreground"
          >
            <Settings className="size-4" />
          </Link>
        </div>
      </header>

      <section className="px-5">
        <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-2">
            <Link2 className="size-3.5" /> 분석할 블로그/포스트 URL
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://blog.naver.com/..."
              className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary text-primary-foreground px-3 py-2 text-sm font-semibold disabled:opacity-60 active:scale-95 transition-transform"
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
            네이버 블로그, 티스토리, 브런치 등 공개 글 본문에서 책 제목을 추출하고 도서관 검색으로
            연결합니다.
          </p>
          {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
        </form>
      </section>

      {analyses.length === 0 && !loading && (
        <section className="px-5 mt-8 text-center text-xs text-muted-foreground">
          <p>아직 분석한 글이 없어요.</p>
          <p className="mt-1">관심 있는 교육 블로그 글 주소를 붙여넣어 보세요.</p>
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
                <ApiBookCard book={toPopularBook(b)} />
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
