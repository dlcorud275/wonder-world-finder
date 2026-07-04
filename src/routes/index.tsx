import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/AppShell";
import { getChildProfile } from "@/lib/child-profile";
import { Settings, Loader2, Sparkles, X, Search, Camera } from "lucide-react";
import { ApiBookCard } from "@/components/ApiBookCard";
import { AdBanner } from "@/components/AdBanner";
import { analyzeUrlFn, analyzeImageFn, type AnalyzedBook } from "@/lib/analyze-url.functions";
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
  const analyzeImage = useServerFn(analyzeImageFn);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyses, setAnalyses] = useState<AnalysisEntry[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  async function fileToDataUrl(file: File): Promise<string> {
    // Downscale large photos to keep payload small (< ~1.5MB base64).
    const bitmap = await createImageBitmap(file).catch(() => null);
    if (!bitmap) {
      return await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result));
        r.onerror = () => reject(r.error);
        r.readAsDataURL(file);
      });
    }
    const maxSide = 1280;
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(bitmap, 0, 0, w, h);
    return canvas.toDataURL("image/jpeg", 0.85);
  }

  async function onCameraChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || loading) return;
    setError(null);
    setLoading(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      const result = await analyzeImage({ data: { image: dataUrl } });
      if (result.books.length === 0) {
        setError("책 제목을 찾지 못했어요. 다시 촬영해 주세요.");
      } else {
        setAnalyses((prev) => [
          {
            id: `${Date.now()}`,
            url: "camera://photo",
            sourceTitle: result.sourceTitle,
            books: result.books,
            createdAt: Date.now(),
          },
          ...prev,
        ]);
      }
    } catch (err: any) {
      setError(err?.message ?? "이미지 분석에 실패했어요.");
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
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              aria-label="책 표지 촬영"
              className="inline-flex items-center justify-center rounded-2xl bg-secondary text-foreground border-2 border-border px-3 py-2 disabled:opacity-60 active:scale-95 transition-transform shadow-[0_3px_0_0_var(--color-accent)]"
            >
              <Camera className="size-4" />
            </button>
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
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={onCameraChange}
          />
          <p className="text-[11px] text-muted-foreground mt-2">
            블로그 본문이 없어도 괜찮아요. 책 제목·저자·유튜버 이름·관심 주제만 넣어도 되고,
            📷 카메라로 책 표지를 찍으면 제목을 읽어 목록을 만들어줘요. 🐣
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
