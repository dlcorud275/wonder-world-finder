import { useEffect, useState } from "react";
import type { PopularBook } from "@/services/libraryApi";

const KEY = "kidsnest.bookmarks.v1";
const API_KEY = "kidsnest.api-bookmarks.v1";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function write(ids: string[]) {
  localStorage.setItem(KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event("kidsnest:bookmarks"));
}

export function useBookmarks() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    setIds(read());
    const h = () => setIds(read());
    window.addEventListener("kidsnest:bookmarks", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("kidsnest:bookmarks", h);
      window.removeEventListener("storage", h);
    };
  }, []);
  return {
    ids,
    has: (id: string) => ids.includes(id),
    toggle: (id: string) => {
      const cur = read();
      const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
      write(next);
    },
  };
}

function readApi(): PopularBook[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(API_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeApi(items: PopularBook[]) {
  localStorage.setItem(API_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("kidsnest:api-bookmarks"));
}

export function bookKey(b: Pick<PopularBook, "isbn" | "title">) {
  return (b.isbn && b.isbn.trim()) || `t:${b.title.trim().toLowerCase()}`;
}

export function useApiBookmarks() {
  const [items, setItems] = useState<PopularBook[]>([]);
  useEffect(() => {
    setItems(readApi());
    const h = () => setItems(readApi());
    window.addEventListener("kidsnest:api-bookmarks", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("kidsnest:api-bookmarks", h);
      window.removeEventListener("storage", h);
    };
  }, []);
  const keys = new Set(items.map(bookKey));
  return {
    items,
    has: (b: Pick<PopularBook, "isbn" | "title">) => keys.has(bookKey(b)),
    toggle: (b: PopularBook) => {
      const cur = readApi();
      const k = bookKey(b);
      const exists = cur.some((x) => bookKey(x) === k);
      writeApi(exists ? cur.filter((x) => bookKey(x) !== k) : [b, ...cur]);
    },
  };
}