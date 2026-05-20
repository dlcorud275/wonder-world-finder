import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ContentRow } from "@/components/ContentCard";
import { CONTENT, STAGES, type Stage } from "@/lib/content-data";
import { useServerFn } from "@tanstack/react-start";
import { recommendFn } from "@/lib/ai.functions";
import { Sparkles, Loader2 } from "lucide-react";

export const Route = createFileRoute("/ai")({
  head: () => ({ meta: [{ title: "AI 추천 — 키즈네스트" }] }),
  component: AI,
});

function AI() {
  const recommend = useServerFn(recommendFn);
  const [stage, setStage] = useState<Stage>("toddler");
  const [interests, setInterests] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ids: string[]; reason: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const r = await recommend({ data: { stage, interests } });
      setResult(r);
    } catch (err: any) {
      setError(err?.message ?? "추천을 받지 못했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  const recommended = result ? CONTENT.filter((c) => result.ids.includes(c.id)) : [];

  return (
    <AppShell>
      <header className="px-5 pt-8 pb-2">
        <div className="inline-flex items-center gap-1.5 text-primary text-xs font-bold tracking-widest uppercase">
          <Sparkles className="size-3.5" /> AI 큐레이션
        </div>
        <h1 className="text-2xl font-bold mt-1.5">우리 아이만을 위한 추천</h1>
        <p className="text-sm text-muted-foreground mt-1">관심사를 알려주면 골라드릴게요</p>
      </header>

      <form onSubmit={onSubmit} className="px-5 mt-4 space-y-4">
        <div>
          <label className="text-xs font-semibold text-muted-foreground">성장 단계</label>
          <div className="grid grid-cols-4 gap-2 mt-1.5">
            {STAGES.map((s) => (
              <button
                type="button"
                key={s.id}
                onClick={() => setStage(s.id)}
                className={`rounded-xl p-2.5 border text-center ${
                  stage === s.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border"
                }`}
              >
                <div className="text-lg">{s.emoji}</div>
                <div className="text-[10px] font-bold mt-0.5">{s.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground">관심사 · 상황</label>
          <textarea
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="예: 공룡을 좋아하고 잠들기 전에 읽어줄 책을 찾고 있어요"
            rows={3}
            className="mt-1.5 w-full bg-card border border-border rounded-2xl p-3.5 text-sm outline-none focus:border-primary resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !interests.trim()}
          className="w-full rounded-2xl bg-primary text-primary-foreground py-3.5 font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          {loading ? "추천 만드는 중..." : "AI 추천 받기"}
        </button>
      </form>

      {error && (
        <p className="mx-5 mt-4 p-3 rounded-xl bg-destructive/10 text-destructive text-xs">{error}</p>
      )}

      {result && (
        <div className="px-5 mt-6">
          <div className="rounded-2xl bg-secondary p-4 border border-border">
            <p className="text-xs font-bold text-primary mb-1">큐레이터 한마디</p>
            <p className="text-sm leading-relaxed">{result.reason}</p>
          </div>
          <h2 className="text-base font-bold mt-5 mb-2">추천 콘텐츠</h2>
          <div className="space-y-2">
            {recommended.map((c) => (
              <ContentRow key={c.id} item={c} />
            ))}
            {recommended.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">
                딱 맞는 콘텐츠가 없어요. 다른 관심사로 시도해보세요.
              </p>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}