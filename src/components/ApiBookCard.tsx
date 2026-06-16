import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, ShoppingBag } from "lucide-react";
import { SEOCHO_LIBRARIES, type PopularBook } from "@/services/libraryApi";
import { copyTitleAndNotify } from "@/lib/copy-title";

/**
 * 실제 도서관/서점 검색 페이지로 연결되는 도서 카드.
 * - 각 서초구립도서관의 통합 검색 페이지(공식)로 ISBN 검색 결과를 새 탭으로 엽니다.
 * - 전국 단위 검색은 '도서관 정보나루' 공식 페이지로, 구매는 네이버 도서로 이동.
 */
export function ApiBookCard({ book }: { book: PopularBook }) {
  const [open, setOpen] = useState(false);
  const q = encodeURIComponent(book.title);

  // 서초구립도서관 통합 검색 (공식): 검색 결과에서 소장 도서관/대출상태/예약을 확인합니다.
  const seochoSearchUrl = `https://public.seocholib.or.kr/Search/KeywordSearchResult/${q}`;
  // 도서관 정보나루 도서 검색 (공식): https://www.data4library.kr
  const data4LibraryUrl = `https://www.data4library.kr/bookSearchList?keyword=${q}`;
  // 네이버 도서 (구매/상세): https://search.shopping.naver.com/book
  const naverBookUrl = `https://search.shopping.naver.com/book/search?query=${q}`;

  return (
    <div className="rounded-2xl bg-card border border-border overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex gap-3 p-3 text-left active:scale-[0.99] transition-transform"
      >
        {book.imageUrl ? (
          <img
            src={book.imageUrl}
            alt={book.title}
            loading="lazy"
            className="w-16 h-20 object-cover rounded-md bg-muted flex-none"
            onError={(e) => ((e.currentTarget as HTMLImageElement).style.visibility = "hidden")}
          />
        ) : (
          <div className="w-16 h-20 rounded-md bg-muted flex-none" />
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
              <a
                key={l.libCode}
                href={seochoSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => copyTitleAndNotify(book.title)}
                className="flex items-center justify-between gap-1 rounded-lg bg-card border border-border px-2 py-1.5 text-[11px] hover:bg-secondary"
              >
                <span className="truncate">{l.name.replace("서초구립", "")}</span>
                <ExternalLink className="size-3 text-muted-foreground flex-none" />
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-1.5 pt-1">
            <a
              href={data4LibraryUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => copyTitleAndNotify(book.title)}
              className="flex items-center justify-between rounded-lg bg-card border border-border px-3 py-2 text-[12px] hover:bg-secondary"
            >
              <span>전국 공공도서관 검색</span>
              <ExternalLink className="size-3.5 text-muted-foreground" />
            </a>
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
            * 링크를 누르면 책 제목이 복사되고, 공식 검색 결과에서 소장·대출·예약을 확인할 수
            있어요.
          </p>
        </div>
      )}
    </div>
  );
}