import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { Thumb } from "@/components/ContentCard";
import { CONTENT, shopLinks } from "@/lib/content-data";
import { nearestLibraries, type SeoulLibrary } from "@/lib/seoul-libraries";
import { searchNaverBooks } from "@/lib/naver-books.functions";
import { useBookmarks } from "@/lib/bookmarks";
import { copyTitleAndNotify } from "@/lib/copy-title";
import { ArrowLeft, Bookmark, BookmarkCheck, ExternalLink, Play, MapPin, ShoppingBag } from "lucide-react";
import { useState } from "react";

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
        <Thumb item={item} contain className="h-80 w-full px-8 py-6" />
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
          <>
            <NaverBookSection title={item.title} />
            <BookFindSection title={item.title} />
          </>
        )}
      </div>
    </AppShell>
  );
}

function NaverBookSection({ title }: { title: string }) {
  const fetcher = useServerFn(searchNaverBooks);
  const { data, isLoading, error } = useQuery({
    queryKey: ["naver-books", title],
    queryFn: () => fetcher({ data: { query: title, display: 5 } }),
    staleTime: 1000 * 60 * 10,
  });

  return (
    <div className="mt-6">
      <h3 className="text-sm font-bold mb-2">🔎 네이버 도서 검색</h3>
      {isLoading && (
        <p className="text-[12px] text-muted-foreground px-1">검색 중...</p>
      )}
      {error && (
        <p className="text-[12px] text-destructive px-1">검색에 실패했어요.</p>
      )}
      {data?.error && (
        <p className="text-[12px] text-destructive px-1">{data.error}</p>
      )}
      {data && data.items.length === 0 && !data.error && !isLoading && (
        <p className="text-[12px] text-muted-foreground px-1">검색 결과가 없어요.</p>
      )}
      <div className="space-y-2">
        {data?.items.map((b) => (
          <a
            key={b.link}
            href={b.link}
            target="_blank"
            rel="noreferrer"
            className="flex gap-3 p-3 rounded-2xl bg-card border border-border"
          >
            {b.image ? (
              <img
                src={b.image}
                alt={b.title}
                className="w-12 h-16 object-cover rounded-md flex-none bg-muted"
                loading="lazy"
              />
            ) : (
              <div className="w-12 h-16 rounded-md bg-muted flex-none" />
            )}
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm leading-snug line-clamp-2">{b.title}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                {b.author || "저자 미상"}
                {b.publisher ? ` · ${b.publisher}` : ""}
              </p>
              {b.discount && (
                <p className="text-[11px] text-primary font-semibold mt-0.5">
                  {Number(b.discount).toLocaleString()}원
                </p>
              )}
            </div>
            <ExternalLink className="size-4 text-muted-foreground flex-none self-center" />
          </a>
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground mt-2 px-1">
        검색 결과는 네이버 책 검색 오픈 API를 통해 제공됩니다.
      </p>
    </div>
  );
}

function BookFindSection({ title }: { title: string }) {
  const [geoState, setGeoState] = useState<"idle" | "loading" | "error">("idle");
  const [geoMsg, setGeoMsg] = useState<string>("");
  const [nearby, setNearby] = useState<(SeoulLibrary & { distanceKm: number })[]>([]);

  const findNearby = () => {
    if (!("geolocation" in navigator)) {
      setGeoState("error");
      setGeoMsg("이 기기에서는 위치 정보를 사용할 수 없어요.");
      return;
    }
    setGeoState("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setNearby(nearestLibraries(pos.coords.latitude, pos.coords.longitude, 5));
        setGeoState("idle");
      },
      (err) => {
        setGeoState("error");
        setGeoMsg(
          err.code === err.PERMISSION_DENIED
            ? "위치 권한이 거부되었어요. 브라우저 설정에서 허용해 주세요."
            : "위치를 가져오지 못했어요. 잠시 후 다시 시도해 주세요.",
        );
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 5 * 60 * 1000 },
    );
  };

  return (
    <>
      <div className="mt-6">
        <h3 className="text-sm font-bold mb-2">📚 서울 공공도서관에서 빌리기</h3>
        <button
          onClick={findNearby}
          disabled={geoState === "loading"}
          className="flex items-center justify-between w-full p-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm active:scale-[0.99] transition-transform disabled:opacity-60"
        >
          <span className="flex items-center gap-2">
            <MapPin className="size-4" />
            {geoState === "loading" ? "위치 확인 중..." : "내 위치로 가까운 서울 도서관 찾기"}
          </span>
          <ExternalLink className="size-4" />
        </button>
        {geoState === "error" && (
          <p className="text-[11px] text-destructive mt-1.5 px-1">{geoMsg}</p>
        )}
        {nearby.length > 0 && (
          <div className="space-y-2 mt-2">
            {nearby.map((l) => {
              // 각 도서관 사이트의 카탈로그 URL 패턴이 모두 달라, 도서명과 도서관 사이트를
              // 조합한 구글 검색으로 실제 소장/검색 결과 페이지로 연결합니다.
              const site = new URL(l.homepage).host;
              const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
                `${title} site:${site}`,
              )}`;
              return (
                <div
                  key={l.name}
                  className="rounded-2xl bg-card border border-border overflow-hidden"
                >
                  <a
                    href={searchUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => copyTitleAndNotify(title)}
                    className="flex items-center justify-between p-3.5"
                  >
                    <span className="flex flex-col">
                      <span className="font-semibold text-sm">{l.name}</span>
                      <span className="text-[11px] text-muted-foreground">
                        {l.district} · {l.distanceKm.toFixed(1)}km · 이 도서관에서 검색
                      </span>
                    </span>
                    <ExternalLink className="size-4 text-muted-foreground" />
                  </a>
                  <a
                    href={l.homepage}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => copyTitleAndNotify(title)}
                    className="block border-t border-border px-3.5 py-2 text-[11px] text-muted-foreground hover:bg-secondary/40"
                  >
                    도서관 홈페이지 바로가기 →
                  </a>
                </div>
              );
            })}
          </div>
        )}
        <a
          href={`https://public.seocholib.or.kr/SOLARS_DM/main/menu/search/searchResult.do?searchType=ALL&searchKeyword=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noreferrer"
          onClick={() => copyTitleAndNotify(title)}
          className="flex items-center justify-between p-3.5 rounded-2xl bg-card border border-border mt-2"
        >
          <span className="flex flex-col">
            <span className="font-semibold text-sm">서초구립도서관 통합 검색</span>
            <span className="text-[11px] text-muted-foreground">반포·양재·방배·내곡 등</span>
          </span>
          <ExternalLink className="size-4 text-muted-foreground" />
        </a>
        <p className="text-[11px] text-muted-foreground mt-2 px-1">
          서울 공공도서관 데이터는 서울 열린데이터광장 · 도서관정보나루(CC BY) 오픈 API 기반입니다.
        </p>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-bold mb-2 flex items-center gap-1.5">
          <ShoppingBag className="size-4" /> 구매하기
        </h3>
        <div className="space-y-2">
          {shopLinks(title).map((l) => (
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
      </div>
    </>
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