// 서울시 공공도서관 데이터셋 (서울 열린데이터광장 / 도서관정보나루 공개 데이터 기반 발췌)
// 출처: https://data.seoul.go.kr / https://www.data4library.kr (오픈 API · CC BY)
// 좌표는 공개된 도서관 주소를 기반으로 한 근사 위경도입니다.

export interface SeoulLibrary {
  name: string;
  district: string;
  lat: number;
  lng: number;
  homepage: string;
}

export const SEOUL_LIBRARIES: SeoulLibrary[] = [
  { name: "서울도서관", district: "중구", lat: 37.5663, lng: 126.9779, homepage: "https://elib.seoul.go.kr/" },
  { name: "남산도서관", district: "용산구", lat: 37.5510, lng: 126.9810, homepage: "https://nslib.sen.go.kr/" },
  { name: "정독도서관", district: "종로구", lat: 37.5805, lng: 126.9836, homepage: "https://jdlib.sen.go.kr/" },
  { name: "종로도서관", district: "종로구", lat: 37.5821, lng: 126.9669, homepage: "https://jnlib.sen.go.kr/" },
  { name: "동대문도서관", district: "동대문구", lat: 37.5755, lng: 127.0420, homepage: "https://ddmlib.sen.go.kr/" },
  { name: "용산도서관", district: "용산구", lat: 37.5402, lng: 126.9772, homepage: "https://yslib.sen.go.kr/" },
  { name: "서대문도서관", district: "서대문구", lat: 37.5793, lng: 126.9434, homepage: "https://sdmlib.sen.go.kr/" },
  { name: "마포평생학습관", district: "마포구", lat: 37.5476, lng: 126.9242, homepage: "https://mplib.sen.go.kr/" },
  { name: "영등포평생학습관", district: "영등포구", lat: 37.5219, lng: 126.9077, homepage: "https://ydplib.sen.go.kr/" },
  { name: "구로도서관", district: "구로구", lat: 37.4954, lng: 126.8874, homepage: "https://grlib.sen.go.kr/" },
  { name: "강서도서관", district: "강서구", lat: 37.5509, lng: 126.8495, homepage: "https://gslib.sen.go.kr/" },
  { name: "양천도서관", district: "양천구", lat: 37.5169, lng: 126.8665, homepage: "https://yclib.sen.go.kr/" },
  { name: "은평구립도서관", district: "은평구", lat: 37.6176, lng: 126.9226, homepage: "https://www.eplibrary.or.kr/" },
  { name: "노원평생학습관", district: "노원구", lat: 37.6543, lng: 127.0568, homepage: "https://nwlib.sen.go.kr/" },
  { name: "도봉도서관", district: "도봉구", lat: 37.6688, lng: 127.0471, homepage: "https://dblib.sen.go.kr/" },
  { name: "고덕평생학습관", district: "강동구", lat: 37.5550, lng: 127.1543, homepage: "https://gdlib.sen.go.kr/" },
  { name: "송파도서관", district: "송파구", lat: 37.5036, lng: 127.1145, homepage: "https://splib.sen.go.kr/" },
  { name: "개포도서관", district: "강남구", lat: 37.4783, lng: 127.0594, homepage: "https://gplib.sen.go.kr/" },
  { name: "강남도서관", district: "강남구", lat: 37.4979, lng: 127.0276, homepage: "https://gnlib.sen.go.kr/" },
  { name: "성북정보도서관", district: "성북구", lat: 37.6080, lng: 127.0265, homepage: "https://www.sblib.seoul.kr/" },
  { name: "관악중앙도서관", district: "관악구", lat: 37.4784, lng: 126.9516, homepage: "https://lib.gwanak.go.kr/" },
  { name: "동작도서관", district: "동작구", lat: 37.5050, lng: 126.9444, homepage: "https://djlib.sen.go.kr/" },
  { name: "서초구립반포도서관", district: "서초구", lat: 37.5023, lng: 127.0148, homepage: "https://reading.seocho.go.kr/" },
  { name: "광진정보도서관", district: "광진구", lat: 37.5446, lng: 127.0824, homepage: "https://www.gwangjinlib.seoul.kr/" },
  { name: "성동구립무학도서관", district: "성동구", lat: 37.5635, lng: 127.0356, homepage: "https://www.sdlib.or.kr/" },
  { name: "중랑구립정보도서관", district: "중랑구", lat: 37.5953, lng: 127.0936, homepage: "https://www.jnlib.or.kr/" },
  { name: "강북문화정보도서관", district: "강북구", lat: 37.6398, lng: 127.0257, homepage: "https://www.gblib.seoul.kr/" },
];

// Haversine 거리 (km)
export function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export function nearestLibraries(lat: number, lng: number, n = 5) {
  return SEOUL_LIBRARIES.map((l) => ({ ...l, distanceKm: distanceKm(lat, lng, l.lat, l.lng) }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, n);
}

// 도서관정보나루 (문체부 오픈 API) 도서 검색 - 누구나 사용 가능한 공개 검색 페이지
export function infoNaruSearchUrl(title: string) {
  return `https://www.data4library.kr/bookSearch?keyword=${encodeURIComponent(title)}`;
}