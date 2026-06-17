import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adfit?: {
      cmd: unknown[];
    };
  }
}

/**
 * 광고 배너 컴포넌트.
 * - VITE_ADSENSE_CLIENT + VITE_ADSENSE_SLOT: Google AdSense
 * - VITE_ADFIT_UNIT: Kakao AdFit (애드핏)
 * - 둘 다 없으면 플레이스홀더 노출
 */
export function AdBanner() {
  const adsenseClient = import.meta.env.VITE_ADSENSE_CLIENT as string | undefined;
  const adsenseSlot = import.meta.env.VITE_ADSENSE_SLOT as string | undefined;
  const adfitUnit = import.meta.env.VITE_ADFIT_UNIT as string | undefined;
  const adsenseRef = useRef<HTMLModElement | null>(null);

  // AdSense
  useEffect(() => {
    if (!adsenseClient || !adsenseSlot) return;
    const scriptId = "adsbygoogle-js";
    if (!document.getElementById(scriptId)) {
      const s = document.createElement("script");
      s.id = scriptId;
      s.async = true;
      s.crossOrigin = "anonymous";
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`;
      document.head.appendChild(s);
    }
    try {
      // @ts-expect-error - adsbygoogle is injected by the script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.warn("[AdBanner AdSense]", err);
    }
  }, [adsenseClient, adsenseSlot]);

  // AdFit
  useEffect(() => {
    if (!adfitUnit) return;
    const scriptId = "adfit-js";
    if (!document.getElementById(scriptId)) {
      const s = document.createElement("script");
      s.id = scriptId;
      s.async = true;
      s.src = "//t1.daumcdn.net/adfit/static/ad.min.js";
      document.head.appendChild(s);
    }
  }, [adfitUnit]);

  if (adsenseClient && adsenseSlot) {
    return (
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <p className="text-[10px] text-muted-foreground px-3 pt-2">광고</p>
        <ins
          ref={adsenseRef}
          className="adsbygoogle block"
          style={{ display: "block" }}
          data-ad-client={adsenseClient}
          data-ad-slot={adsenseSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  if (adfitUnit) {
    return (
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <p className="text-[10px] text-muted-foreground px-3 pt-2">광고</p>
        <ins
          className="kakao_ad_area"
          style={{ display: "none", width: "100%" }}
          data-ad-unit={adfitUnit}
          data-ad-width="320"
          data-ad-height="100"
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
        AdSense 또는 AdFit 설정 후 자동으로 광고가 노출돼요.
      </p>
    </div>
  );
}
