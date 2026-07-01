import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, Heart, ShoppingBag } from "lucide-react";
import { SEOCHO_LIBRARIES, type PopularBook } from "@/services/libraryApi";
import { copyTitleAndNotify } from "@/lib/copy-title";
import { useApiBookmarks } from "@/lib/bookmarks";

/**
 * 서초도서관# 앱 딥링크 시도 후 800ms 안에 포커스가 살아있으면 웹 검색으로 폴백.
 * (앱이 설치되어 있고 로그인되어 있으면 앱의 검색 결과로 랜딩됩니다.)
 */
function openSeochoApp(title: string, webFallback: string) {
  copyTitleAndNotify(title);
  const scheme = `seocholibrary://search?keyword=${encodeURIComponent(title)}`;
  const start = Date.now();
  const timer = window.setTimeout(() => {
    if (Date.now() - start < 1600 && document.visibilityState === "visible") {
      window.open(webFallback, "_blank", "noopener,noreferrer");
    }
  }, 800);
  const cancel = () => {
    if (document.visibilityState === "hidden") window.clearTimeout(timer);
  };
  document.addEventListener("visibilitychange", cancel, { once: true });
  window.location.href = scheme;
}

/**
 * 실제 도서관/서점 검색 페이지로 연결되는 도서 카드.
 * - 각 서초구립도서관의 통합 검색 페이지(공식)로 ISBN 검색 결과를 새 탭으로 엽니다.
 * - 전국 단위 검색은 '도서관 정보나루' 공식 페이지로, 구매는 네이버 도서로 이동.
 */
export function ApiBookCard({
  book,
  readingLevel,
}: {
  book: PopularBook;
  readingLevel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const bookmarks = useApiBookmarks();
  const saved = bookmarks.has(book);
  const q = encodeURIComponent(book.title);

  // 항상 서버 프록시를 통해 커버 이미지를 받아옴 (없으면 SVG 플레이스홀더 반환 → 무조건 표시)
  const proxyUrl = useMemo(() => {
    const p = new URLSearchParams({
      title: book.title,
      author: book.author ?? "",
      isbn: book.isbn ?? "",
    });
    return `/api/public/cover?${p.toString()}`;
  }, [book.title, book.author, book.isbn]);
  // 원본 imageUrl이 있으면 우선 시도 (referrer 없이 로드), 실패 시 프록시로 폴백
  const coverUrl = imgFailed || !book.imageUrl ? proxyUrl : book.imageUrl;

  // 서초구립도서관 통합 검색 (공식): 검색 결과에서 소장 도서관/대출상태/예약을 확인합니다.
  const seochoSearchUrl = `https://public.seocholib.or.kr/Search/KeywordSearchResult/${q}`;
  // 네이버 도서 (구매/상세): https://search.shopping.naver.com/book
  const naverBookUrl = `https://search.shopping.naver.com/book/search?query=${q}`;

  return (
    <div className="rounded-3xl bg-card border-2 border-border overflow-hidden shadow-[0_3px_0_0_var(--color-accent)] relative">
      <button
        type="button"
        aria-label={saved ? "보관함에서 제거" : "보관함에 저장"}
        onClick={(e) => {
          e.stopPropagation();
          bookmarks.toggle(book);
        }}
        className={`absolute top-2 right-2 z-10 rounded-full p-1.5 border-2 shadow-sm transition-transform active:scale-90 ${
          saved
            ? "bg-destructive text-destructive-foreground border-destructive"
            : "bg-card text-muted-foreground border-border"
        }`}
      >
        <Heart className={`size-3.5 ${saved ? "fill-current" : ""}`} />
      </button>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex gap-3 p-3 text-left active:scale-[0.99] transition-transform"
      >
        <img
          src={coverUrl}
          alt={book.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-16 h-20 object-cover rounded-xl bg-muted flex-none ring-1 ring-border"
          onError={() => {
            if (!imgFailed) setImgFailed(true);
          }}
        />
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2">{book.title}</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{book.author}</p>
          <p className="text-[10px] text-muted-foreground truncate">{book.publisher}</p>
          {readingLevel && (
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-accent/40 text-accent-foreground px-2 py-0.5 text-[10px] font-bold">
              📘 {readingLevel}
            </span>
          )}
          <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-primary font-semibold">
            도서관·서점에서 찾기
            {open ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
          </span>
        </div>
      </button>

      {open && (
        <div className="border-t border-border px-3 py-2.5 space-y-2 bg-secondary/30">
          <p className="text-[11px] font-semibold text-muted-foreground">서초구립도서관 통합검색</p>
          <div className="grid grid-cols-2 gap-1.5">
            {SEOCHO_LIBRARIES.map((l) => (
              <button
                key={l.libCode}
                type="button"
                onClick={() => openSeochoApp(book.title, seochoSearchUrl)}
                className="flex items-center justify-between gap-1 rounded-lg bg-card border border-border px-2 py-1.5 text-[11px] hover:bg-secondary"
              >
                <span className="truncate">{l.name.replace("서초구립", "")}</span>
                <ExternalLink className="size-3 text-muted-foreground flex-none" />
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-1.5 pt-1">
            <a
              href={naverBookUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => copyTitleAndNotify(book.title)}
              className="flex items-center justify-between rounded-lg bg-primary text-primary-foreground px-3 py-2 text-[12px] font-semibold"
            >
              <span className="inline-flex items-center gap-1.5">
                <ShoppingBag className="size-3.5" />
                구매하기 (네이버 도서)
              </span>
              <ExternalLink className="size-3.5 opacity-80" />
            </a>
          </div>
          <p className="text-[10px] text-muted-foreground pt-0.5">
            * 도서관 버튼을 누르면 책 제목이 복사돼요. <b>서초도서관# 앱</b>이 설치되어 있으면 앱에서
            바로 검색되고, 없으면 공식 통합검색 웹페이지가 열려요.
          </p>
        </div>
      )}
    </div>
  );
}
