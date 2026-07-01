import { createFileRoute } from "@tanstack/react-router";

const TIMEOUT = 8000;

function normalize(s: string) {
  return s.replace(/[\s\p{P}\p{S}]/gu, "").toLowerCase();
}

function stripHtml(s: string) {
  return s.replace(/<[^>]+>/g, "");
}

async function fetchWithTimeout(url: string, init: RequestInit = {}, ms = TIMEOUT) {
  return fetch(url, { ...init, signal: AbortSignal.timeout(ms) });
}

async function fromNaver(title: string, author: string): Promise<string> {
  const id = process.env.NAVER_CLIENT_ID;
  const secret = process.env.NAVER_CLIENT_SECRET;
  if (!id || !secret) return "";
  try {
    const u = new URL("https://openapi.naver.com/v1/search/book.json");
    u.searchParams.set("query", author ? `${title} ${author}` : title);
    u.searchParams.set("display", "5");
    const r = await fetchWithTimeout(u.toString(), {
      headers: { "X-Naver-Client-Id": id, "X-Naver-Client-Secret": secret },
    });
    if (!r.ok) return "";
    const j = (await r.json()) as { items?: Array<{ title: string; image: string }> };
    const t = normalize(title);
    const best =
      (j.items ?? []).find((it) => {
        const n = normalize(stripHtml(it.title));
        return n.includes(t) || t.includes(n);
      }) ?? j.items?.[0];
    return best?.image ?? "";
  } catch {
    return "";
  }
}

async function fromKakao(title: string): Promise<string> {
  const key = process.env.KAKAO_REST_API_KEY;
  if (!key) return "";
  try {
    const u = new URL("https://dapi.kakao.com/v3/search/book");
    u.searchParams.set("query", title);
    u.searchParams.set("size", "3");
    const r = await fetchWithTimeout(u.toString(), {
      headers: { Authorization: `KakaoAK ${key}` },
    });
    if (!r.ok) return "";
    const j = (await r.json()) as { documents?: Array<{ thumbnail: string }> };
    return j.documents?.[0]?.thumbnail ?? "";
  } catch {
    return "";
  }
}

async function fromGoogleBooks(title: string, author: string, isbn: string): Promise<string> {
  try {
    const q = isbn
      ? `isbn:${isbn}`
      : author
        ? `intitle:${encodeURIComponent(title)}+inauthor:${encodeURIComponent(author)}`
        : `intitle:${encodeURIComponent(title)}`;
    const r = await fetchWithTimeout(
      `https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=5&printType=books`,
    );
    if (!r.ok) return "";
    const j = (await r.json()) as {
      items?: Array<{ volumeInfo?: { title?: string; imageLinks?: Record<string, string> } }>;
    };
    const t = normalize(title);
    const items = j.items ?? [];
    const best =
      items.find((it) => {
        const n = normalize(it.volumeInfo?.title ?? "");
        return (n.includes(t) || t.includes(n)) && it.volumeInfo?.imageLinks;
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
    return raw.replace(/^http:/, "https:").replace(/&edge=curl/g, "").replace(/zoom=\d+/, "zoom=1");
  } catch {
    return "";
  }
}

async function fromOpenLibrary(isbn: string): Promise<string> {
  if (!isbn) return "";
  return `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(isbn)}-L.jpg?default=false`;
}

async function fromOpenLibraryTitle(title: string, author: string): Promise<string> {
  try {
    const u = new URL("https://openlibrary.org/search.json");
    u.searchParams.set("title", title);
    if (author) u.searchParams.set("author", author);
    u.searchParams.set("limit", "5");
    const r = await fetchWithTimeout(u.toString());
    if (!r.ok) return "";
    const j = (await r.json()) as { docs?: Array<{ cover_i?: number; title?: string }> };
    const t = normalize(title);
    const best =
      (j.docs ?? []).find((d) => {
        const n = normalize(d.title ?? "");
        return d.cover_i && (n.includes(t) || t.includes(n));
      }) ?? (j.docs ?? []).find((d) => d.cover_i);
    if (!best?.cover_i) return "";
    return `https://covers.openlibrary.org/b/id/${best.cover_i}-L.jpg`;
  } catch {
    return "";
  }
}

function placeholderSvg(title: string) {
  const short = (title || "책").slice(0, 14);
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 260">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FDE68A"/>
      <stop offset="1" stop-color="#FCA5A5"/>
    </linearGradient>
  </defs>
  <rect width="200" height="260" rx="18" fill="url(#g)"/>
  <text x="100" y="135" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="700" fill="#7c2d12">📖</text>
  <text x="100" y="175" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#7c2d12">${short.replace(/[<&>"']/g, "")}</text>
</svg>`;
  return new Response(svg, {
    status: 200,
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}

async function proxyImage(src: string): Promise<Response | null> {
  try {
    const r = await fetchWithTimeout(src, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
        accept: "image/avif,image/webp,image/*,*/*;q=0.8",
        referer: new URL(src).origin + "/",
      },
    });
    if (!r.ok) return null;
    const ct = r.headers.get("content-type") || "";
    if (!ct.startsWith("image/")) return null;
    const buf = await r.arrayBuffer();
    if (buf.byteLength < 500) return null; // reject 1x1 pixels
    return new Response(buf, {
      status: 200,
      headers: {
        "content-type": ct,
        "cache-control": "public, max-age=604800, immutable",
      },
    });
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/api/public/cover")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const title = (url.searchParams.get("title") || "").trim();
        const author = (url.searchParams.get("author") || "").trim();
        const isbn = (url.searchParams.get("isbn") || "").trim();
        if (!title && !isbn) return placeholderSvg("책");

        const sources = [
          () => fromNaver(title, author),
          () => fromKakao(title),
          () => fromGoogleBooks(title, author, isbn),
          () => fromOpenLibrary(isbn),
          () => fromOpenLibraryTitle(title, author),
        ];
        for (const s of sources) {
          const src = await s().catch(() => "");
          if (!src) continue;
          const res = await proxyImage(src);
          if (res) return res;
        }
        return placeholderSvg(title);
      },
    },
  },
});