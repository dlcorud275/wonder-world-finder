// 도서관 정보나루 (data4library.kr) OpenAPI 연동 서비스 레이어.
// API Key 보안 + CORS 회피를 위해 외부 프록시 / Supabase Edge Function 경유 호출을 가정합니다.
// 엔드포인트는 환경변수(VITE_LIBRARY_API_BASE)로 주입하거나 기본 placeholder 사용.

const BASE_URL =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_LIBRARY_API_BASE) ||
  "https://api.example-proxy.dev/data4library";

const DEFAULT_TIMEOUT_MS = 7000;

export type AgeGroup = "infant" | "toddler" | "early" | "middle";

export interface PopularBook {
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  imageUrl: string;
}

export interface AvailabilityResult {
  hasBook: boolean;       // 소장 여부
  loanAvailable: boolean; // 대출 가능 여부
}

// 서초구 주요 도서관 (도서관 정보나루 libCode 매칭 - 실제 운영 시 정확한 코드로 교체)
export const SEOCHO_LIBRARIES: { name: string; libCode: string }[] = [
  { name: "서초구립반포도서관", libCode: "141053" },
  { name: "서초구립양재도서관", libCode: "141054" },
  { name: "서초구립방배도서관", libCode: "141055" },
  { name: "서초구립내곡도서관", libCode: "141056" },
];

async function fetchWithTimeout(url: string, ms = DEFAULT_TIMEOUT_MS) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

// ── Mock fallback 데이터 (오프라인 / 장애 시 대체) ────────────────────────────
const MOCK_POPULAR: Record<AgeGroup, PopularBook[]> = {
  infant: [
    { isbn: "9788491011644", title: "달님 안녕", author: "하야시 아키코", publisher: "한림출판사", imageUrl: "https://covers.openlibrary.org/b/isbn/9788970940434-L.jpg" },
    { isbn: "9788901234567", title: "사과가 쿵!", author: "다다 히로시", publisher: "보림", imageUrl: "https://covers.openlibrary.org/b/isbn/9788943304041-L.jpg" },
    { isbn: "9780689815812", title: "곰 사냥을 떠나자", author: "마이클 로젠", publisher: "시공주니어", imageUrl: "https://covers.openlibrary.org/b/isbn/9780689815812-L.jpg" },
    { isbn: "9780399226908", title: "배고픈 애벌레", author: "에릭 칼", publisher: "더큰", imageUrl: "https://covers.openlibrary.org/b/isbn/9780399226908-L.jpg" },
  ],
  toddler: [
    { isbn: "9788901111111", title: "구름빵", author: "백희나", publisher: "한솔수북", imageUrl: "https://covers.openlibrary.org/b/isbn/9788970949154-L.jpg" },
    { isbn: "9788901111112", title: "달 샤베트", author: "백희나", publisher: "책읽는곰", imageUrl: "https://covers.openlibrary.org/b/isbn/9788993242560-L.jpg" },
    { isbn: "9780064431781", title: "괴물들이 사는 나라", author: "모리스 센닥", publisher: "시공주니어", imageUrl: "https://covers.openlibrary.org/b/isbn/9780064431781-L.jpg" },
    { isbn: "9788901111114", title: "지각대장 존", author: "존 버닝햄", publisher: "비룡소", imageUrl: "https://covers.openlibrary.org/b/isbn/9780099400790-L.jpg" },
  ],
  early: [
    { isbn: "9788949161389", title: "마법의 시간여행 1", author: "메리 폽 어즈번", publisher: "비룡소", imageUrl: "https://covers.openlibrary.org/b/isbn/9780679824114-L.jpg" },
    { isbn: "9788949161390", title: "Why? 인체", author: "예림당", publisher: "예림당", imageUrl: "https://covers.openlibrary.org/b/isbn/9788956378732-L.jpg" },
    { isbn: "9788949161391", title: "이상한 과자가게 전천당", author: "히로시마 레이코", publisher: "길벗스쿨", imageUrl: "https://covers.openlibrary.org/b/isbn/9788965474425-L.jpg" },
    { isbn: "9788949161392", title: "엉덩이 탐정", author: "트롤", publisher: "미래엔아이세움", imageUrl: "https://covers.openlibrary.org/b/isbn/9788937893803-L.jpg" },
  ],
  middle: [
    { isbn: "9788963729930", title: "용선생의 시끌벅적 한국사 1", author: "용선생", publisher: "사회평론", imageUrl: "https://covers.openlibrary.org/b/isbn/9788963729930-L.jpg" },
    { isbn: "9788972596493", title: "해리포터와 마법사의 돌", author: "J.K. 롤링", publisher: "문학수첩", imageUrl: "https://covers.openlibrary.org/b/isbn/9780747532699-L.jpg" },
    { isbn: "9788937834790", title: "샬롯의 거미줄", author: "E.B. 화이트", publisher: "시공주니어", imageUrl: "https://covers.openlibrary.org/b/isbn/9780064400558-L.jpg" },
    { isbn: "9788936433598", title: "몽실 언니", author: "권정생", publisher: "창비", imageUrl: "https://covers.openlibrary.org/b/isbn/9788936443597-L.jpg" },
  ],
};

export class LibraryApiError extends Error {
  constructor(message: string, public usedMock = false) {
    super(message);
  }
}

/** 다대출 도서 API 호출 (연령별 인기 도서) */
export async function fetchPopularBooks(
  ageGroup: AgeGroup,
): Promise<{ books: PopularBook[]; usedMock: boolean; errorMessage?: string }> {
  try {
    const url = `${BASE_URL}/popular?age=${encodeURIComponent(ageGroup)}`;
    const json = await fetchWithTimeout(url);
    const list = (json?.response?.docs ?? json?.docs ?? json?.books ?? []) as any[];
    if (!Array.isArray(list) || list.length === 0) throw new Error("Empty response");
    const books: PopularBook[] = list.map((d) => {
      const doc = d.doc ?? d;
      return {
        isbn: String(doc.isbn13 ?? doc.isbn ?? ""),
        title: String(doc.bookname ?? doc.title ?? ""),
        author: String(doc.authors ?? doc.author ?? ""),
        publisher: String(doc.publisher ?? ""),
        imageUrl: String(doc.bookImageURL ?? doc.imageUrl ?? ""),
      };
    });
    return { books, usedMock: false };
  } catch (err) {
    console.warn("[libraryApi] fetchPopularBooks fallback:", err);
    return {
      books: MOCK_POPULAR[ageGroup],
      usedMock: true,
      errorMessage:
        "도서관 정보 시스템과 연결이 원활하지 않습니다. 가상 데이터로 대체합니다.",
    };
  }
}

/** 지역별 소장도서 조회 API 호출 (특정 도서관 대출 가능 여부) */
export async function checkBookAvailability(
  isbn: string,
  libCode: string,
): Promise<AvailabilityResult & { usedMock: boolean }> {
  try {
    const url = `${BASE_URL}/availability?isbn=${encodeURIComponent(isbn)}&libCode=${encodeURIComponent(libCode)}`;
    const json = await fetchWithTimeout(url, 5000);
    const book = json?.response?.result?.book ?? json?.book ?? json;
    const hasBook = Boolean(book?.hasBook === "Y" || book?.hasBook === true);
    const loanAvailable = Boolean(book?.loanAvailable === "Y" || book?.loanAvailable === true);
    return { hasBook, loanAvailable, usedMock: false };
  } catch (err) {
    console.warn("[libraryApi] checkBookAvailability fallback:", err);
    // 결정론적 mock: isbn+libCode 해시 기반
    const seed = (isbn + libCode).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const hasBook = seed % 4 !== 0; // 75% 소장
    const loanAvailable = hasBook && seed % 3 !== 0; // 소장 중 약 66% 대출가능
    return { hasBook, loanAvailable, usedMock: true };
  }
}