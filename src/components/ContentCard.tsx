import { Link } from "@tanstack/react-router";
import { BookOpen, Play, Bookmark, BookmarkCheck } from "lucide-react";
import type { ContentItem } from "@/lib/content-data";
import { useBookmarks } from "@/lib/bookmarks";

export function Thumb({ item, className = "" }: { item: ContentItem; className?: string }) {
  const bg = `linear-gradient(135deg, oklch(0.88 0.06 ${item.hue}), oklch(0.78 0.05 ${(item.hue + 40) % 360}))`;
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{ background: bg }}
    >
      {item.coverUrl ? (
        <img
          src={item.coverUrl}
          alt={item.title}
          loading="lazy"
          className="absolute inset-0 size-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      ) : null}
      <span className="relative text-5xl drop-shadow-sm">{item.emoji}</span>
      <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-semibold text-foreground">
        {item.kind === "book" ? <BookOpen className="size-3" /> : <Play className="size-3" />}
        {item.kind === "book" ? "책" : "영상"}
      </span>
    </div>
  );
}

export function ContentCard({ item }: { item: ContentItem }) {
  const { has, toggle } = useBookmarks();
  const bookmarked = has(item.id);
  return (
    <Link
      to="/content/$id"
      params={{ id: item.id }}
      className="group block rounded-3xl bg-card border border-border overflow-hidden active:scale-[0.98] transition-transform"
    >
      <Thumb item={item} className="h-32 w-full" />
      <div className="p-3 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-sm truncate">{item.title}</h3>
            <p className="text-[11px] text-muted-foreground truncate">{item.creator}</p>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              toggle(item.id);
            }}
            className="shrink-0 -mr-1 -mt-1 p-1.5 rounded-full hover:bg-secondary text-primary"
            aria-label="북마크"
          >
            {bookmarked ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
          </button>
        </div>
        <p className="text-[10px] text-accent-foreground/70 font-medium">{item.ages}</p>
      </div>
    </Link>
  );
}

export function ContentRow({ item }: { item: ContentItem }) {
  return (
    <Link
      to="/content/$id"
      params={{ id: item.id }}
      className="flex gap-3 p-3 rounded-2xl bg-card border border-border active:scale-[0.99] transition-transform"
    >
      <Thumb item={item} className="size-20 rounded-xl shrink-0" />
      <div className="min-w-0 flex-1 flex flex-col justify-center">
        <p className="text-[10px] font-semibold text-primary">{item.ages} · {item.kind === "book" ? "책" : "영상"}</p>
        <h3 className="font-semibold text-sm leading-tight mt-0.5 truncate">{item.title}</h3>
        <p className="text-xs text-muted-foreground truncate">{item.creator}</p>
        {item.mustRead && (
          <span className="mt-1 inline-flex w-fit items-center gap-1 rounded-full bg-primary/15 text-primary px-2 py-0.5 text-[10px] font-bold">
            ⭐ 추천 필독서
          </span>
        )}
      </div>
    </Link>
  );
}