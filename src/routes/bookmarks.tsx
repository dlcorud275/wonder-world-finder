import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ContentRow } from "@/components/ContentCard";
import { CONTENT } from "@/lib/content-data";
import { useBookmarks } from "@/lib/bookmarks";
import { Bookmark } from "lucide-react";

export const Route = createFileRoute("/bookmarks")({
  head: () => ({ meta: [{ title: "보관함 — 키즈네스트" }] }),
  component: Bookmarks,
});

function Bookmarks() {
  const { ids } = useBookmarks();
  const items = CONTENT.filter((c) => ids.includes(c.id));
  return (
    <AppShell>
      <header className="px-5 pt-8 pb-4">
        <h1 className="text-2xl font-bold">내 보관함</h1>
        <p className="text-sm text-muted-foreground">{items.length}개 저장됨</p>
      </header>
      <div className="px-5 space-y-2">
        {items.length === 0 ? (
          <div className="text-center py-16 px-6">
            <Bookmark className="mx-auto size-10 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              마음에 드는 책·영상을 저장해보세요
            </p>
            <Link
              to="/"
              className="inline-block mt-4 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold"
            >
              둘러보기
            </Link>
          </div>
        ) : (
          items.map((c) => <ContentRow key={c.id} item={c} />)
        )}
      </div>
    </AppShell>
  );
}