import { useState } from "react";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import {
  checkBookAvailability,
  SEOCHO_LIBRARIES,
  type PopularBook,
  type AvailabilityResult,
} from "@/services/libraryApi";

type LibStatus =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "ready"; result: AvailabilityResult & { usedMock: boolean } };

export function ApiBookCard({ book }: { book: PopularBook }) {
  const [open, setOpen] = useState(false);
  const [statuses, setStatuses] = useState<Record<string, LibStatus>>({});

  const toggle = async () => {
    const next = !open;
    setOpen(next);
    if (!next) return;
    // 한 번이라도 조회한 적 있으면 재호출 안 함
    if (Object.keys(statuses).length > 0) return;

    const init: Record<string, LibStatus> = {};
    SEOCHO_LIBRARIES.forEach((l) => (init[l.libCode] = { state: "loading" }));
    setStatuses(init);

    await Promise.all(
      SEOCHO_LIBRARIES.map(async (l) => {
        const result = await checkBookAvailability(book.isbn, l.libCode);
        setStatuses((prev) => ({
          ...prev,
          [l.libCode]: { state: "ready", result },
        }));
      }),
    );
  };

  return (
    <div className="rounded-2xl bg-card border border-border overflow-hidden">
      <button
        onClick={toggle}
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
            서초구 도서관 대출 확인
            {open ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
          </span>
        </div>
      </button>

      {open && (
        <div className="border-t border-border px-3 py-2 space-y-1.5 bg-secondary/30">
          {SEOCHO_LIBRARIES.map((l) => {
            const s = statuses[l.libCode] ?? { state: "idle" };
            return (
              <div
                key={l.libCode}
                className="flex items-center justify-between text-[12px]"
              >
                <span className="text-foreground/90">{l.name}</span>
                {s.state === "loading" && (
                  <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
                )}
                {s.state === "ready" && <AvailabilityDot result={s.result} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AvailabilityDot({
  result,
}: {
  result: AvailabilityResult & { usedMock: boolean };
}) {
  if (!result.hasBook) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className="size-2.5 rounded-full bg-muted-foreground/40" />
        <span className="text-muted-foreground">미소장</span>
      </span>
    );
  }
  const color = result.loanAvailable ? "bg-emerald-500" : "bg-red-500";
  const label = result.loanAvailable ? "대출 가능" : "대출 중";
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`size-2.5 rounded-full ${color} shadow-[0_0_6px_currentColor]`} />
      <span className="text-foreground/80">
        {label}
        {result.usedMock && <span className="text-muted-foreground"> (가상)</span>}
      </span>
    </span>
  );
}