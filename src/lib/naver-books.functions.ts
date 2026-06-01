import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export interface NaverBook {
  title: string;
  link: string;
  image: string;
  author: string;
  publisher: string;
  isbn: string;
  description: string;
  pubdate: string;
  discount: string;
}

const inputSchema = z.object({
  query: z.string().min(1).max(200),
  display: z.number().int().min(1).max(20).optional(),
});

function stripHtml(s: string) {
  return s.replace(/<[^>]+>/g, "");
}

export const searchNaverBooks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }): Promise<{ items: NaverBook[]; error: string | null }> => {
    const clientId = process.env.NAVER_CLIENT_ID;
    const clientSecret = process.env.NAVER_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return { items: [], error: "네이버 API 키가 설정되지 않았어요." };
    }

    const url = new URL("https://openapi.naver.com/v1/search/book.json");
    url.searchParams.set("query", data.query);
    url.searchParams.set("display", String(data.display ?? 5));

    try {
      const res = await fetch(url.toString(), {
        headers: {
          "X-Naver-Client-Id": clientId,
          "X-Naver-Client-Secret": clientSecret,
        },
      });
      if (!res.ok) {
        const body = await res.text();
        console.error("Naver book search failed:", res.status, body);
        return { items: [], error: `네이버 도서 검색 실패 (${res.status})` };
      }
      const json = (await res.json()) as { items?: NaverBook[] };
      const items = (json.items ?? []).map((b) => ({
        ...b,
        title: stripHtml(b.title),
        author: stripHtml(b.author),
        publisher: stripHtml(b.publisher),
        description: stripHtml(b.description),
      }));
      return { items, error: null };
    } catch (err) {
      console.error("Naver book search error:", err);
      return { items: [], error: "네이버 도서 검색 요청 중 오류가 발생했어요." };
    }
  });