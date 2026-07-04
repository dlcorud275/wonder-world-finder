import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { generateText } from "ai";
import { resolveBookCover } from "./book-cover.functions";

const RawInputSchema = z.object({ input: z.string().min(1).max(2000) });
const ImageInputSchema = z.object({
  image: z
    .string()
    .min(20)
    .max(8_000_000)
    .refine((s) => s.startsWith("data:image/"), "이미지 데이터 URL이어야 해요."),
});
const BookListSchema = z.object({
  books: z
    .array(
      z.object({
        title: z.string(),
        author: z.string().optional().default(""),
        publisher: z.string().optional().default(""),
        reason: z.string().optional().default(""),
        readingLevel: z.string().optional().default(""),
      }),
    )
    .max(20),
});

export interface AnalyzedBook {
  title: string;
  author: string;
  publisher: string;
  reason: string;
  isbn: string;
  imageUrl: string;
  readingLevel: string;
}

export interface AnalyzeResult {
  sourceTitle: string;
  books: AnalyzedBook[];
  mode?: "url" | "query";
}

interface FetchedPage {
  html: string;
  url: string;
}

interface NaverBookItem {
  title: string;
  image: string;
  author: string;
  publisher: string;
  isbn: string;
}

function ensureProtocol(rawUrl: string) {
  const trimmed = rawUrl.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function looksLikeUrl(s: string) {
  const t = s.trim();
  if (/^https?:\/\//i.test(t)) return true;
  return /^[\w-]+(\.[\w-]+)+(\/|$)/i.test(t) && !/\s/.test(t);
}

function isYoutube(url: string) {
  try {
    const h = new URL(url).hostname;
    return /(^|\.)youtube\.com$|(^|\.)youtu\.be$/i.test(h);
  } catch {
    return false;
  }
}

async function fetchYoutubeTitle(url: string): Promise<string> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
      { signal: AbortSignal.timeout(8000) },
    );
    if (!res.ok) return "";
    const json = (await res.json()) as { title?: string; author_name?: string };
    return [json.title, json.author_name].filter(Boolean).join(" — ");
  } catch {
    return "";
  }
}

function decodeHtmlEntities(text: string) {
  return text
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(Number(num)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function htmlToText(html: string) {
  return decodeHtmlEntities(html)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<\/?(p|div|section|article|li|ul|ol|h[1-6]|br|tr|blockquote)[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractTitle(html: string) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m
    ? htmlToText(m[1])
        .replace(/: 네이버 블로그$/i, "")
        .slice(0, 120)
    : "";
}

function stripHtml(s: string) {
  return htmlToText(s).replace(/\s+/g, " ").trim();
}

function normalizeUrl(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.endsWith("blog.naver.com")) {
      const blogId = u.searchParams.get("blogId");
      const logNo = u.searchParams.get("logNo");
      if (blogId && logNo) {
        return `https://m.blog.naver.com/PostView.naver?blogId=${encodeURIComponent(blogId)}&logNo=${encodeURIComponent(logNo)}`;
      }
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts.length >= 2) {
        return `https://m.blog.naver.com/PostView.naver?blogId=${encodeURIComponent(parts[0])}&logNo=${encodeURIComponent(parts[1])}`;
      }
    }
    return url;
  } catch {
    return url;
  }
}

async function fetchHtml(url: string, referer?: string): Promise<FetchedPage> {
  const res = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile Safari/604.1",
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.6,en;q=0.4",
      ...(referer ? { referer } : {}),
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return { html: await res.text(), url: res.url || url };
}

function resolveNestedFrame(html: string, baseUrl: string) {
  const match = html.match(/<iframe[^>]+(?:id|name)=["']mainFrame["'][^>]+src=["']([^"']+)["']/i);
  if (!match) return null;
  try {
    return new URL(decodeHtmlEntities(match[1]), baseUrl).toString();
  } catch {
    return null;
  }
}

async function fetchReadablePage(url: string): Promise<FetchedPage> {
  let page = await fetchHtml(normalizeUrl(url));
  for (let i = 0; i < 2; i += 1) {
    const nested = resolveNestedFrame(page.html, page.url);
    if (!nested) break;
    page = await fetchHtml(nested, page.url);
  }
  return page;
}

function extractMainText(html: string) {
  const markers = [
    "se-main-container",
    "postViewArea",
    "post-view",
    "entry-content",
    "article-view",
    "articleBody",
    "tt_article_useless_p_margin",
  ];
  const candidates = markers
    .map((marker) => {
      const start = html.indexOf(marker);
      return start < 0 ? "" : htmlToText(html.slice(Math.max(0, start - 500), start + 90000));
    })
    .filter((text) => text.length > 200);
  candidates.push(htmlToText(html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html));
  return candidates
    .sort((a, b) => b.length - a.length)[0]
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n")
    .slice(0, 18000);
}

function parseJsonObject(text: string) {
  const raw = text.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1] ?? text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error("No JSON object");
  return JSON.parse(raw.slice(start, end + 1));
}

function normalizeComparable(value: string) {
  return stripHtml(value)
    .replace(/[\s\p{P}\p{S}]/gu, "")
    .toLowerCase();
}

async function enrichWithNaverBook(title: string, author: string): Promise<Partial<AnalyzedBook>> {
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;
  if (!clientId || !clientSecret) return {};
  const url = new URL("https://openapi.naver.com/v1/search/book.json");
  url.searchParams.set("query", author ? `${title} ${author}` : title);
  url.searchParams.set("display", "5");
  try {
    const res = await fetch(url.toString(), {
      headers: {
        "X-Naver-Client-Id": clientId,
        "X-Naver-Client-Secret": clientSecret,
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return {};
    const json = (await res.json()) as { items?: NaverBookItem[] };
    const target = normalizeComparable(title);
    const best =
      (json.items ?? []).find((item) => {
        const itemTitle = normalizeComparable(item.title);
        return itemTitle.includes(target) || target.includes(itemTitle);
      }) ?? json.items?.[0];
    if (!best) return {};
    return {
      isbn: (best.isbn || "").split(" ").pop() || "",
      title: stripHtml(best.title) || title,
      author: stripHtml(best.author).replace(/\^/g, ", ") || author,
      publisher: stripHtml(best.publisher),
      imageUrl: best.image || "",
    };
  } catch (error) {
    console.warn("[analyzeUrlFn] Naver book enrichment failed:", error);
    return {};
  }
}

export const analyzeUrlFn = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => RawInputSchema.parse(input))
  .handler(async ({ data }): Promise<AnalyzeResult> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI 키가 설정되지 않았어요.");

    const gateway = createOpenAICompatible({
      name: "lovable",
      baseURL: "https://ai.gateway.lovable.dev/v1",
      headers: {
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "vercel-ai-sdk",
      },
    });

    const raw = data.input.trim();
    let mode: "url" | "query" = "query";
    let sourceTitle = raw;
    let bodyForPrompt = "";
    let promptHeader = "";

    if (looksLikeUrl(raw)) {
      const url = ensureProtocol(raw);
      if (isYoutube(url)) {
        mode = "query";
        const yt = await fetchYoutubeTitle(url);
        sourceTitle = yt || url;
        promptHeader = `아래 YouTube 영상 제목/채널을 참고해 어린이/부모에게 도움이 될 만한 추천 도서 목록을 제안하세요.`;
        bodyForPrompt = `[YouTube]\n${sourceTitle}\nURL: ${url}`;
      } else {
        try {
          const page = await fetchReadablePage(url);
          const text = extractMainText(page.html);
          if (text.length >= 120) {
            mode = "url";
            sourceTitle = extractTitle(page.html) || page.url;
            promptHeader = `아래 블로그 본문에서 글쓴이가 실제로 추천하거나 소개한 책 제목만 추출하세요.`;
            bodyForPrompt = `[페이지 제목]\n${sourceTitle}\n\n[본문]\n${text}`;
          }
        } catch (e) {
          console.warn("[analyzeUrlFn] URL fetch failed, falling back to query mode:", e);
        }
        if (mode === "query") {
          promptHeader = `아래 URL/주제와 관련해 어린이/부모에게 도움이 될 만한 추천 도서 목록을 제안하세요.`;
          bodyForPrompt = `[입력]\n${raw}`;
        }
      }
    } else {
      mode = "query";
      promptHeader = `아래 입력은 (1)책 제목, (2)교육 인플루언서/저자 이름, (3)관심 주제 중 하나입니다. 이에 맞게 어린이/부모에게 도움이 될 만한 추천 도서 목록을 제안하세요. 책 제목이면 저자의 다른 대표작이나 비슷한 결의 책 위주로, 인플루언서 이름이면 그 사람이 자주 추천한다고 알려진 책 위주로 추천하세요.`;
      bodyForPrompt = `[입력]\n${raw}`;
    }

    try {
      const result = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        system:
          "한국 어린이 도서 큐레이터입니다. 실제로 존재하는 책만 JSON으로 반환합니다. 없는 책을 지어내지 않습니다.",
        prompt: `${promptHeader}\n\nJSON 객체만 반환하세요. 형식: {"books":[{"title":"책 제목(한국어 정발명이 있으면 한국어 우선)","author":"저자","publisher":"출판사 또는 빈 문자열","reason":"한국어 1문장 추천 이유","readingLevel":"AR/SR/Lexile 지수를 알거나 본문에 있으면 'AR 2.5' 'SR 600L' 'Lexile 700L' 형식, 없으면 빈 문자열"}]}\n\n규칙:\n- 같은 책은 한 번만 포함합니다.\n- 최대 12권입니다.\n- 실제 서점/도서관에서 검색되는 정확한 제목만 사용하세요.\n\n${bodyForPrompt}`,
      });
      const output = BookListSchema.parse(parseJsonObject(result.text));
      const deduped = Array.from(
        new Map(
          output.books.filter((b) => b.title.trim()).map((b) => [normalizeComparable(b.title), b]),
        ).values(),
      ).slice(0, 20);
      const books = await Promise.all(
        deduped.map(async (b) => {
          const title = b.title.trim();
          const author = b.author?.trim() ?? "";
          const enriched = await enrichWithNaverBook(title, author);
          const finalTitle = enriched.title || title;
          const finalAuthor = enriched.author || author;
          const finalIsbn = enriched.isbn ?? "";
          let imageUrl = enriched.imageUrl ?? "";
          if (!imageUrl) {
            const cover = await resolveBookCover(finalTitle, finalAuthor, finalIsbn);
            imageUrl = cover.imageUrl;
          }
          return {
            title: finalTitle,
            author: finalAuthor,
            publisher: enriched.publisher || b.publisher?.trim() || "",
            reason: b.reason?.trim() ?? "",
            isbn: finalIsbn,
            imageUrl,
            readingLevel: b.readingLevel?.trim() ?? "",
          };
        }),
      );
      return { sourceTitle, books: books.filter((b) => b.title), mode };
    } catch (e: any) {
      console.error("[analyzeUrlFn] AI extraction failed:", e);
      if (e?.statusCode === 429 || e?.status === 429) {
        throw new Error("요청이 너무 많아요. 잠시 후 다시 시도해 주세요.");
      }
      if (e?.statusCode === 402 || e?.status === 402) {
        throw new Error("AI 사용량이 모두 소진되었어요. 크레딧을 추가해 주세요.");
      }
      throw new Error(
        "추천 도서 목록을 만들지 못했어요. 다른 URL이나 키워드로 다시 시도해 주세요.",
      );
    }
  });
