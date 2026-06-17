import { useEffect, useRef } from "react";

/**
 * 심플한 광고 슬롯.
 * - VITE_ADSENSE_CLIENT + VITE_ADSENSE_SLOT 환경변수 설정 시 Google AdSense 광고를 노출합니다.
 * - 미설정 시 디자인된 플레이스홀더(자녀 교육 관련 안내)로 보여집니다.
 * - 네이버 애드포스트는 외부 스크립트 임베드를 막아 두기 때문에, 네이버 블로그 본문에서만 동작합니다.
 */
export function AdBanner() {
  const client = import.meta.env.VITE_ADSENSE_CLIENT as string | undefined;
  const slot = import.meta.env.VITE_ADSENSE_SLOT as string | undefined;
  const insRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    if (!client || !slot) return;
    // AdSense 로더 스크립트 1회 삽입
    const scriptId = "adsbygoogle-js";
    if (!document.getElementById(scriptId)) {
      const s = document.createElement("script");
      s.id = scriptId;
      s.async = true;
      s.crossOrigin = "anonymous";
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
      document.head.appendChild(s);
    }
    try {
      // @ts-expect-error - adsbygoogle is injected by the script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.warn("[AdBanner]", err);
    }
  }, [client, slot]);

  if (client && slot) {
    return (
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <p className="text-[10px] text-muted-foreground px-3 pt-2">광고</p>
        <ins
          ref={insRef}
          className="adsbygoogle block"
          style={{ display: "block" }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-dashed border-border bg-secondary/40 p-4 text-center">
      <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
        Sponsored
      </p>
      <p className="mt-1 text-sm font-semibold">우리 아이 책육아, 더 똑똑하게</p>
      <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
        유아·초등 학부모를 위한 광고 영역입니다. <br />
        AdSense 게재 승인 후 자동으로 광고가 노출돼요.
      </p>
    </div>
  );
}