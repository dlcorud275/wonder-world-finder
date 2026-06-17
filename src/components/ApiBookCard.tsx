import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, ShoppingBag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SEOCHO_LIBRARIES, type PopularBook } from "@/services/libraryApi";
import { copyTitleAndNotify } from "@/lib/copy-title";
import { searchNaverBooks } from "@/lib/naver-books.functions";

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
export function ApiBookCard({ book }: { book: PopularBook }) {
  const [open, setOpen] = useState(false);
  const q = encodeURIComponent(book.title);

  // 커버 이미지가 비어있으면 네이버 도서 검색으로 자동 보충
  const { data: fallbackCover } = useQuery({
    queryKey: ["book-cover", book.title, book.author],
    enabled: !book.imageUrl && !!book.title,
    staleTime: 1000 * 60 * 60 * 24,
    queryFn: async () => {
      const res = await searchNaverBooks({
        data: { query: book.author ? `${book.title} ${book.author}` : book.title, display: 3 },
      });
      return res.items[0]?.image ?? "";
    },
  });
  const coverUrl = book.imageUrl || fallbackCover || "";

  // 서초구립도서관 통합 검색 (공식): 검색 결과에서 소장 도서관/대출상태/예약을 확인합니다.
  const seochoSearchUrl = `https://public.seocholib.or.kr/Search/KeywordSearchResult/${q}`;
  // 네이버 도서 (구매/상세): https://search.shopping.naver.com/book
  const naverBookUrl = `https://search.shopping.naver.com/book/search?query=${q}`;

  return (
    <div className="rounded-2xl bg-card border border-border overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex gap-3 p-3 text-left active:scale-[0.99] transition-transform"
      >
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={book.title}
            loading="lazy"
            className="w-16 h-20 object-cover rounded-md bg-muted flex-none"
            onError={(e) => ((e.currentTarget as HTMLImageElement).style.visibility = "hidden")}
          />
        ) : (
          <div className="w-16 h-20 rounded-md bg-muted flex-none animate-pulse" />
        )}
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2">{book.title}</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{book.author}</p>
          <p className="text-[10px] text-muted-foreground truncate">{book.publisher}</p>
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
