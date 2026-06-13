import { toast } from "sonner";

/**
 * 도서관 사이트로 이동하기 전에 책 제목을 클립보드에 복사하고
 * 사용자에게 안내 토스트를 띄웁니다. 새 탭이 열리면 검색창에
 * Cmd/Ctrl+V 로 바로 붙여넣을 수 있어요.
 */
export async function copyTitleAndNotify(title: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(title);
    } else {
      const ta = document.createElement("textarea");
      ta.value = title;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    toast.success("책 제목을 복사했어요", {
      description: `검색창에 붙여넣기(Cmd/Ctrl+V) 하세요 · "${title}"`,
    });
  } catch {
    toast.message("자동 복사가 차단되었어요", {
      description: `검색창에 직접 입력해 주세요 · "${title}"`,
    });
  }
}