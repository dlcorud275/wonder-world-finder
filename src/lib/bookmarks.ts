import { useEffect, useState } from "react";

const KEY = "kidsnest.bookmarks.v1";

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