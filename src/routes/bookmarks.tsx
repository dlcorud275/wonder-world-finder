import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ContentRow } from "@/components/ContentCard";
import { ApiBookCard } from "@/components/ApiBookCard";
import { CONTENT } from "@/lib/content-data";
import { useBookmarks, useApiBookmarks } from "@/lib/bookmarks";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/bookmarks")({
  head: () => ({ meta: [{ title: "보관함 — 키즈네스트" }] }),
  component: Bookmarks,
});

function Bookmarks() {
  const { ids } = useBookmarks();
  const { items: apiItems } = useApiBookmarks();
  const items = CONTENT.filter((c) => ids.includes(c.id));
  const total = items.length + apiItems.length;
  return (
    <AppShell>
      <header className="px-5 pt-8 pb-4">
        <h1 className="text-2xl font-bold">🍓 내 보관함</h1>
        <p className="text-sm text-muted-foreground">{total}권 저장됨</p>
      </header>
      <div className="px-5 space-y-3">
        {total === 0 ? (
          <div className="text-center py-16 px-6">
            <Heart className="mx-auto size-10 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              마음에 드는 책·영상을 저장해보세요
            </p>
            <Link
              to="/"
              className="inline-block mt-4 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-bold shadow-[0_3px_0_0_var(--color-accent-foreground)]"
            >
              둘러보기
            </Link>
          </div>
        ) : (
          <>
            {apiItems.length > 0 && (
              <section className="space-y-2">
                <h2 className="text-xs font-bold text-primary uppercase tracking-widest">추천 도서</h2>
                {apiItems.map((b) => (
                  <ApiBookCard key={b.isbn || b.title} book={b} />
                ))}
              </section>
            )}
            {items.length > 0 && (
              <section className="space-y-2">
                <h2 className="text-xs font-bold text-primary uppercase tracking-widest">큐레이션</h2>
                {items.map((c) => (
                  <ContentRow key={c.id} item={c} />
                ))}
              </section>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}