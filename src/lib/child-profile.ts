import type { Stage } from "./content-data";

export type ChildProfile = {
  name: string;
  gender: "male" | "female";
  birthYear: number;
  birthMonth: number; // 1-12
};

const STORAGE_KEY = "kidsnest.child";

// Default example: 2020년생 남자아이
const DEFAULT_PROFILE: ChildProfile = {
  name: "우리 아이",
  gender: "male",
  birthYear: 2020,
  birthMonth: 1,
};

export function getChildProfile(): ChildProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveChildProfile(p: ChildProfile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export function stageFromBirthYear(year: number, month = 1): Stage {
  const now = new Date();
  let age = now.getFullYear() - year;
  if (now.getMonth() + 1 < month) age -= 1;
  if (age <= 2) return "infant";
  if (age <= 5) return "toddler";
  if (age <= 8) return "early";
  return "middle";
}