import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ContentCard, ContentRow } from "@/components/ContentCard";
import { LangTabs } from "@/components/LangTabs";
import { CONTENT, STAGES, type Stage, type Language } from "@/lib/content-data";
import { getChildProfile, stageFromBirthYear } from "@/lib/child-profile";
import { Sparkles, RefreshCw, Settings } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const profile = getChildProfile();
  const stage: Stage = stageFromBirthYear(profile.birthYear);
  const [lang, setLang] = useState<Language>("en");
  const [bookSeed, setBookSeed] = useState(0);
  const items = CONTENT.filter(
    (c) => c.stage === stage && (c.language ?? "ko") === lang,
  );
  const allBooks = items.filter((i) => i.kind === "book");
  const books = pickRotation(allBooks, 10, bookSeed);
  const videos = items.filter((i) => i.kind === "video");
  const stageInfo = STAGES.find((s) => s.id === stage);

  return (
    <AppShell>
      <header className="px-5 pt-8 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">Kidsnest</p>
            <h1 className="text-2xl font-bold mt-1">오늘은 어떤 이야기를{"\n"}만나볼까요?</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {profile.name} · {stageInfo?.label} ({stageInfo?.ages})
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
        <div className="mt-3"><LangTabs value={lang} onChange={setLang} /></div>
      </header>

      <section className="px-5 mt-6">
        <Link
          to="/ai"
          className="flex items-center gap-3 rounded-2xl bg-secondary p-4 border border-border"
        >
          <div className="size-10 rounded-xl bg-primary text-primary-foreground grid place-items-center">
            <Sparkles className="size-5" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">AI 맞춤 추천 받기</p>
            <p className="text-xs text-muted-foreground">아이 관심사를 알려주면 골라드려요</p>
          </div>
        </Link>
      </section>

      <section className="px-5 mt-7">
        <div className="flex items-end justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold">추천 책</h2>
            <p className="text-xs text-muted-foreground">
              {stageInfo?.desc}
              {allBooks.length > 0 && ` · ${Math.min(10, allBooks.length)}/${allBooks.length}`}
            </p>
          </div>
          {allBooks.length > 10 && (
            <button
              onClick={() => setBookSeed((s) => s + 1)}
              className="inline-flex items-center gap-1.5 rounded-full bg-secondary border border-border px-3 py-1.5 text-xs font-semibold text-foreground active:scale-95 transition-transform"
              aria-label="새로운 추천"
            >
              <RefreshCw className="size-3.5" />
              새로 보기
            </button>
          )}
        </div>
        {books.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {books.map((b) => <ContentCard key={b.id} item={b} />)}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">표시할 책이 없어요</p>
        )}
      </section>

      <section className="px-5 mt-7">
        <SectionTitle title="추천 영상" subtitle="검증된 교육 채널 위주" />
        {videos.length > 0 ? (
          <div className="space-y-2">
            {videos.map((v) => <ContentRow key={v.id} item={v} />)}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">표시할 영상이 없어요</p>
        )}
      </section>
    </AppShell>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-3">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function pickRotation<T>(arr: T[], n: number, seed: number): T[] {
  if (arr.length <= n) return arr;
  const start = (seed * n) % arr.length;
  const out: T[] = [];
  for (let i = 0; i < n; i++) out.push(arr[(start + i) % arr.length]);
  return out;
}
