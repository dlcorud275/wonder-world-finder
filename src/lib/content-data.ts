export type Stage = "infant" | "toddler" | "early" | "middle";
export type Kind = "book" | "video";
export type Language = "ko" | "en";

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
  coverUrl?: string;
  mustRead?: boolean;
  language?: Language;
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
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780689815812-L.jpg",
    mustRead: true,
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
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780399226908-L.jpg",
    mustRead: true,
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
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780064431781-L.jpg",
    mustRead: true,
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
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780064440202-L.jpg",
    mustRead: true,
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
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780679824114-L.jpg",
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
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780064400558-L.jpg",
    mustRead: true,
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
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780375869020-L.jpg",
    mustRead: true,
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
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780689710681-L.jpg",
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
  {
    id: "b-en-brown-bear",
    kind: "book",
    title: "Brown Bear, Brown Bear, What Do You See?",
    creator: "Bill Martin Jr. & Eric Carle",
    stage: "infant",
    ages: "0–3",
    emoji: "🐻",
    hue: 30,
    summary: "A rhythmic, repetitive English classic introducing colors and animals.",
    why: "Simple repetition and predictable patterns build early English listening and vocabulary.",
    tags: ["picture book", "colors", "rhyme"],
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780805047905-L.jpg",
    mustRead: true,
    language: "en",
  },
  {
    id: "b-en-goodnight-moon",
    kind: "book",
    title: "Goodnight Moon",
    creator: "Margaret Wise Brown",
    stage: "infant",
    ages: "0–3",
    emoji: "🌙",
    hue: 240,
    summary: "A gentle bedtime poem that says goodnight to everything in the great green room.",
    why: "Soothing rhythm and soft illustrations make it a perfect English bedtime read.",
    tags: ["bedtime", "classic"],
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780064430173-L.jpg",
    mustRead: true,
    language: "en",
  },
  {
    id: "b-en-green-eggs",
    kind: "book",
    title: "Green Eggs and Ham",
    creator: "Dr. Seuss",
    stage: "toddler",
    ages: "3–6",
    emoji: "🍳",
    hue: 130,
    summary: "Sam-I-Am insists his friend try a very unusual meal in this beloved Dr. Seuss tale.",
    why: "Only 50 simple words — perfect for early English readers and read-aloud fun.",
    tags: ["rhyme", "early reader"],
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780394800165-L.jpg",
    mustRead: true,
    language: "en",
  },
  {
    id: "b-en-harry-potter",
    kind: "book",
    title: "Harry Potter and the Sorcerer's Stone",
    creator: "J. K. Rowling",
    stage: "middle",
    ages: "9–12",
    emoji: "⚡",
    hue: 280,
    summary: "An orphan boy discovers he is a wizard and steps into a magical new world.",
    why: "A gateway to chapter-book reading in English with rich vocabulary and immersive world-building.",
    tags: ["fantasy", "series"],
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780590353427-L.jpg",
    mustRead: true,
    language: "en",
  },
  {
    id: "v-en-cocomelon",
    kind: "video",
    title: "CoComelon Nursery Rhymes",
    creator: "CoComelon",
    stage: "infant",
    ages: "1–3",
    emoji: "🎶",
    hue: 200,
    summary: "Classic English nursery rhymes animated with bright, friendly characters.",
    why: "Repetitive lyrics and clear pronunciation help build early English listening.",
    tags: ["nursery rhymes", "music"],
    videoUrl: "https://www.youtube.com/@CoComelon",
    language: "en",
  },
  {
    id: "v-en-sesame",
    kind: "video",
    title: "Sesame Street",
    creator: "Sesame Workshop",
    stage: "toddler",
    ages: "3–6",
    emoji: "🧮",
    hue: 50,
    summary: "Educational sketches with Elmo, Big Bird, and friends teaching letters, numbers, and social skills.",
    why: "Decades of research-backed early learning in clear, natural English.",
    tags: ["education", "classic"],
    videoUrl: "https://www.youtube.com/@SesameStreet",
    language: "en",
  },
  {
    id: "v-en-bluey",
    kind: "video",
    title: "Bluey",
    creator: "BBC / Ludo Studio",
    stage: "early",
    ages: "5–9",
    emoji: "🐶",
    hue: 210,
    summary: "A playful Blue Heeler puppy and her family turn everyday life into imaginative games.",
    why: "Warm family dynamics and natural Australian English make it both entertaining and language-rich.",
    tags: ["family", "imagination"],
    videoUrl: "https://www.youtube.com/@officialblueytv",
    language: "en",
  },
  // ===== KO · infant =====
  { id: "b-ko-moon-hi", kind: "book", title: "달님 안녕", creator: "하야시 아키코", stage: "infant", ages: "0–3세", emoji: "🌙", hue: 250, summary: "달님에게 인사하는 부드러운 그림책.", why: "큰 그림과 짧은 문장으로 영아의 시지각을 자극합니다.", tags: ["그림책", "잠자리"], mustRead: true },
  { id: "b-ko-apple-thump", kind: "book", title: "사과가 쿵!", creator: "다다 히로시", stage: "infant", ages: "1–3세", emoji: "🍎", hue: 20, summary: "사과 하나로 모여드는 동물들의 이야기.", why: "반복되는 의성어가 아기의 언어 감각을 키워줍니다.", tags: ["의성어", "동물"] },
  { id: "b-ko-who-poop", kind: "book", title: "누가 내 머리에 똥 쌌어?", creator: "베르너 홀츠바르트", stage: "infant", ages: "2–4세", emoji: "💩", hue: 40, summary: "두더지가 자기 머리에 똥 싼 범인을 찾아 떠나는 유쾌한 이야기.", why: "유머와 동물 지식을 함께 즐길 수 있어요.", tags: ["유머", "동물"] },
  { id: "b-ko-peekaboo", kind: "book", title: "달걀 형제", creator: "신순재", stage: "infant", ages: "1–3세", emoji: "🥚", hue: 60, summary: "알에서 깨어나는 형제들의 따뜻한 그림책.", why: "단순한 구성과 큰 그림이 영아 발달에 적합합니다.", tags: ["그림책", "감각"] },
  { id: "b-ko-touch-touch", kind: "book", title: "토닥토닥", creator: "박은영", stage: "infant", ages: "0–2세", emoji: "🤗", hue: 350, summary: "부드러운 손길과 따뜻한 말로 가득한 애착 그림책.", why: "부모와 함께 읽으며 정서적 안정을 다집니다.", tags: ["애착", "정서"] },

  // ===== KO · toddler =====
  { id: "b-ko-doggy-poo", kind: "book", title: "강아지똥", creator: "권정생", stage: "toddler", ages: "4–7세", emoji: "🐶", hue: 80, summary: "쓸모없어 보이던 강아지똥이 민들레꽃을 피우는 이야기.", why: "생명과 존재의 의미를 따뜻하게 전합니다.", tags: ["고전", "생명"], mustRead: true },
  { id: "b-ko-cloud-bread", kind: "book", title: "구름빵", creator: "백희나", stage: "toddler", ages: "3–6세", emoji: "☁️", hue: 220, summary: "구름으로 만든 빵을 먹고 하늘을 나는 남매의 모험.", why: "독창적 일러스트와 상상력으로 큰 사랑을 받은 작품.", tags: ["상상력", "가족"], mustRead: true },
  { id: "b-ko-candy", kind: "book", title: "알사탕", creator: "백희나", stage: "toddler", ages: "4–7세", emoji: "🍬", hue: 320, summary: "신비한 알사탕을 먹으면 들리지 않던 소리가 들리는 이야기.", why: "외로움과 소통의 의미를 섬세하게 보여줍니다.", tags: ["감정", "공감"] },
  { id: "b-ko-rainbow-fish", kind: "book", title: "무지개 물고기", creator: "마르쿠스 피스터", stage: "toddler", ages: "3–6세", emoji: "🐟", hue: 200, summary: "반짝이는 비늘을 친구들과 나누는 무지개 물고기.", why: "나눔과 우정의 가치를 자연스럽게 배워요.", tags: ["우정", "나눔"] },
  { id: "b-ko-mom-angry", kind: "book", title: "엄마가 화났다", creator: "최숙희", stage: "toddler", ages: "4–7세", emoji: "😤", hue: 0, summary: "엄마의 화난 목소리에 산산이 흩어진 아이의 마음.", why: "감정 표현과 회복의 과정을 그림으로 보여줍니다.", tags: ["감정", "가족"] },

  // ===== KO · early =====
  { id: "b-ko-manbok", kind: "book", title: "만복이네 떡집", creator: "김리리", stage: "early", ages: "7–10세", emoji: "🍡", hue: 30, summary: "이상한 떡을 먹으면 신비한 일이 벌어지는 만복이의 이야기.", why: "재미있는 판타지로 읽기 독립에 좋은 챕터북.", tags: ["챕터북", "한국"], mustRead: true },
  { id: "b-ko-magic-cha", kind: "book", title: "마법천자문 1", creator: "시리얼", stage: "early", ages: "7–10세", emoji: "🐉", hue: 350, summary: "한자를 배우며 모험을 떠나는 인기 학습 만화.", why: "학습과 흥미를 동시에 잡는 베스트셀러.", tags: ["학습만화", "한자"] },
  { id: "b-ko-trash-king", kind: "book", title: "쓰레기 마을의 비밀", creator: "임지윤", stage: "early", ages: "8–10세", emoji: "♻️", hue: 130, summary: "쓰레기 마을에서 벌어지는 환경 미스터리.", why: "환경 감수성을 키우는 한국 창작 동화.", tags: ["환경", "미스터리"] },
  { id: "b-ko-school-bus", kind: "book", title: "신통방통 그림책 학교", creator: "박현숙", stage: "early", ages: "6–9세", emoji: "🚌", hue: 50, summary: "그림책 속 인물들이 학교에 모인 유쾌한 이야기.", why: "한국 초등 저학년에게 친숙한 학교 일상을 다룹니다.", tags: ["학교", "유머"] },
  { id: "b-ko-witch-bread", kind: "book", title: "마녀 위니", creator: "밸러리 토머스", stage: "early", ages: "6–9세", emoji: "🧙", hue: 280, summary: "엉뚱한 마녀 위니와 고양이 윌버의 좌충우돌 이야기.", why: "유쾌한 그림과 짧은 챕터로 읽기 즐거움을 키워요.", tags: ["판타지", "유머"] },

  // ===== KO · middle =====
  { id: "b-ko-little-prince", kind: "book", title: "어린 왕자", creator: "생텍쥐페리", stage: "middle", ages: "10–12세", emoji: "👑", hue: 220, summary: "사막에서 어린 왕자를 만난 비행사의 철학 동화.", why: "관계와 본질에 대해 평생 다시 읽게 되는 고전.", tags: ["고전", "철학"], mustRead: true },
  { id: "b-ko-momo", kind: "book", title: "모모", creator: "미하엘 엔데", stage: "middle", ages: "10–12세", emoji: "⏳", hue: 30, summary: "시간을 훔치는 회색 신사들과 맞서는 모모의 이야기.", why: "시간과 우정에 대해 깊이 사유하게 만듭니다.", tags: ["철학", "성장"] },
  { id: "b-ko-seagull", kind: "book", title: "갈매기의 꿈", creator: "리처드 바크", stage: "middle", ages: "10–12세", emoji: "🕊️", hue: 200, summary: "더 높이 날기를 꿈꾸는 갈매기 조나단의 이야기.", why: "꿈과 자아실현에 대한 짧지만 강렬한 우화.", tags: ["고전", "성장"] },
  { id: "b-ko-haeju", kind: "book", title: "해를 품은 달의 아이들", creator: "이금이", stage: "middle", ages: "10–12세", emoji: "☀️", hue: 40, summary: "한국 창작 청소년 소설.", why: "또래의 고민과 성장통을 섬세하게 그립니다.", tags: ["한국", "성장"] },
  { id: "b-ko-narnia", kind: "book", title: "나니아 연대기: 사자, 마녀 그리고 옷장", creator: "C. S. 루이스", stage: "middle", ages: "9–12세", emoji: "🦁", hue: 60, summary: "옷장 너머의 환상 세계 나니아로 떠나는 모험.", why: "고전 판타지로 깊은 상상력을 키워줍니다.", tags: ["판타지", "고전"], mustRead: true },

  // ===== EN · infant =====
  { id: "b-en-spot", kind: "book", title: "Where's Spot?", creator: "Eric Hill", stage: "infant", ages: "0–3", emoji: "🐶", hue: 50, summary: "Lift-the-flap classic following a mother dog searching for her puppy.", why: "Interactive flaps build fine motor skills and predictability.", tags: ["lift-the-flap", "interactive"], coverUrl: "https://covers.openlibrary.org/b/isbn/9780723263661-L.jpg", language: "en" },
  { id: "b-en-snowy", kind: "book", title: "The Snowy Day", creator: "Ezra Jack Keats", stage: "infant", ages: "2–5", emoji: "❄️", hue: 210, summary: "Peter explores his neighborhood after the first snow of the season.", why: "Caldecott classic with quiet pacing perfect for early listeners.", tags: ["classic", "seasons"], coverUrl: "https://covers.openlibrary.org/b/isbn/9780670867332-L.jpg", language: "en", mustRead: true },
  { id: "b-en-llama", kind: "book", title: "Llama Llama Red Pajama", creator: "Anna Dewdney", stage: "infant", ages: "1–3", emoji: "🦙", hue: 350, summary: "Baby llama misses Mama at bedtime in this rhyming favorite.", why: "Comforting rhymes for separation anxiety and bedtime routines.", tags: ["bedtime", "rhyme"], coverUrl: "https://covers.openlibrary.org/b/isbn/9780670059836-L.jpg", language: "en" },
  { id: "b-en-guess", kind: "book", title: "Guess How Much I Love You", creator: "Sam McBratney", stage: "infant", ages: "1–4", emoji: "🐰", hue: 130, summary: "A tender story between Little Nutbrown Hare and Big Nutbrown Hare.", why: "Builds early vocabulary for love, comparison, and family bonds.", tags: ["love", "bedtime"], coverUrl: "https://covers.openlibrary.org/b/isbn/9780763642648-L.jpg", language: "en" },

  // ===== EN · toddler =====
  { id: "b-en-gruffalo", kind: "book", title: "The Gruffalo", creator: "Julia Donaldson", stage: "toddler", ages: "3–6", emoji: "👾", hue: 80, summary: "A clever mouse outwits forest predators by inventing a monster.", why: "Rhythmic rhyme and clever plotting make it a read-aloud favorite.", tags: ["rhyme", "clever"], coverUrl: "https://covers.openlibrary.org/b/isbn/9780142403877-L.jpg", language: "en", mustRead: true },
  { id: "b-en-corduroy", kind: "book", title: "Corduroy", creator: "Don Freeman", stage: "toddler", ages: "3–6", emoji: "🧸", hue: 30, summary: "A department-store teddy bear searches for his missing button.", why: "Gentle story about belonging, kindness, and friendship.", tags: ["friendship", "classic"], coverUrl: "https://covers.openlibrary.org/b/isbn/9780670241330-L.jpg", language: "en" },
  { id: "b-en-cat-hat", kind: "book", title: "The Cat in the Hat", creator: "Dr. Seuss", stage: "toddler", ages: "4–7", emoji: "🎩", hue: 0, summary: "A mischievous cat brings chaos and fun to a rainy day.", why: "Bouncy rhyme and a limited vocabulary perfect for emerging readers.", tags: ["rhyme", "early reader"], coverUrl: "https://covers.openlibrary.org/b/isbn/9780394800011-L.jpg", language: "en" },
  { id: "b-en-madeline", kind: "book", title: "Madeline", creator: "Ludwig Bemelmans", stage: "toddler", ages: "3–6", emoji: "👧", hue: 320, summary: "The smallest girl in a Parisian boarding school faces a sudden adventure.", why: "Classic rhyme and rich illustrations build cultural curiosity.", tags: ["classic", "rhyme"], coverUrl: "https://covers.openlibrary.org/b/isbn/9780670445806-L.jpg", language: "en" },
  { id: "b-en-curious", kind: "book", title: "Curious George", creator: "H. A. Rey", stage: "toddler", ages: "3–6", emoji: "🐵", hue: 50, summary: "A curious little monkey's adventures with the Man with the Yellow Hat.", why: "Friendly mischief that sparks problem-solving conversations.", tags: ["classic", "curiosity"], coverUrl: "https://covers.openlibrary.org/b/isbn/9780395150238-L.jpg", language: "en" },

  // ===== EN · early =====
  { id: "b-en-frog-toad", kind: "book", title: "Frog and Toad Are Friends", creator: "Arnold Lobel", stage: "early", ages: "6–9", emoji: "🐸", hue: 140, summary: "Five short stories about the warm friendship between Frog and Toad.", why: "Classic I Can Read series — gentle humor and easy sentences.", tags: ["friendship", "early reader"], coverUrl: "https://covers.openlibrary.org/b/isbn/9780064440202-L.jpg", language: "en", mustRead: true },
  { id: "b-en-magic-tree-en", kind: "book", title: "Magic Tree House: Dinosaurs Before Dark", creator: "Mary Pope Osborne", stage: "early", ages: "6–9", emoji: "🌳", hue: 160, summary: "Jack and Annie's first time-traveling adventure to the age of dinosaurs.", why: "A perfect bridge into chapter books with light history and adventure.", tags: ["chapter book", "adventure"], coverUrl: "https://covers.openlibrary.org/b/isbn/9780679824114-L.jpg", language: "en" },
  { id: "b-en-junie", kind: "book", title: "Junie B. Jones and the Stupid Smelly Bus", creator: "Barbara Park", stage: "early", ages: "6–9", emoji: "🚌", hue: 50, summary: "Spunky Junie B. navigates her first day of kindergarten her own way.", why: "Voice-driven humor that makes early chapter books irresistible.", tags: ["humor", "chapter book"], coverUrl: "https://covers.openlibrary.org/b/isbn/9780679826422-L.jpg", language: "en" },
  { id: "b-en-ramona", kind: "book", title: "Ramona Quimby, Age 8", creator: "Beverly Cleary", stage: "early", ages: "7–10", emoji: "📚", hue: 20, summary: "Ramona faces the big-kid world of third grade with humor and heart.", why: "Newbery Honor classic with realistic family and school moments.", tags: ["Newbery", "family"], coverUrl: "https://covers.openlibrary.org/b/isbn/9780688004774-L.jpg", language: "en", mustRead: true },
  { id: "b-en-bfg", kind: "book", title: "The BFG", creator: "Roald Dahl", stage: "early", ages: "7–10", emoji: "👁️", hue: 280, summary: "A girl named Sophie and the Big Friendly Giant team up against mean giants.", why: "Dahl's playful language and big imagination stretch growing readers.", tags: ["fantasy", "Dahl"], coverUrl: "https://covers.openlibrary.org/b/isbn/9780142410387-L.jpg", language: "en" },
  { id: "b-en-charlottes-web-en", kind: "book", title: "Charlotte's Web", creator: "E. B. White", stage: "early", ages: "8–10", emoji: "🕸️", hue: 120, summary: "The unforgettable friendship between Wilbur the pig and Charlotte the spider.", why: "A timeless story of friendship, life, and loss for early readers.", tags: ["classic", "friendship"], coverUrl: "https://covers.openlibrary.org/b/isbn/9780064400558-L.jpg", language: "en", mustRead: true },

  // ===== EN · middle =====
  { id: "b-en-holes", kind: "book", title: "Holes", creator: "Louis Sachar", stage: "middle", ages: "10–12", emoji: "🕳️", hue: 30, summary: "Stanley Yelnats digs holes at a desert camp — and uncovers a generations-old mystery.", why: "Newbery Medal-winning structure with humor, history, and grit.", tags: ["Newbery", "mystery"], coverUrl: "https://covers.openlibrary.org/b/isbn/9780440414803-L.jpg", language: "en", mustRead: true },
  { id: "b-en-lightning", kind: "book", title: "Percy Jackson: The Lightning Thief", creator: "Rick Riordan", stage: "middle", ages: "9–12", emoji: "⚡", hue: 220, summary: "A twelve-year-old discovers he's the son of a Greek god — and a thief.", why: "Action-packed gateway into mythology for upper-elementary readers.", tags: ["fantasy", "mythology"], coverUrl: "https://covers.openlibrary.org/b/isbn/9780786838653-L.jpg", language: "en" },
  { id: "b-en-wrinkle", kind: "book", title: "A Wrinkle in Time", creator: "Madeleine L'Engle", stage: "middle", ages: "10–12", emoji: "🌌", hue: 260, summary: "Meg, Charles Wallace, and Calvin travel through space and time to rescue their father.", why: "Newbery-winning sci-fi that blends science, family, and courage.", tags: ["Newbery", "sci-fi"], coverUrl: "https://covers.openlibrary.org/b/isbn/9780312367541-L.jpg", language: "en" },
  { id: "b-en-giver", kind: "book", title: "The Giver", creator: "Lois Lowry", stage: "middle", ages: "10–12", emoji: "🎁", hue: 200, summary: "In a society of sameness, Jonas is chosen to receive the memories of the past.", why: "Newbery Medal dystopia that opens deep discussions about freedom and feeling.", tags: ["Newbery", "dystopia"], coverUrl: "https://covers.openlibrary.org/b/isbn/9780544336261-L.jpg", language: "en" },
  { id: "b-en-terabithia", kind: "book", title: "Bridge to Terabithia", creator: "Katherine Paterson", stage: "middle", ages: "10–12", emoji: "🌉", hue: 140, summary: "Two outsider friends invent a magical kingdom — until tragedy reshapes everything.", why: "A powerful Newbery story about friendship, imagination, and grief.", tags: ["Newbery", "friendship"], coverUrl: "https://covers.openlibrary.org/b/isbn/9780064401845-L.jpg", language: "en" },

  // ===== KO · 인플루언서/네이버 블로그 추천 추가 (그림책 · 동화) =====
  { id: "b-ko-100floor", kind: "book", title: "100층짜리 집", creator: "이와이 도시오", stage: "toddler", ages: "4–7세", emoji: "🏠", hue: 200, summary: "한 층 한 층 올라가며 다양한 동물 친구들을 만나는 세로 그림책.", why: "수 세기와 관찰력을 동시에 키워주는 베스트셀러 시리즈.", tags: ["수학", "관찰", "시리즈"], mustRead: true },
  { id: "b-ko-poop-rain", kind: "book", title: "똥벼락", creator: "김회경 · 조혜란", stage: "toddler", ages: "5–8세", emoji: "💩", hue: 30, summary: "욕심쟁이 김부자에게 똥벼락이 내리는 통쾌한 옛이야기.", why: "한국 전래의 해학과 권선징악을 토속적인 그림으로 만나요.", tags: ["전래동화", "유머"], mustRead: true },
  { id: "b-ko-dokebi-mom", kind: "book", title: "도깨비를 빨아버린 우리 엄마", creator: "사토 와키코", stage: "toddler", ages: "4–7세", emoji: "👹", hue: 160, summary: "도깨비도 빨래통에 넣어 빨아버리는 씩씩한 엄마 이야기.", why: "엄마의 힘과 유머를 사랑하게 되는 스테디셀러.", tags: ["가족", "유머"] },
  { id: "b-ko-jiwon-byungkwan", kind: "book", title: "지원이와 병관이 시리즈", creator: "고대영 · 김영진", stage: "toddler", ages: "3–6세", emoji: "🚌", hue: 50, summary: "지원이와 병관이 남매의 사실적인 일상을 담은 그림책 시리즈.", why: "아이 눈높이의 생활 장면이 한국 가정의 공감을 부르는 추천 시리즈.", tags: ["일상", "시리즈", "전집"], mustRead: true },
  { id: "b-ko-mom-katuri", kind: "book", title: "엄마 까투리", creator: "권정생", stage: "toddler", ages: "5–8세", emoji: "🐦", hue: 20, summary: "불길 속에서 새끼들을 지키는 엄마 까투리의 깊은 사랑 이야기.", why: "한국 동화의 거장이 그려낸 모성과 생명의 의미.", tags: ["고전", "가족"] },
  { id: "b-ko-solyi-chuseok", kind: "book", title: "솔이의 추석 이야기", creator: "이억배", stage: "toddler", ages: "4–7세", emoji: "🌕", hue: 40, summary: "솔이네 가족과 함께 떠나는 정겨운 추석 명절 풍경.", why: "한국 전통 명절 문화를 자연스럽게 익힐 수 있는 그림책.", tags: ["명절", "문화"] },

  // ===== KO · early 인기 추천 =====
  { id: "b-ko-wrong-banjang", kind: "book", title: "잘못 뽑은 반장", creator: "이은재", stage: "early", ages: "8–10세", emoji: "🎒", hue: 220, summary: "엉뚱한 해리가 얼떨결에 반장이 되며 벌어지는 이야기.", why: "초등 저학년 인기 1위 챕터북. 학교 생활 공감 만점.", tags: ["학교", "챕터북"], mustRead: true },
  { id: "b-ko-heunhan-siblings", kind: "book", title: "흔한남매 1", creator: "백난도 · 흔한남매", stage: "early", ages: "7–10세", emoji: "😂", hue: 310, summary: "유튜브에서 시작된 흔한남매의 일상 코믹 학습만화.", why: "아이들이 자발적으로 책을 펴게 만드는 인기 시리즈.", tags: ["학습만화", "유머"] },
  { id: "b-ko-mind-voice", kind: "book", title: "마음의 소리: 어린이 편", creator: "조석", stage: "early", ages: "8–10세", emoji: "💭", hue: 280, summary: "조석 작가의 인기 웹툰을 어린이 눈높이로 재구성한 만화.", why: "유머와 함께 감정 표현을 배우는 가벼운 읽기 입문서.", tags: ["만화", "유머"] },
  { id: "b-ko-book-noni", kind: "book", title: "책과 노니는 집", creator: "이영서", stage: "early", ages: "8–10세", emoji: "📜", hue: 30, summary: "조선 시대 책방을 배경으로 한 따뜻한 역사 동화.", why: "역사와 문학을 함께 만나는 한국 창작 추천 도서.", tags: ["역사", "한국창작"], mustRead: true },

  // ===== KO · middle 인기 추천 =====
  { id: "b-ko-blue-lion-wanini", kind: "book", title: "푸른 사자 와니니", creator: "이현", stage: "middle", ages: "9–12세", emoji: "🦁", hue: 60, summary: "무리에서 쫓겨난 어린 사자 와니니의 성장 이야기.", why: "MBC 권장도서, 학교 추천 1순위로 꼽히는 한국 창작 동화.", tags: ["성장", "한국창작"], mustRead: true },
  { id: "b-ko-bonjour-tours", kind: "book", title: "봉주르, 뚜르", creator: "한윤섭", stage: "middle", ages: "10–12세", emoji: "✈️", hue: 200, summary: "프랑스 뚜르에서 만난 북한 소년과의 우정을 그린 소설.", why: "분단과 우정을 동시에 다루는 깊이 있는 추천작.", tags: ["우정", "사회"] },
  { id: "b-ko-mascot", kind: "book", title: "마당을 나온 암탉", creator: "황선미", stage: "middle", ages: "9–12세", emoji: "🐔", hue: 40, summary: "양계장을 벗어난 암탉 잎싹의 자유와 모성의 여정.", why: "한국 아동문학의 대표작. 자아실현과 사랑을 동시에 그립니다.", tags: ["한국창작", "성장"], mustRead: true },

  // ===== KO · 전집 추천 (인플루언서/블로그 픽) =====
  { id: "set-ko-noburyong", kind: "book", title: "[전집] 노부영 베스트 30종", creator: "JY Books", stage: "toddler", ages: "3–7세", emoji: "📚", hue: 180, summary: "노래로 부르는 영어 원서 그림책 전집. Eric Carle, Julia Donaldson 등 명작 수록.", why: "엄마표 영어의 정석으로 꼽히는 스테디 전집. 노래와 그림으로 영어 노출.", tags: ["전집", "영어", "엄마표"], mustRead: true },
  { id: "set-ko-greatbooks-nature", kind: "book", title: "[전집] 그레이트북스 자연관찰", creator: "그레이트북스", stage: "toddler", ages: "4–8세", emoji: "🌱", hue: 130, summary: "동식물과 자연 현상을 사진과 일러스트로 담아낸 인기 자연관찰 전집.", why: "초등 과학 연계 활동까지 가능한 블로그 추천 전집.", tags: ["전집", "자연관찰", "과학"], mustRead: true },
  { id: "set-ko-hansol-math", kind: "book", title: "[전집] 한솔 수학동화", creator: "한솔교육", stage: "early", ages: "5–8세", emoji: "🔢", hue: 50, summary: "이야기 속에서 수와 도형 개념을 자연스럽게 익히는 수학 그림책 전집.", why: "수학 거부감을 줄여주는 대표 학습 전집.", tags: ["전집", "수학"], mustRead: true },
  { id: "set-ko-magic-time", kind: "book", title: "[전집] 마법의 시간여행 1–30", creator: "메리 폽 어즈번", stage: "early", ages: "7–10세", emoji: "🌳", hue: 160, summary: "잭과 애니가 시대와 자연을 오가는 챕터북 베스트 전집.", why: "읽기 독립기 아이에게 가장 많이 추천되는 시리즈 전집.", tags: ["전집", "챕터북", "역사"], mustRead: true },
  { id: "set-ko-shogakukan-sci", kind: "book", title: "[전집] Why? 시리즈 베스트", creator: "예림당", stage: "early", ages: "7–10세", emoji: "❓", hue: 200, summary: "과학·인문·사회 주제를 학습만화로 풀어낸 국민 학습 전집.", why: "호기심 폭발기 아이들이 가장 많이 찾는 학습만화 전집.", tags: ["전집", "학습만화", "과학"] },
  { id: "set-ko-biryongso-friends", kind: "book", title: "[전집] 비룡소 난 책읽기가 좋아", creator: "비룡소", stage: "early", ages: "6–9세", emoji: "📖", hue: 280, summary: "단계별로 구성된 저학년 읽기 독립 챕터북 전집.", why: "한글 떼기 후 독서 습관 형성에 추천되는 단계별 전집.", tags: ["전집", "읽기독립"] },
  { id: "set-ko-heoseo-history", kind: "book", title: "[전집] 용선생의 시끌벅적 한국사", creator: "사회평론", stage: "middle", ages: "9–12세", emoji: "🏯", hue: 30, summary: "용선생과 함께 떠나는 한국사 통사 전집.", why: "초등 한국사 추천 1순위. 흥미와 깊이를 함께 잡은 전집.", tags: ["전집", "역사", "한국사"], mustRead: true },

  // ===== KO · 네이버 블로그/교육 인플루언서 추천 추가 그림책 =====
  { id: "b-ko-no-david", kind: "book", title: "안 돼, 데이빗!", creator: "데이빗 섀논", stage: "toddler", ages: "3–6세", emoji: "🙅", hue: 0, summary: "장난꾸러기 데이빗의 하루를 따라가는 코믹 그림책.", why: "짧은 문장과 표정 풍부한 그림으로 아이들이 가장 좋아하는 그림책 중 하나.", tags: ["그림책", "유머"], mustRead: true },
  { id: "b-ko-pigeon-bus", kind: "book", title: "비둘기에게 버스 운전은 맡기지 마세요!", creator: "모 윌렘스", stage: "toddler", ages: "3–6세", emoji: "🚌", hue: 220, summary: "버스를 운전하고 싶은 비둘기와 독자가 직접 대화하는 인터랙티브 그림책.", why: "아이의 반응을 끌어내는 참여형 그림책의 정석.", tags: ["참여형", "유머"], mustRead: true },
  { id: "b-ko-leon", kind: "book", title: "치과 의사 드소토 선생님", creator: "윌리엄 스타이그", stage: "toddler", ages: "4–7세", emoji: "🦷", hue: 200, summary: "여우 환자를 만난 생쥐 치과의사 드소토 부부의 기지가 빛나는 이야기.", why: "지혜와 유머가 어우러진 칼데콧 명예상 그림책.", tags: ["고전", "지혜"] },
  { id: "b-ko-i-am-me", kind: "book", title: "치킨 마스크", creator: "우쓰기 미호", stage: "toddler", ages: "4–7세", emoji: "🐔", hue: 30, summary: "자존감 낮은 아이가 자신을 사랑하게 되는 따뜻한 그림책.", why: "자존감과 자기 수용을 다루어 부모 사이에서 입소문 난 책.", tags: ["자존감", "감정"], mustRead: true },
  { id: "b-ko-color-monster", kind: "book", title: "컬러 몬스터, 감정의 색깔", creator: "아나 예나스", stage: "toddler", ages: "3–6세", emoji: "🎨", hue: 280, summary: "뒤죽박죽 감정을 색깔별로 정리해가는 몬스터의 이야기.", why: "유아 감정 교육의 베스트셀러. 팝업판도 인기.", tags: ["감정", "팝업"], mustRead: true },
  { id: "b-ko-yumi-grandma", kind: "book", title: "우리 할머니가 정말 좋아요", creator: "글로리아 휴스턴", stage: "toddler", ages: "4–7세", emoji: "👵", hue: 350, summary: "할머니와의 추억을 따뜻하게 그린 그림책.", why: "가족 사랑과 세대 간 유대를 잔잔히 전합니다.", tags: ["가족", "사랑"] },
  { id: "b-ko-bed-monster", kind: "book", title: "침대 밑에 괴물이 있어요", creator: "마이클 로젠", stage: "toddler", ages: "3–6세", emoji: "🛏️", hue: 240, summary: "잠들기 무서운 아이의 마음을 다정하게 어루만지는 그림책.", why: "두려움 다루기에 효과적인 잠자리 추천 도서.", tags: ["잠자리", "감정"] },
  { id: "b-ko-school-feel", kind: "book", title: "학교 가기 싫은 선생님", creator: "박보람", stage: "toddler", ages: "5–7세", emoji: "🏫", hue: 60, summary: "학교 가기 싫은 건 아이뿐만이 아니라는 반전 그림책.", why: "입학 전후 아이의 불안을 자연스럽게 풀어줍니다.", tags: ["학교", "감정"] },
  { id: "b-ko-bus-stop", kind: "book", title: "지각대장 존", creator: "존 버닝햄", stage: "toddler", ages: "4–7세", emoji: "⏰", hue: 30, summary: "지각 사유를 믿어주지 않는 어른과 아이의 상상력 대결.", why: "어른의 권위에 맞서는 아이의 상상력을 응원하는 명작.", tags: ["상상력", "고전"] },
  { id: "b-ko-ten-friends", kind: "book", title: "열까지 셀 줄 아는 아기염소", creator: "알프 프로이센", stage: "toddler", ages: "3–6세", emoji: "🐐", hue: 130, summary: "수를 셀 줄 알게 된 아기염소의 즐거운 모험.", why: "수 개념과 이야기 즐거움을 함께 잡는 스테디셀러.", tags: ["수학", "동물"] },
  { id: "b-ko-three-robbers", kind: "book", title: "세 강도", creator: "토미 웅거러", stage: "toddler", ages: "4–7세", emoji: "🎩", hue: 270, summary: "사나운 세 강도가 한 소녀를 만나 변해가는 이야기.", why: "강렬한 색감과 메시지로 오래 사랑받는 그림책.", tags: ["고전", "변화"] },

  // ===== KO · early 추가 추천 =====
  { id: "b-ko-mt-house", kind: "book", title: "산왕 부루", creator: "이지현", stage: "early", ages: "7–10세", emoji: "🐻", hue: 60, summary: "지리산 호랑이 부루와 인간 아이의 우정을 그린 한국 창작 동화.", why: "한국적 자연관과 생명 존중을 담은 추천 도서.", tags: ["한국창작", "자연"] },
  { id: "b-ko-comic-history", kind: "book", title: "설민석의 한국사 대모험 1", creator: "설민석", stage: "early", ages: "8–10세", emoji: "📜", hue: 30, summary: "설민석 선생님과 함께 떠나는 한국사 학습만화.", why: "한국사 입문 1순위로 꼽히는 인기 학습만화.", tags: ["학습만화", "역사"], mustRead: true },
  { id: "b-ko-mathadventure", kind: "book", title: "수학도둑 1", creator: "송도수", stage: "early", ages: "8–10세", emoji: "🧮", hue: 200, summary: "수학 개념을 만화로 풀어내는 인기 학습만화.", why: "수학 흥미 유발 1위. 도서관 대출 베스트.", tags: ["학습만화", "수학"] },
  { id: "b-ko-zoofamily", kind: "book", title: "동물원에서 생긴 일", creator: "이지유", stage: "early", ages: "7–9세", emoji: "🦒", hue: 110, summary: "동물원 사육사의 시선으로 만나는 동물 이야기.", why: "동물 복지와 생명 교육을 자연스럽게 배웁니다.", tags: ["동물", "환경"] },
  { id: "b-ko-shittiya", kind: "book", title: "수상한 시리즈: 수상한 학교", creator: "박현숙", stage: "early", ages: "8–10세", emoji: "🔍", hue: 280, summary: "초등생들이 가장 좋아하는 미스터리 챕터북 시리즈.", why: "추리와 학교 일상이 어우러진 베스트셀러.", tags: ["미스터리", "시리즈"], mustRead: true },
  { id: "b-ko-comic-runner", kind: "book", title: "코믹 메이플스토리 오프라인 RPG 1", creator: "송도수", stage: "early", ages: "8–11세", emoji: "🎮", hue: 220, summary: "게임 메이플스토리를 기반으로 한 인기 학습 만화.", why: "남자아이 베스트셀러. 책읽기 거부감 줄이는 입문서로 자주 추천.", tags: ["학습만화", "판타지"] },

  // ===== KO · middle 추가 추천 =====
  { id: "b-ko-bird-namu", kind: "book", title: "나무를 심은 사람", creator: "장 지오노", stage: "middle", ages: "10–12세", emoji: "🌳", hue: 130, summary: "수십 년간 묵묵히 나무를 심어 황무지를 숲으로 바꾼 한 사람의 이야기.", why: "환경과 인내, 가치에 대한 깊은 울림을 주는 고전.", tags: ["환경", "고전"] },
  { id: "b-ko-good-shower", kind: "book", title: "소나기", creator: "황순원", stage: "middle", ages: "11–13세", emoji: "🌦️", hue: 200, summary: "시골 소년과 도시 소녀의 짧고 애틋한 첫사랑.", why: "한국 단편문학의 정수. 정서적 성장을 돕는 필독서.", tags: ["한국문학", "고전"], mustRead: true },
  { id: "b-ko-anne", kind: "book", title: "빨강머리 앤", creator: "루시 모드 몽고메리", stage: "middle", ages: "9–12세", emoji: "👧", hue: 0, summary: "초록지붕 집에 입양된 앤의 사랑스럽고 씩씩한 성장기.", why: "꿈과 우정, 가족의 의미를 깊이 있게 담은 세계 명작.", tags: ["고전", "성장"], mustRead: true },
  { id: "b-ko-charlotte-web-ko", kind: "book", title: "샬롯의 거미줄", creator: "E. B. 화이트", stage: "middle", ages: "9–11세", emoji: "🕸️", hue: 280, summary: "거미 샬롯과 돼지 윌버의 잊지 못할 우정.", why: "초등 추천 도서 1순위로 꼽히는 우정 이야기.", tags: ["고전", "우정"], mustRead: true },
  { id: "b-ko-the-summer", kind: "book", title: "복실이네 가족사진", creator: "노경실", stage: "middle", ages: "9–12세", emoji: "📷", hue: 30, summary: "복실이네 가족의 따뜻한 일상을 그린 한국 창작 동화.", why: "한국 가정의 정서를 잘 담아 학교 추천 도서로 자주 선정.", tags: ["가족", "한국창작"] },
  { id: "b-ko-deokmin", kind: "book", title: "내 인생의 알파벳", creator: "바버라 오코너", stage: "middle", ages: "10–12세", emoji: "🔤", hue: 50, summary: "이사를 자주 다니는 소녀가 친구와 가족을 찾아가는 이야기.", why: "정서적 성장과 자기 수용을 다룬 외국 동화 추천작.", tags: ["성장", "우정"] },

  // ===== KO · 전집 추가 (블로그/인플루언서 추천) =====
  { id: "set-ko-purple-friends", kind: "book", title: "[전집] 보라보라 자연관찰", creator: "보라출판사", stage: "toddler", ages: "4–7세", emoji: "🐞", hue: 290, summary: "곤충·식물·계절을 사진 중심으로 담은 유아 자연관찰 전집.", why: "그레이트북스 자연관찰과 함께 자주 비교 추천되는 인기 전집.", tags: ["전집", "자연관찰"] },
  { id: "set-ko-tongtong", kind: "book", title: "[전집] 통통 그림책", creator: "한솔수북", stage: "infant", ages: "1–4세", emoji: "🧸", hue: 350, summary: "영유아 첫 그림책으로 인기 있는 통통 시리즈 전집.", why: "두꺼운 보드북 + 큰 그림으로 첫 책으로 가장 많이 추천됨.", tags: ["전집", "보드북"], mustRead: true },
  { id: "set-ko-paper-doll", kind: "book", title: "[전집] 똑똑한 그림책", creator: "웅진주니어", stage: "toddler", ages: "3–6세", emoji: "📘", hue: 200, summary: "생활 습관·인지·언어를 키우는 통합 그림책 전집.", why: "교육 인플루언서 사이 꾸준한 인기 전집.", tags: ["전집", "통합"] },
  { id: "set-ko-who-series", kind: "book", title: "[전집] Who? 인물 시리즈", creator: "다산어린이", stage: "early", ages: "8–11세", emoji: "👤", hue: 220, summary: "세계 위인을 학습만화로 풀어낸 베스트셀러 인물 전집.", why: "초등 인물 학습만화 1순위. 도서관 대출 베스트.", tags: ["전집", "인물", "학습만화"], mustRead: true },
  { id: "set-ko-survival", kind: "book", title: "[전집] 살아남기 시리즈", creator: "아이세움", stage: "early", ages: "8–11세", emoji: "🌋", hue: 30, summary: "지진·우주·바이러스 등 위기 상황을 다루는 과학 학습만화.", why: "남녀 초등 모두에게 인기인 과학 학습만화 베스트셀러.", tags: ["전집", "과학", "학습만화"], mustRead: true },
  { id: "set-ko-baby-bear", kind: "book", title: "[전집] 베이비 올", creator: "한국헤르만헤세", stage: "infant", ages: "0–2세", emoji: "👶", hue: 50, summary: "영아 발달 단계에 맞춘 첫 책 전집.", why: "0세 베이비 첫 책으로 인플루언서 추천 다수.", tags: ["전집", "영아"] },
  { id: "set-ko-prek-eng", kind: "book", title: "[전집] 잉글리시 에그", creator: "잉글리시에그", stage: "toddler", ages: "4–7세", emoji: "🥚", hue: 60, summary: "엄마표 영어로 가장 많이 거론되는 영어 노출 전집.", why: "노부영과 함께 엄마표 영어 양대 산맥.", tags: ["전집", "영어", "엄마표"] },
  { id: "set-ko-magic-1000", kind: "book", title: "[전집] 마법천자문 시리즈", creator: "시리얼", stage: "early", ages: "7–10세", emoji: "🐉", hue: 350, summary: "한자를 모험과 함께 익히는 국민 학습만화 시리즈.", why: "초등 한자 학습만화 1순위. 시리즈 누적 1,000만 부 베스트.", tags: ["전집", "학습만화", "한자"], mustRead: true },
  { id: "set-ko-shinki-history", kind: "book", title: "[전집] 그래서 이런 한국사가 생겼대요", creator: "길벗스쿨", stage: "early", ages: "7–10세", emoji: "🏯", hue: 40, summary: "사건 중심으로 풀어낸 저학년 한국사 입문 전집.", why: "용선생 한국사 이전 단계로 추천되는 저학년용 한국사 전집.", tags: ["전집", "역사", "한국사"] },
];

export function libraryLinks(title: string) {
  const q = encodeURIComponent(title);
  return [
    { name: "전국 공공도서관 통합검색 (책이음)", url: `https://www.nl.go.kr/NL/contents/search.do?kwd=${q}` },
  ];
}

export function nearbyLibraryMapUrl(lat: number, lng: number) {
  // Google Maps: 위치 기반 공공도서관 주변 검색
  return `https://www.google.com/maps/search/공공도서관/@${lat},${lng},15z`;
}

export function shopLinks(title: string) {
  const q = encodeURIComponent(title);
  return [
    { name: "교보문고", url: `https://search.kyobobook.co.kr/search?keyword=${q}` },
    { name: "알라딘", url: `https://www.aladin.co.kr/search/wsearchresult.aspx?SearchTarget=Book&SearchWord=${q}` },
    { name: "YES24", url: `https://www.yes24.com/Product/Search?domain=BOOK&query=${q}` },
  ];
}