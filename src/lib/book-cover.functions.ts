import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  title: z.string().min(1).max(200),
  author: z.string().optional().default(""),
  isbn: z.string().optional().default(""),
});

interface CoverResult {
  imageUrl: string;
  source: "naver" | "google" | "openlibrary" | "none";
}

function stripHtml(s: string) {
  return s.replace(/<[^>]+>/g, "");
}

function normalize(s: string) {
  return s
    .replace(/[\s\p{P}\p{S}]/gu, "")
    .toLowerCase();
}

async function fromNaver(title: string, author: string): Promise<string> {
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;
  if (!clientId || !clientSecret) return "";
  try {
    const url = new URL("https://openapi.naver.com/v1/search/book.json");
    url.searchParams.set("query", author ? `${title} ${author}` : title);
    url.searchParams.set("display", "5");
    const res = await fetch(url.toString(), {
      headers: { "X-Naver-Client-Id": clientId, "X-Naver-Client-Secret": clientSecret },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return "";
    const json = (await res.json()) as { items?: Array<{ title: string; image: string }> };
    const target = normalize(title);
    const best =
      (json.items ?? []).find((it) => {
        const t = normalize(stripHtml(it.title));
        return t.includes(target) || target.includes(t);
      }) ?? json.items?.[0];
    return best?.image || "";
  } catch {
    return "";
  }
}

async function fromGoogleBooks(title: string, author: string, isbn: string): Promise<string> {
  try {
    const q = isbn
      ? `isbn:${isbn}`
      : author
        ? `intitle:${title}+inauthor:${author}`
        : `intitle:${title}`;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=5&printType=books`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return "";
    const json = (await res.json()) as {
      items?: Array<{ volumeInfo?: { title?: string; imageLinks?: Record<string, string> } }>;
    };
    const target = normalize(title);
    const items = json.items ?? [];
    const best =
      items.find((it) => {
        const t = normalize(it.volumeInfo?.title ?? "");
        return (t.includes(target) || target.includes(t)) && it.volumeInfo?.imageLinks;
      }) ?? items.find((it) => it.volumeInfo?.imageLinks);
    const links = best?.volumeInfo?.imageLinks;
    if (!links) return "";
    const raw =
      links.extraLarge ||
      links.large ||
      links.medium ||
      links.small ||
      links.thumbnail ||
      links.smallThumbnail ||
      "";
    // upgrade http -> https and request a larger zoom
    return raw.replace(/^http:/, "https:").replace(/zoom=\d+/, "zoom=2");
  } catch {
    return "";
  }
}

async function fromOpenLibrary(isbn: string): Promise<string> {
  if (!isbn) return "";
  return `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(isbn)}-M.jpg`;
}

export async function resolveBookCover(
  title: string,
  author: string,
  isbn: string,
): Promise<CoverResult> {
  const naver = await fromNaver(title, author);
  if (naver) return { imageUrl: naver, source: "naver" };
  const google = await fromGoogleBooks(title, author, isbn);
  if (google) return { imageUrl: google, source: "google" };
  const ol = await fromOpenLibrary(isbn);
  if (ol) return { imageUrl: ol, source: "openlibrary" };
  return { imageUrl: "", source: "none" };
}

export const findBookCover = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }): Promise<CoverResult> => {
    return resolveBookCover(data.title, data.author ?? "", data.isbn ?? "");
  });