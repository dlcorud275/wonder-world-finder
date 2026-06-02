// 도서 추천 데이터 서비스 레이어.
// 실제 도서 검색은 네이버 도서 검색 OpenAPI(서버 함수)를 통해 수행하며,
// API 실패 시 큐레이션된 백업 도서 목록으로 graceful fallback 합니다.
import { searchNaverBooks } from "@/lib/naver-books.functions";

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

const AGE_QUERIES: Record<AgeGroup, string> = {
  infant: "0-3세 그림책",
  toddler: "유아 그림책 베스트",
  early: "초등 저학년 동화 추천",
  middle: "초등 고학년 추천도서",
};

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

/** 연령별 인기/추천 도서 (네이버 도서 검색 OpenAPI 기반) */
export async function fetchPopularBooks(
  ageGroup: AgeGroup,
): Promise<{ books: PopularBook[]; usedMock: boolean; errorMessage?: string }> {
  try {
    const result = await searchNaverBooks({
      data: { query: AGE_QUERIES[ageGroup], display: 10 },
    });
    if (result.error || result.items.length === 0) {
      throw new Error(result.error ?? "Empty response");
    }
    const books: PopularBook[] = result.items.map((b) => ({
      // ISBN10/ISBN13 둘 다 올 수 있어 마지막(보통 ISBN13) 선택
      isbn: (b.isbn || "").split(" ").pop() || "",
      title: b.title,
      author: b.author.replace(/\^/g, ", "),
      publisher: b.publisher,
      imageUrl: b.image,
    }));
    return { books, usedMock: false };
  } catch (err) {
    console.warn("[libraryApi] fetchPopularBooks fallback:", err);
    return {
      books: MOCK_POPULAR[ageGroup],
      usedMock: true,
      errorMessage: "추천 도서를 실시간으로 불러오지 못해 큐레이션된 목록을 보여드려요.",
    };
  }
}

// 실시간 소장/대출 조회 API는 CORS와 보안상 직접 호출이 어렵습니다.
// 대신 각 도서관 공식 사이트의 검색 결과로 사용자를 안내합니다 (ApiBookCard 참고).