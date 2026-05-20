export type Stage = "infant" | "toddler" | "early" | "middle";
export type Kind = "book" | "video";

export interface ContentItem {
  id: string;
  kind: Kind;
  title: string;
  creator: string;
  stage: Stage;
  ages: string;
  emoji: string;
  hue: number;
  summary: string;
  why: string;
  tags: string[];
  videoUrl?: string;
}

export const STAGES: { id: Stage; label: string; ages: string; desc: string; emoji: string }[] = [
  { id: "infant", label: "영아", ages: "0–2세", desc: "오감 자극과 애착 형성", emoji: "🧸" },
  { id: "toddler", label: "유아", ages: "3–5세", desc: "상상력과 언어 폭발기", emoji: "🎨" },
  { id: "early", label: "저학년", ages: "6–8세", desc: "읽기 독립과 호기심", emoji: "📖" },
  { id: "middle", label: "고학년", ages: "9–12세", desc: "비판적 사고와 가치관", emoji: "🌱" },
];

export const CONTENT: ContentItem[] = [
  {
    id: "b-bear-hunt",
    kind: "book",
    title: "곰 사냥을 떠나자",
    creator: "마이클 로젠 · 헬린 옥슨버리",
    stage: "infant",
    ages: "0–3세",
    emoji: "🐻",
    hue: 80,
    summary: "리듬감 있는 반복 문장으로 가족이 함께 모험을 떠나는 그림책.",
    why: "운율과 의성어가 아기의 청각과 언어 감각을 자극합니다. 부모와 함께 읽으며 애착을 다질 수 있는 클래식.",
    tags: ["그림책", "리듬", "애착"],
  },
  {
    id: "b-very-hungry",
    kind: "book",
    title: "배고픈 애벌레",
    creator: "에릭 칼",
    stage: "infant",
    ages: "1–3세",
    emoji: "🐛",
    hue: 120,
    summary: "구멍 뚫린 페이지로 요일과 숫자, 변태 과정을 만나는 명작.",
    why: "촉감 책 요소와 색감이 풍부해 시각 발달에 도움됩니다.",
    tags: ["그림책", "감각", "수세기"],
  },
  {
    id: "v-pinkfong-baby",
    kind: "video",
    title: "핑크퐁 베이비 클래식",
    creator: "핑크퐁",
    stage: "infant",
    ages: "0–2세",
    emoji: "🎵",
    hue: 320,
    summary: "차분한 클래식 선율과 부드러운 색감으로 구성된 영상.",
    why: "자극적이지 않은 화면 전환과 음악이 영아의 정서 안정에 도움됩니다.",
    tags: ["음악", "정서"],
    videoUrl: "https://www.youtube.com/results?search_query=pinkfong+baby+classic",
  },
  {
    id: "b-where-wild",
    kind: "book",
    title: "괴물들이 사는 나라",
    creator: "모리스 센닥",
    stage: "toddler",
    ages: "3–6세",
    emoji: "👹",
    hue: 30,
    summary: "맥스가 상상의 섬에서 괴물들의 왕이 되는 환상 모험.",
    why: "분노와 외로움 같은 복잡한 감정을 다루며 정서 조절 능력을 길러줍니다.",
    tags: ["감정", "상상력"],
  },
  {
    id: "b-frog-toad",
    kind: "book",
    title: "개구리와 두꺼비는 친구",
    creator: "아놀드 로벨",
    stage: "toddler",
    ages: "4–7세",
    emoji: "🐸",
    hue: 140,
    summary: "다섯 가지 짧은 이야기 속 우정을 그린 따뜻한 동화.",
    why: "쉬운 문장으로 우정과 배려를 자연스럽게 익힐 수 있습니다.",
    tags: ["우정", "동화"],
  },
  {
    id: "v-pororo-safety",
    kind: "video",
    title: "뽀로로 안전 교육",
    creator: "뽀로로",
    stage: "toddler",
    ages: "3–5세",
    emoji: "🚦",
    hue: 210,
    summary: "친근한 캐릭터와 함께 배우는 생활 안전 수칙.",
    why: "반복적인 노래와 상황극으로 안전 규칙을 자연스럽게 익힙니다.",
    tags: ["안전", "생활"],
    videoUrl: "https://www.youtube.com/results?search_query=뽀로로+안전",
  },
  {
    id: "b-magic-tree",
    kind: "book",
    title: "마법의 시간여행",
    creator: "메리 폽 어즈번",
    stage: "early",
    ages: "6–9세",
    emoji: "🌳",
    hue: 160,
    summary: "잭과 애니가 마법 나무집을 타고 떠나는 역사·자연 시리즈.",
    why: "재미있는 모험과 함께 다양한 시대·문화 지식을 흡수합니다.",
    tags: ["모험", "지식", "시리즈"],
  },
  {
    id: "b-charlotte",
    kind: "book",
    title: "샬롯의 거미줄",
    creator: "E. B. 화이트",
    stage: "early",
    ages: "7–10세",
    emoji: "🕸️",
    hue: 280,
    summary: "거미 샬롯과 아기 돼지 윌버의 잊지 못할 우정 이야기.",
    why: "생명과 죽음, 우정의 의미를 부드럽게 다루어 정서 성장을 돕습니다.",
    tags: ["우정", "고전"],
  },
  {
    id: "v-ebs-science",
    kind: "video",
    title: "EBS 과학 다큐 키즈",
    creator: "EBS",
    stage: "early",
    ages: "6–9세",
    emoji: "🔬",
    hue: 200,
    summary: "일상 속 호기심을 풀어주는 짧은 과학 다큐멘터리.",
    why: "공교육 기반의 검증된 콘텐츠로 탐구력을 키워줍니다.",
    tags: ["과학", "다큐"],
    videoUrl: "https://www.ebs.co.kr/",
  },
  {
    id: "b-wonder",
    kind: "book",
    title: "원더 (Wonder)",
    creator: "R. J. 팔라시오",
    stage: "middle",
    ages: "9–12세",
    emoji: "🌟",
    hue: 50,
    summary: "안면 기형을 가진 어기가 학교에서 친구를 만들어가는 이야기.",
    why: "공감과 다양성 존중을 깊이 있게 배울 수 있는 현대 고전.",
    tags: ["공감", "성장"],
  },
  {
    id: "b-mrs-frisby",
    kind: "book",
    title: "프리스비 부인과 니임의 쥐",
    creator: "로버트 오브라이언",
    stage: "middle",
    ages: "9–12세",
    emoji: "🐭",
    hue: 20,
    summary: "지능을 갖게 된 쥐들의 공동체를 그린 뉴베리 수상작.",
    why: "윤리와 과학기술의 관계를 사유하게 만드는 깊이 있는 작품.",
    tags: ["뉴베리", "사고력"],
  },
  {
    id: "v-nat-geo-kids",
    kind: "video",
    title: "내셔널 지오그래픽 키즈",
    creator: "Nat Geo Kids",
    stage: "middle",
    ages: "8–12세",
    emoji: "🌍",
    hue: 220,
    summary: "세계 자연·동물·환경을 다루는 고품질 다큐 시리즈.",
    why: "신뢰할 수 있는 글로벌 미디어로 세계관을 넓힐 수 있습니다.",
    tags: ["자연", "다큐"],
    videoUrl: "https://kids.nationalgeographic.com/",
  },
];

export function libraryLinks(title: string) {
  const q = encodeURIComponent(title);
  return [
    { name: "국립중앙도서관", url: `https://www.nl.go.kr/NL/contents/search.do?kwd=${q}` },
    { name: "서울도서관", url: `https://elib.seoul.go.kr/contents/search.do?query=${q}` },
    { name: "교보문고", url: `https://search.kyobobook.co.kr/search?keyword=${q}` },
  ];
}