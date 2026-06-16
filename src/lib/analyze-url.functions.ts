import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { generateText, Output } from "ai";

const InputSchema = z.object({
  url: z.string().url(),
});

export interface AnalyzedBook {
  title: string;
  author: string;
  publisher: string;
  reason: string;
  isbn: string;
  imageUrl: string;
}

export interface AnalyzeResult {
  sourceTitle: string;
  books: AnalyzedBook[];
}

function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTitle(html: string): string {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? htmlToText(m[1]).slice(0, 120) : "";
}

// 네이버 블로그/티스토리 등 iframe 내부 본문을 가져오기 위한 URL 보정
function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    // 네이버 블로그: blog.naver.com/{id}/{logNo} → PostView.naver
    if (u.hostname === "blog.naver.com") {
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts.length >= 2) {
        return `https://blog.naver.com/PostView.naver?blogId=${parts[0]}&logNo=${parts[1]}`;
      }
    }
    return url;
  } catch {
    return url;
  }
}

export const analyzeUrlFn = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<AnalyzeResult> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI 키가 설정되지 않았어요.");

    const target = normalizeUrl(data.url);

    let html = "";
    try {
      const res = await fetch(target, {
        headers: {
          "user-agent":
            "Mozilla/5.0 (compatible; KidsnestBot/1.0; +https://kidsnest.app)",
          accept: "text/html,application/xhtml+xml",
        },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      html = await res.text();
    } catch (e) {
      throw new Error("URL을 불러오지 못했어요. 주소를 확인해 주세요.");
    }

    const sourceTitle = extractTitle(html);
    const text = htmlToText(html).slice(0, 12000);
    if (text.length < 100) {
      throw new Error("페이지에서 본문을 충분히 찾지 못했어요.");
    }

    const gateway = createOpenAICompatible({
      name: "lovable",
      baseURL: "https://ai.gateway.lovable.dev/v1",
      headers: { "Lovable-API-Key": apiKey },
    });

    const prompt = `다음은 교육 인플루언서/블로그의 포스트 본문입니다. 이 글에서 추천하는 어린이/청소년 도서를 모두 추출하세요.\n\n규칙:\n- 본문에 실제로 언급/추천된 책만 추출 (광고·관련 글 영역 제외)\n- 각 책마다 title(원제 그대로), author(가능하면), publisher(가능하면), reason(글에서 추천한 이유를 한국어 1~2문장)을 채워주세요\n- 모르면 author/publisher는 빈 문자열\n- 최대 20권\n\n[페이지 제목] ${sourceTitle}\n\n[본문]\n${text}`;

    try {
      const { output } = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        prompt,
        output: Output.object({
          schema: z.object({
            books: z
              .array(
                z.object({
                  title: z.string(),
                  author: z.string(),
                  publisher: z.string(),
                  reason: z.string(),
                }),
              )
              .max(20),
          }),
        }),
      });
      const books: AnalyzedBook[] = output.books
        .filter((b) => b.title && b.title.trim().length > 0)
        .map((b) => ({
          title: b.title.trim(),
          author: b.author?.trim() ?? "",
          publisher: b.publisher?.trim() ?? "",
          reason: b.reason?.trim() ?? "",
          isbn: "",
          imageUrl: "",
        }));
      return { sourceTitle, books };
    } catch (e: any) {
      if (e?.statusCode === 429)
        throw new Error("요청이 너무 많아요. 잠시 후 다시 시도해 주세요.");
      if (e?.statusCode === 402)
        throw new Error("AI 사용량이 모두 소진되었어요. 크레딧을 추가해 주세요.");
      throw new Error("AI 분석에 실패했어요.");
    }
  });