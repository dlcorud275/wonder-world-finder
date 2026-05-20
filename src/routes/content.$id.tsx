import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Thumb } from "@/components/ContentCard";
import { CONTENT, libraryLinks } from "@/lib/content-data";
import { useBookmarks } from "@/lib/bookmarks";
import { ArrowLeft, Bookmark, BookmarkCheck, ExternalLink, Play } from "lucide-react";

export const Route = createFileRoute("/content/$id")({
  component: Detail,
});

function Detail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const item = CONTENT.find((c) => c.id === id);
  const { has, toggle } = useBookmarks();

  if (!item) {
    return (
      <AppShell>
        <div className="p-8 text-center">
          <p>콘텐츠를 찾을 수 없습니다.</p>
          <Link to="/" className="text-primary underline mt-3 inline-block">홈으로</Link>
        </div>
      </AppShell>
    );
  }

  const bookmarked = has(item.id);

  return (
    <AppShell>
      <div className="relative">
        <Thumb item={item} className="h-64 w-full" />
        <button
          onClick={() => navigate({ to: "/" })}
          className="absolute top-4 left-4 size-10 rounded-full bg-background/90 backdrop-blur grid place-items-center"
          aria-label="뒤로"
        >
          <ArrowLeft className="size-5" />
        </button>
        <button
          onClick={() => toggle(item.id)}
          className="absolute top-4 right-4 size-10 rounded-full bg-background/90 backdrop-blur grid place-items-center text-primary"
          aria-label="북마크"
        >
          {bookmarked ? <BookmarkCheck className="size-5" /> : <Bookmark className="size-5" />}
        </button>
      </div>

      <div className="px-5 pt-5 pb-8">
        <p className="text-[11px] font-bold tracking-widest text-primary uppercase">
          {item.kind === "book" ? "도서" : "영상"} · {item.ages}
        </p>
        <h1 className="text-2xl font-bold mt-1.5 leading-tight">{item.title}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{item.creator}</p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {item.tags.map((t) => (
            <span key={t} className="text-[11px] px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground font-medium">
              #{t}
            </span>
          ))}
        </div>

        <Section title="줄거리">{item.summary}</Section>
        <Section title="이 콘텐츠가 좋은 이유">{item.why}</Section>

        {item.kind === "video" && item.videoUrl && (
          <a
            href={item.videoUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 flex items-center justify-center gap-2 w-full rounded-2xl bg-primary text-primary-foreground py-3.5 font-semibold"
          >
            <Play className="size-4 fill-current" /> 영상 보러가기
          </a>
        )}

        {item.kind === "book" && (
          <div className="mt-6">
            <h3 className="text-sm font-bold mb-2">📚 도서관 · 서점에서 찾기</h3>
            <div className="space-y-2">
              {libraryLinks(item.title).map((l) => (
                <a
                  key={l.name}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-card border border-border"
                >
                  <span className="font-semibold text-sm">{l.name}</span>
                  <ExternalLink className="size-4 text-muted-foreground" />
                </a>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 px-1">
              가까운 공공 도서관에서 무료로 대여하실 수 있어요.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <h3 className="text-sm font-bold mb-1.5">{title}</h3>
      <p className="text-sm leading-relaxed text-foreground/85">{children}</p>
    </div>
  );
}