import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import {
  getChildProfile,
  saveChildProfile,
  stageFromBirthYear,
  type ChildProfile,
} from "@/lib/child-profile";
import { STAGES } from "@/lib/content-data";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [profile, setProfile] = useState<ChildProfile>(() => getChildProfile());
  const [saved, setSaved] = useState(false);
  const stage = stageFromBirthYear(profile.birthYear, profile.birthMonth);
  const stageInfo = STAGES.find((s) => s.id === stage);

  const update = (patch: Partial<ChildProfile>) => {
    setProfile((p) => ({ ...p, ...patch }));
    setSaved(false);
  };

  const onSave = () => {
    saveChildProfile(profile);
    setSaved(true);
  };

  const thisYear = new Date().getFullYear();
  const years = Array.from({ length: 13 }, (_, i) => thisYear - i);

  return (
    <AppShell>
      <header className="px-5 pt-8 pb-4">
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">설정</p>
        <h1 className="text-2xl font-bold mt-1">아이 정보</h1>
        <p className="text-sm text-muted-foreground mt-1">
          생년월일을 입력하면 나이에 맞는 책을 자동으로 추천해드려요.
        </p>
      </header>

      <section className="px-5 space-y-5">
        <div>
          <label className="text-xs font-semibold text-muted-foreground">이름(애칭)</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => update({ name: e.target.value })}
            className="mt-1 w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground">성별</label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {(["male", "female"] as const).map((g) => (
              <button
                key={g}
                onClick={() => update({ gender: g })}
                className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-all ${
                  profile.gender === g
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border"
                }`}
              >
                {g === "male" ? "남자" : "여자"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground">생년월일</label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <select
              value={profile.birthYear}
              onChange={(e) => update({ birthYear: Number(e.target.value) })}
              className="rounded-2xl border border-border bg-card px-4 py-3 text-sm"
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}년</option>
              ))}
            </select>
            <select
              value={profile.birthMonth}
              onChange={(e) => update({ birthMonth: Number(e.target.value) })}
              className="rounded-2xl border border-border bg-card px-4 py-3 text-sm"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>{m}월</option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-2xl bg-secondary border border-border p-4">
          <p className="text-xs text-muted-foreground">자동 추천 단계</p>
          <p className="font-bold mt-1">
            {stageInfo?.emoji} {stageInfo?.label} ({stageInfo?.ages})
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{stageInfo?.desc}</p>
        </div>

        <button
          onClick={onSave}
          className="w-full rounded-2xl bg-primary text-primary-foreground py-3 font-semibold active:scale-[0.98] transition-transform"
        >
          {saved ? "저장 완료 ✓" : "저장하기"}
        </button>
      </section>
    </AppShell>
  );
}