import React, { useState, useEffect, useRef } from "react";

const C = { d1:"#1D4ED8", d2:"#047857", d3:"#B91C1C", d4:"#6D28D9", food:"#F59E0B", sight:"#0891B2", move:"#6B7280", hotel:"#8B5CF6", special:"#EC4899" };
const typeColor = { food:C.food, sight:C.sight, move:C.move, hotel:C.hotel, special:C.special };
const typeLabel = { food:"맛집", sight:"관광", move:"이동", hotel:"숙소", special:"체험" };

const HOTEL = { lat:35.71137, lng:139.77293, name:"APA호텔 (숙소)" };

// 실제 장소 사진 (구글 장소 사진). 안 뜨면 자동 숨김 + '사진 더보기' 버튼으로 대체
const PHOTOS = {
  "Ueno Park": "https://lh3.googleusercontent.com/place-photos/AJRVUZP1zrclM9uD1LRaVlTizOqz_nDb1JWdxn4eCVZg0rGmq4n5e7hJ3d8I4kF_hCzN4QnCc8S9n2ZGrAgSuEnXOfl3gasCCbxttkxNxQPjU0viLNqS8InDRXxq3SkCnwttPBnMoRO7PBGg1GaVJ54=s1200-w600",
  "Senso-ji Temple": "https://lh3.googleusercontent.com/place-photos/AJRVUZON49GPfBxXBT74T92Eic6Dt0fb68WZSaOV9DlqElzv9ZJQbbYJgZOokQFwCTIrwYbI3olxgQvGlIngAMpvBQ9JVcfmVThvkQD9uNhP0ZRqy8r5fOnbICcMbU7Wl1wJR_ROZRMSW10csQgrNmk=s1200-w600",
  "Ichiran Ueno": "https://lh3.googleusercontent.com/place-photos/AJRVUZMQZtTYkz7Jsd5XWFq0bJSyQCZjl6kclv_kA56vOtaJQRBBThE-UAVMevQYfkuUBvkUpYAwyrtRWeEonTDGKtwMKALvVKk4PzdtLMre46Ls-CGmAVN8Rj5fnM6UgudKWONtrrUsvqjHUDY6Ow=s1200-w600",
  "Asakusa Gyukatsu": "https://lh3.googleusercontent.com/place-photos/AJRVUZPe0eBs1_gS3oJD286w8bqXl9-PC2rtVjeQ-sIO30Cw1Kmze1y1rfaO4eHN8zzdb2XoUIR0vReCDwxdHXp1AB3ot4TDWWJXx1zhsLJFJ4BARrRu-v0fypB5ia1Q1vRTf2tvr3AjvkF6etSURMKH6y9g=s1200-w600",
  "Tokyo Skytree": "https://lh3.googleusercontent.com/place-photos/AJRVUZO2UGoDDDJYKk9sXKRBygVHIHRGhlqH2lFnIxwHRPfLjUNBHNlh13hOkbDgvO_zoWxJ8F-cGNI3X5OThey1-Kbe7atk9AbtwZGivVfKR1WafhhzvOXs2dejBUNvRa17_OhcZ3Sbv17_Ef-yBA=s1200-w600",
  "Sushi Dai Honkan Tsukiji": "https://lh3.googleusercontent.com/place-photos/AJRVUZPeVuCyS7jcUg5E3ha5GVm8qacLD20sJRBB8VzZh9OH5K-zrdPlqztyFAznfSyU_QiXbppRTASGac3N1F-pxMCJWd3xjr7Aw0dMH_aKdyjVJ3ay9YX-bqenkTiWKedkjsEYnePhJlBjFe4vUFNF9IBT=s1200-w600",
  "teamLab Planets Tokyo": "https://lh3.googleusercontent.com/place-photos/AJRVUZMX7akxQqKYaJwtLqSVFoaDGcHDPXzK1K6PYWwWjJ2vUlVTDQlbIuucO3IByTf_hw_X0ALOo7H-bmwy6KeiMWnjnjPVn6Dn7V0_8pF4L1lbzmSSisxaAMt0I65Yz0PkojgAvKMFmqTKkCTeB2c=s1200-w600",
  "Gyopao Gyoza Shinjuku": "https://lh3.googleusercontent.com/place-photos/AJRVUZPWeHfIKNuPC8GdXTJycRdxuPdGdGBatJlVgOmH3vPS24lkIENsYIlLjjMAJVE1ymkxt3NoMLsOxj0Ol7-b0BWYx9ajgAUuSFfQO5UXFiKwtawSXgU4E40ui736HD7kHrknbyJH-lwv49uMxw=s1200-w600",
  "Marion Crepes Harajuku": "https://lh3.googleusercontent.com/place-photos/AJRVUZPuk4WB0wHH180N4wDbNAoFQc_ZCm3J-HgtfLBfHeE0gQHivqmnLhr5Pz3YAWg4EcZ8kp5RdU3v4VH0nHaKDK7x0wxXtCX2TvuyhuHGMucDcprCRm7St6ybPgbwyG7eMUWN-JH3HyDgtoMBxouKN87JrQ=s1200-w600",
  "Shibuya Crossing": "https://lh3.googleusercontent.com/place-photos/AJRVUZM4Iqj7MkEquQiSXs44Bor5BpAIbLY4LNKM9RjBiayK3K08lGhnNRCpHjVzVYC8fCqoThxg8JZUYrkM81CsXRPuwsFT1rC1yOn7GbWE9quGV1NovFZuFYTH5O5khG_NatIPuj-PHAchOY7Mqw=s1200-w600",
  "Hokuto Sukiyaki Ginza Corridor": "https://lh3.googleusercontent.com/place-photos/AJRVUZP3HUfheO541oJGc3bhDqEDcBQZnYNB4N5WC9s8Er-JAA5CnoVSOaEg8rEOAk-SppvecxeVmPntTSdYzFUKUsiqYby0ubYMuI0knh55UT1rXXei0-NfMbo4idzw7R1nGeMcJVexmwAIwLp_TJE6tOIdsw=s1200-w600",
  "Tokyo Tower": "https://lh3.googleusercontent.com/place-photos/AJRVUZMoFit6RA89s29ZL9wYxKFuVvaWA6t0qsv9rOUzszhJ9G-Olf54-imRbqUY0T50La7Gl5ifq-1ngGRbTeYnTh2yDCZVVK1Gzl6Xw7HfqvAmXDOjy6dFiAA_47SCq4aU63faBniiWP8mlZB27g=s1200-w600",
  "Komakichi Nihonbashi": "https://lh3.googleusercontent.com/place-photos/AJRVUZPlIFDq7zEK2E9Bn7c9PDv1gwyI5uXgAXSE5eXtlgVUjdAIbRJTLQPRyH9Goh-sOUvICGz6fuys7mvx1ShEcZWp0qjcmjOu50pT6nUosboJUnRvOHS-yYt4RYmGcqEBkelTD09hLLyNqhwZjBQ=s1200-w600",
  "Musashino Mori Diner Shinjuku": "https://lh3.googleusercontent.com/places/ANXAkqELR7S4UQzOET6svZS8AZYlS-JPzqBmVknPd8uq2tWNwUcjFRG6gqQfV7V0xQV-Zl2Zk85m08-j0Y0MX50Rs5BUaj2ILhx0ZCo=s1200-w600",
  "Fuunji Shinjuku": "https://lh3.googleusercontent.com/place-photos/AJRVUZP5gWFQ20Fsn3CDeG9VNI04Abv3jqSnxPI7N5BlAk9v3HvY82ez__-jAnPFUjSkaid8ofWz5yfq8BR4ibfqJiV76U7ZUrkeEE2ekscUO8_20orT9-7zTTYjSWgI41AAvNqxVgV910_1yyEW9xTe4G7-SQ=s1200-w600",
};
const mapUrl = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const imgSearchUrl = (q) => `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(q)}`;

const DATA = {
  days: [
    { id:1, date:"6/3 (화)", color:C.d1, theme:"나리타 도착 → 우에노 → 도쿄타워", weather:"🌧", weatherText:"비 가능성 높음",
      route:[
        { time:"10:00", emoji:"✈️", name:"나리타공항", note:"케이세이 카운터에서 스카이라이너 구매 + Suica 구입", type:"move", map:"Narita Airport Terminal 1", lat:35.7719, lng:140.3928 },
        { time:"11:20", emoji:"🚂", name:"스카이라이너", note:"나리타 → 우에노 40분 · ¥2,570", type:"move", map:"Keisei Ueno Station", lat:35.71137, lng:139.77293 },
        { time:"12:00", emoji:"🍜", name:"이치란 라멘 (점심)", note:"우에노역 도착 후 바로 · 24시간 · 1인 칸막이", type:"food", map:"Ichiran Ueno", lat:35.71241, lng:139.77523 },
        { time:"13:00", emoji:"🏨", name:"APA호텔 체크인", note:"게이세이 우에노 역 앞 · 얼리체크인 1pm", type:"hotel", map:"APA Hotel Keisei Ueno Ekimae", lat:35.71137, lng:139.77293 },
        { time:"15:00", emoji:"🌳", name:"우에노공원 · 아메요코", note:"공원 산책 + 노점 구경", type:"sight", map:"Ueno Park", lat:35.71476, lng:139.77343 },
        { time:"17:30", emoji:"🥐", name:"마리옹 크레페 (도쿄타워점)", note:"도쿄타워 바로 아래 · 타워 보며 크레페", type:"food", map:"Marion Crepes Tokyo Tower Shibakoen", lat:35.65877, lng:139.74573 },
        { time:"18:00", emoji:"🗼", name:"도쿄타워 야경 · 사진", note:"타워 주변에서 점등 보며 사진 (~20:30)", type:"sight", map:"Tokyo Tower", lat:35.65858, lng:139.74543 },
        { time:"21:00", emoji:"🏨", name:"숙소 복귀", note:"카미야초→우에노 약 30분", type:"hotel", map:"APA Hotel Keisei Ueno Ekimae", lat:35.71137, lng:139.77293 },
      ],
      meals:[
        { time:"점심", emoji:"🍜", name:"이치란 라멘", area:"우에노", note:"24시간 · 1인 칸막이 · 우에노 아트레", tag:"라멘", map:"Ichiran Ueno" },
        { time:"간식", emoji:"🥐", name:"마리옹 크레페 (도쿄타워점)", area:"시바코엔", note:"도쿄타워 아래 · 타워 보며 크레페", tag:"크레페", map:"Marion Crepes Tokyo Tower Shibakoen" },
      ]},
    { id:2, date:"6/4 (목)", color:C.d2, theme:"츠키지 먹방 → 팀랩 → 아사쿠사", weather:"🌧", weatherText:"비 가능성 높음",
      route:[
        { time:"10:00", emoji:"🐟", name:"츠키지 장외시장 (먹방)", note:"신선한 해산물·계란말이·꼬치 등 이것저것 · 보통 13시쯤 마감", type:"food", map:"Tsukiji Outer Market", lat:35.66477, lng:139.77025 },
        { time:"15:30", emoji:"🎨", name:"팀랩 플래닛츠", note:"✅ 예약 완료 · 반바지+맨발 추천", type:"special", map:"teamLab Planets Tokyo", lat:35.64912, lng:139.78977 },
        { time:"18:30", emoji:"🥩", name:"아사쿠사 규카츠 (저녁)", note:"평점 4.8 · 돌판 직화 구이", type:"food", map:"Asakusa Gyukatsu", lat:35.71077, lng:139.79595 },
        { time:"20:00", emoji:"⛩", name:"센소지 야경", note:"규카츠 바로 근처 · 야간 조명 분위기 최고", type:"sight", map:"Senso-ji Temple", lat:35.71477, lng:139.79666 },
        { time:"22:00", emoji:"🏨", name:"숙소 복귀", note:"아사쿠사→우에노 약 10분", type:"hotel", map:"APA Hotel Keisei Ueno Ekimae", lat:35.71137, lng:139.77293 },
      ],
      meals:[
        { time:"점심", emoji:"🐟", name:"츠키지 장외시장 먹방", area:"츠키지", note:"해산물·계란말이·꼬치 등 이것저것", tag:"먹방", map:"Tsukiji Outer Market" },
        { time:"저녁", emoji:"🥩", name:"아사쿠사 규카츠", area:"아사쿠사", note:"평점 4.8 · 돌판에 직접 구워먹기", tag:"규카츠", map:"Asakusa Gyukatsu" },
      ]},
    { id:3, date:"6/5 (금)", color:C.d3, theme:"시부야 스카이 → 스카이트리 야경", weather:"☁️", weatherText:"흐림 예상",
      route:[
        { time:"11:00", emoji:"🚦", name:"시부야 스크램블 교차로", note:"스타벅스 2층 창가 추천 · 스카이 입장 전 구경", type:"sight", map:"Shibuya Crossing", lat:35.65948, lng:139.70056 },
        { time:"12:00", emoji:"🌆", name:"시부야 스카이", note:"✅ 예약 완료 · 약 2시간 · 옥상 전망대", type:"sight", map:"Shibuya Sky", lat:35.65867, lng:139.70198 },
        { time:"14:30", emoji:"🍳", name:"모헤지 (몬자야키)", note:"스크램블 스퀘어 12층 · 스카이 보고 바로 · 눈앞 철판구이 · 평점4.8", type:"food", map:"Moheji Shibuya Scramble Square", lat:35.65832, lng:139.70223 },
        { time:"18:00", emoji:"🗼", name:"도쿄 스카이트리 (야경)", note:"✅ 예약 완료 · 634m 전망대 · 오시아게역", type:"sight", map:"Tokyo Skytree", lat:35.71006, lng:139.81070 },
        { time:"20:30", emoji:"🍗", name:"코마키치 야키토리 (저녁)", note:"숯불 야키토리 · 술 없어도 OK · 니혼바시", type:"food", map:"Komakichi Nihonbashi", lat:35.68699, lng:139.78002 },
        { time:"22:00", emoji:"🛒", name:"돈키호테 우에노점", note:"숙소 근처 · 막판 쇼핑 (새벽 4시까지 영업)", type:"sight", map:"Don Quijote Ueno", lat:35.70808, lng:139.77091 },
      ],
      meals:[
        { time:"아침", emoji:"❓", name:"아침 (미정)", area:"미정", note:"장소 정해지면 알려주세요 — 넣어드릴게요", tag:"미정", map:"" },
        { time:"점심", emoji:"🍳", name:"모헤지 (몬자야키·오코노미야키)", area:"시부야", note:"스크램블 스퀘어 12층 · 평점 4.8", tag:"철판구이", map:"Moheji Shibuya Scramble Square" },
        { time:"저녁", emoji:"🍗", name:"코마키치 야키토리", area:"니혼바시", note:"숯불 야키토리 · 금토 영업", tag:"야키토리", map:"Komakichi Nihonbashi" },
      ]},
    { id:4, date:"6/6 (일)", color:C.d4, theme:"우에노 동물원 → 나리타 출발 ✈️", weather:"☁️", weatherText:"흐림 예상",
      route:[
        { time:"09:30", emoji:"🦁", name:"우에노 동물원", note:"숙소 바로 옆 · 판다·다양한 동물 · 약 2시간", type:"sight", map:"Ueno Zoo", lat:35.71657, lng:139.77143 },
        { time:"12:00", emoji:"🏨", name:"체크아웃 (1pm)", note:"동물원 나와서 짐 찾기", type:"hotel", map:"APA Hotel Keisei Ueno Ekimae", lat:35.71137, lng:139.77293 },
        { time:"12:30", emoji:"🍛", name:"마이 카레 쇼쿠도 (수프카레)", note:"우에노 · 수프카레 전문 · 매운맛 단계 선택 · 태블릿 주문", type:"food", map:"My Curry Shokudo Ueno", lat:35.71296, lng:139.77837 },
        { time:"15:30", emoji:"🚂", name:"스카이라이너 → 나리타", note:"케이세이우에노 탑승 · ¥2,570 · 40분", type:"move", map:"Keisei Ueno Station", lat:35.71137, lng:139.77293 },
        { time:"16:30", emoji:"🍜", name:"긴자 카가리 (미슐랭 치킨라멘)", note:"제2터미널 · 진한 닭 육수 소바 · 마지막 식사", type:"food", map:"Ginza Kagari Narita Airport", lat:35.77372, lng:140.38999 },
        { time:"19:00", emoji:"✈️", name:"나리타공항 출발", note:"식사 후 체크인·보안검색 · 탑승 2시간 전 권장", type:"move", map:"Narita Airport Terminal 1", lat:35.7719, lng:140.3928 },
      ],
      meals:[
        { time:"점심", emoji:"🍛", name:"마이 카레 쇼쿠도", area:"우에노", note:"수프카레 전문 · 매운맛 단계 선택 · 숙소 근처", tag:"수프카레", map:"My Curry Shokudo Ueno" },
        { time:"저녁", emoji:"🍜", name:"긴자 카가리 (공항점)", area:"나리타공항", note:"미슐랭 닭 육수 라멘 · 제2터미널 · 마지막 식사", tag:"라멘", map:"Ginza Kagari Narita Airport" },
      ]},
  ],
  tips: [
    { emoji:"🎨", title:"팀랩 플래닛츠", desc:"teamlab.art 에서 지금 예약!\n당일권 거의 없음 · 반바지+맨발 추천", urgent:true },
    { emoji:"🍣", title:"스시다이 혼칸", desc:"11:30 도착 권장\n점심 피크 전이라 웨이팅 짧음", urgent:false },
    { emoji:"💳", title:"Suica 나리타에서 구매", desc:"JR 자동발매기 · ¥10,000~15,000 충전\n트레블월렛 카드로 충전 가능", urgent:false },
    { emoji:"☂️", title:"6/4(목) 비 대비", desc:"접이식 우산 or 가벼운 우비 챙기기\n팀랩은 실내라 OK", urgent:false },
    { emoji:"🥞", title:"플리퍼스 팬케이크", desc:"온라인 예약 추천 · 웨이팅 길 수 있음", urgent:false },
    { emoji:"📱", title:"앱 설치 추천", desc:"Google Maps + Navitime\n오프라인 저장 해두면 편함", urgent:false },
  ],
  transport: {
    suica: ["나리타공항 JR 자동발매기에서 구매","보증금 ¥500 + ¥10,000~15,000 충전","트레블월렛 카드로 충전 가능","도쿄 내 지하철·JR·버스 전부 사용","잔액 부족 시 역 발매기에서 재충전","귀국 시 JR 창구서 보증금 ¥500 환불"],
    costs: [["스카이라이너 왕복","¥5,140"],["Day 1 지하철","¥360"],["Day 2 지하철","¥1,140"],["Day 3 지하철","¥930"],["Day 4 지하철","¥420"]],
    dayCosts: [
      { day:"Day 2", routes:[
        {from:"우에노",to:"오시아게(스카이트리)",via:"메트로 긴자선",yen:"¥180"},
        {from:"오시아게",to:"츠키지",via:"도에이 아사쿠사선",yen:"¥260"},
        {from:"츠키지",to:"도요스(팀랩)",via:"메트로 유라쿠초선",yen:"¥180"},
        {from:"도요스",to:"신주쿠",via:"유라쿠초선+마루노우치선",yen:"¥310"},
        {from:"신주쿠",to:"우에노",via:"JR 야마노테선",yen:"¥210"},
      ]},
      { day:"Day 3", routes:[
        {from:"우에노",to:"하라주쿠",via:"JR 야마노테선",yen:"¥210"},
        {from:"하라주쿠",to:"시부야",via:"도보 15분",yen:"무료"},
        {from:"시부야",to:"긴자",via:"메트로 긴자선",yen:"¥210"},
        {from:"긴자",to:"카미야초(도쿄타워)",via:"메트로 히비야선",yen:"¥170"},
        {from:"카미야초",to:"코덴마초(코마키치)",via:"메트로 히비야선",yen:"¥170"},
        {from:"코덴마초",to:"우에노",via:"메트로 히비야선",yen:"¥170"},
      ]},
      { day:"Day 4", routes:[
        {from:"우에노",to:"신주쿠",via:"JR 야마노테선",yen:"¥210"},
        {from:"신주쿠",to:"우에노",via:"JR 야마노테선",yen:"¥210"},
      ]},
    ],
  },
};

/* ▼▼▼ 여기에 본인 구글맵 API 키를 붙여넣으세요 (AIzaSy... 로 시작) ▼▼▼ */
const GOOGLE_MAPS_KEY = "AIzaSyB_tnD7AC1XdACDf1-6ixG9yjLUm07eIeI";
/* ▲▲▲ 위 따옴표 안에만 키를 넣으면 됩니다 ▲▲▲ */

// 어두운 테마 지도 스타일

const MAP_STYLE = [

  /*
  { elementType:"geometry", stylers:[{ color:"#1d2330" }] },
  { elementType:"labels.text.fill", stylers:[{ color:"#8a93a6" }] },
  { elementType:"labels.text.stroke", stylers:[{ color:"#1d2330" }] },
  { featureType:"poi", stylers:[{ visibility:"off" }] },
  { featureType:"transit", elementType:"labels.icon", stylers:[{ visibility:"off" }] },
  { featureType:"road", elementType:"geometry", stylers:[{ color:"#2b3242" }] },
  { featureType:"road", elementType:"labels", stylers:[{ visibility:"off" }] },
  { featureType:"water", elementType:"geometry", stylers:[{ color:"#0f1622" }] },
  { featureType:"administrative", elementType:"geometry", stylers:[{ visibility:"off" }] },
  */
];

let gmapsPromise = null;
function loadGoogleMaps() {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.google && window.google.maps) return Promise.resolve(window.google.maps);
  if (gmapsPromise) return gmapsPromise;
  gmapsPromise = new Promise((resolve) => {
    const sc = document.createElement("script");
    sc.src = "https://maps.googleapis.com/maps/api/js?key=" + GOOGLE_MAPS_KEY;
    sc.async = true;
    sc.onload = () => resolve(window.google ? window.google.maps : null);
    sc.onerror = () => resolve(null);
    document.body.appendChild(sc);
  });
  return gmapsPromise;
}
function pinSvg(n, color) {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28">'
    + '<circle cx="14" cy="14" r="12" fill="' + color + '" stroke="#fff" stroke-width="2"/>'
    + '<text x="14" y="19" font-size="13" font-weight="700" fill="#fff" text-anchor="middle" font-family="sans-serif">' + n + '</text></svg>';
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}
function homeSvg() {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30">'
    + '<circle cx="15" cy="15" r="13" fill="#111827" stroke="#60A5FA" stroke-width="2"/>'
    + '<text x="15" y="20" font-size="14" text-anchor="middle">🏨</text></svg>';
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

export default function App() {
  const [tab, setTab] = useState("home");
  const [activeDay, setActiveDay] = useState(0);
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [expandedCostDay, setExpandedCostDay] = useState(null);
  const [done, setDone] = useState(() => {
    try { return JSON.parse(localStorage.getItem("tokyo_done") || "{}"); } catch { return {}; }
  });
  useEffect(() => { try { localStorage.setItem("tokyo_done", JSON.stringify(done)); } catch {} }, [done]);
  const toggleDone = (k) => setDone(p => ({ ...p, [k]: !p[k] }));

  const mapRef = useRef(null);
  const mapObjRef = useRef(null);
  const gRef = useRef(null);
  const markersRef = useRef([]);
  const pathRef = useRef(null);
  const animRef = useRef(null);
  const rafRef = useRef(null);
  const dirRef = useRef(null);

  const day = DATA.days[activeDay];

  function clearOverlays() {
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];
    if (pathRef.current) { pathRef.current.setMap(null); pathRef.current = null; }
    if (animRef.current) { animRef.current.forEach(o => o.setMap(null)); animRef.current = null; }
  }

  function drawDay(d) {
    const map = mapObjRef.current, g = gRef.current;
    if (!map || !g) return;
    clearOverlays();
    const bounds = new g.LatLngBounds();
    if (d.id !== 1) {
      const hm = new g.Marker({ position:{ lat:HOTEL.lat, lng:HOTEL.lng }, map,
        icon:{ url:homeSvg(), scaledSize:new g.Size(30,30), anchor:new g.Point(15,15) }, zIndex:5 });
      markersRef.current.push(hm); bounds.extend(hm.getPosition());
    }
    d.route.forEach((r, i) => {
      const mk = new g.Marker({ position:{ lat:r.lat, lng:r.lng }, map,
        icon:{ url:pinSvg(i+1, d.color), scaledSize:new g.Size(28,28), anchor:new g.Point(14,14) } });
      mk.addListener("click", () => setExpandedIdx(i));
      markersRef.current.push(mk); bounds.extend(mk.getPosition());
    });
    pathRef.current = new g.Polyline({ path:d.route.map(r => ({ lat:r.lat, lng:r.lng })),
      strokeColor:d.color, strokeOpacity:0.25, strokeWeight:2, map });
    if (!bounds.isEmpty()) map.fitBounds(bounds, 40);
  }

  // 두 좌표 사이 직선 거리(km) — 도보/대중교통 모드 판단용
  function distKm(a, b) {
    const R = 6371, toRad = (x) => x * Math.PI / 180;
    const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
    const s = Math.sin(dLat/2)**2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1-s));
  }

  // path(좌표 배열)를 따라 점이 이동하는 애니메이션
  function runPathAnimation(g, map, pathPts, color) {
    const line = new g.Polyline({ path:[pathPts[0], pathPts[0]], strokeColor:color, strokeOpacity:0.9, strokeWeight:5, map });
    const dot = new g.Marker({ position:pathPts[0], map,
      icon:{ path:g.SymbolPath.CIRCLE, scale:7, fillColor:color, fillOpacity:1, strokeColor:"#fff", strokeWeight:2 }, zIndex:10 });
    animRef.current = [line, dot];
    const bounds = new g.LatLngBounds(); pathPts.forEach(p => bounds.extend(p));
    map.fitBounds(bounds, 60);
    // 누적 거리 기반으로 일정한 속도로 이동
    const segLen = [];
    let total = 0;
    for (let i = 1; i < pathPts.length; i++) { const dl = distKm(pathPts[i-1], pathPts[i]); segLen.push(dl); total += dl; }
    const dur = 1900, t0 = performance.now();
    const stepFn = (now) => {
      const t = Math.min((now - t0) / dur, 1);
      const e = t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2, 2)/2;
      let target = e * total, acc = 0, idx = 0, frac = 0;
      for (let i = 0; i < segLen.length; i++) {
        if (acc + segLen[i] >= target) { idx = i; frac = segLen[i] ? (target - acc) / segLen[i] : 0; break; }
        acc += segLen[i]; idx = i + 1;
      }
      const p0 = pathPts[Math.min(idx, pathPts.length-1)], p1 = pathPts[Math.min(idx+1, pathPts.length-1)];
      const lat = p0.lat + (p1.lat - p0.lat) * frac, lng = p0.lng + (p1.lng - p0.lng) * frac;
      const drawn = pathPts.slice(0, idx+1).concat([{ lat, lng }]);
      line.setPath(drawn); dot.setPosition({ lat, lng });
      if (t < 1) rafRef.current = requestAnimationFrame(stepFn);
    };
    rafRef.current = requestAnimationFrame(stepFn);
  }

  function animateTo(d, idx) {
    const map = mapObjRef.current, g = gRef.current;
    if (!map || !g) return;
    const to = d.route[idx];
    let from;
    if (idx > 0) from = d.route[idx-1];
    else from = (d.id === 1) ? null : HOTEL;
    if (animRef.current) { animRef.current.forEach(o => o.setMap(null)); animRef.current = null; }
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (!from) { map.panTo({ lat:to.lat, lng:to.lng }); map.setZoom(14); return; }
    const a = { lat:from.lat, lng:from.lng }, b = { lat:to.lat, lng:to.lng };

    // 거리로 이동수단 결정: 1.5km 이하는 도보, 그 이상은 대중교통
    const km = distKm(a, b);
    const mode = km <= 1.5 ? g.TravelMode.WALKING : g.TravelMode.TRANSIT;

    // 직선 폴백 (경로 못 받을 때)
    const fallback = () => runPathAnimation(g, map, [a, b], d.color);

    if (!dirRef.current) dirRef.current = new g.DirectionsService();
    const req = { origin: a, destination: b, travelMode: mode };
    if (mode === g.TravelMode.TRANSIT) req.transitOptions = { departureTime: new Date() };

    dirRef.current.route(req, (res, status) => {
      if (status === "OK" && res.routes && res.routes[0]) {
        // 경로의 전체 좌표(overview_path)를 따라 애니메이션
        const pts = res.routes[0].overview_path.map(p => ({ lat: p.lat(), lng: p.lng() }));
        if (pts.length >= 2) runPathAnimation(g, map, pts, d.color);
        else fallback();
      } else {
        // 대중교통 경로가 없으면 도보로 한 번 더 시도, 그래도 없으면 직선
        if (mode === g.TravelMode.TRANSIT) {
          dirRef.current.route({ origin:a, destination:b, travelMode:g.TravelMode.WALKING }, (res2, st2) => {
            if (st2 === "OK" && res2.routes && res2.routes[0]) {
              const pts2 = res2.routes[0].overview_path.map(p => ({ lat:p.lat(), lng:p.lng() }));
              runPathAnimation(g, map, pts2, d.color);
            } else fallback();
          });
        } else fallback();
      }
    });
  }

  // init / destroy map when entering/leaving 일정 tab
  useEffect(() => {
    if (tab !== "home") return;
    let cancelled = false;
    loadGoogleMaps().then(g => {
      if (cancelled || !g || !mapRef.current || mapObjRef.current) return;
      gRef.current = g;
      const map = new g.Map(mapRef.current, {
        center:{ lat:35.69, lng:139.76 }, zoom:11, disableDefaultUI:true, zoomControl:true,
        gestureHandling:"greedy", styles:MAP_STYLE, backgroundColor:"#1d2330",
      });
      mapObjRef.current = map;
      setTimeout(() => drawDay(DATA.days[activeDay]), 100);
    });
    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearOverlays();
      mapObjRef.current = null;
    };
    // eslint-disable-next-line
  }, [tab]);

  // redraw markers when day changes
  useEffect(() => {
    if (tab !== "home" || !mapObjRef.current) return;
    drawDay(DATA.days[activeDay]);
    // eslint-disable-next-line
  }, [activeDay]);

  // animate when a route point is selected
  useEffect(() => {
    if (tab !== "home" || !mapObjRef.current || expandedIdx == null || expandedIdx < 0) return;
    animateTo(DATA.days[activeDay], expandedIdx);
    // eslint-disable-next-line
  }, [expandedIdx, activeDay]);

  const st = {
    page: {
      background: "#0D1117",
      minHeight: "100vh",
      width: "100%",
      overflowX: "hidden",
    },
    app: {
      background: "#0D1117",
      minHeight: "100vh",
      fontFamily: "'Noto Sans KR', -apple-system, sans-serif",
      color: "#F9FAFB",
      width: "100%",
      maxWidth: "100%",
      margin: 0,
      position: "relative",
      paddingBottom: 72,
      overflowX: "hidden"
    },
    topBar: { background:"#111827", padding:"12px 16px 10px", borderBottom:"1px solid #1F2937", position:"sticky", top:0, zIndex:30, display:"flex", justifyContent:"space-between", alignItems:"center" },
    content: { padding:"12px 16px 24px" },
    sectionTitle: { fontSize:12, fontWeight:700, color:"#6B7280", marginBottom:10, textTransform:"uppercase", letterSpacing:"0.06em" },
    tag: (color) => ({ display:"inline-block", background:color+"22", color:color, fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:10, marginLeft:6 }),
    mealCard: { background:"#111827", borderRadius:10, padding:"12px", marginBottom:8 },
    urgentBadge: { background:"#EF4444", color:"#fff", fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:10, marginLeft:6 },
    // 하단 바가 중앙 배치된 app 너비(최대 500px)를 벗어나지 않도록 maxWidth 연동
    bottomNav: { position:"fixed", bottom:0, left:0, right:0, width:"100%", maxWidth:"100%", background:"#111827", borderTop:"1px solid #1F2937", display:"flex", zIndex:40 },
    mapBtn: { display:"inline-flex", alignItems:"center", gap:4, background:"#0D1117", color:"#60A5FA", fontSize:11, fontWeight:700, padding:"5px 10px", borderRadius:8, textDecoration:"none", border:"1px solid #1E3A5F", cursor:"pointer" },
  };

  function ddayText() {
    const start = new Date("2026-06-03T00:00:00+09:00");
    const diff = Math.ceil((start - new Date()) / (1000*60*60*24));
    if (diff > 0) return "출발까지 D-" + diff;
    if (diff === 0) return "오늘 출발! ✈️";
    if (diff >= -3) return "여행 " + (-diff+1) + "일차 🗾";
    return "여행 완료 ✨";
  }

  const Photo = ({ place }) => {
    const [ok, setOk] = useState(true);
    if (!place) return null;
    const src = PHOTOS[place];
    return (
      <div style={{ marginTop:8 }} onClick={(e) => e.stopPropagation()}>
        {src && ok && (
          <img src={src} alt={place} onError={() => setOk(false)}
            style={{ width:"100%", height:130, objectFit:"cover", borderRadius:8, display:"block", background:"#0D1117" }} />
        )}
        <div style={{ display:"flex", gap:6, marginTop:8, flexWrap:"wrap" }}>
          <a style={st.mapBtn} href={mapUrl(place)} target="_blank" rel="noreferrer">🗺 길찾기</a>
          <a style={{ ...st.mapBtn, color:"#FBBF24", borderColor:"#5A4A1E" }} href={imgSearchUrl(place)} target="_blank" rel="noreferrer">📷 사진 더보기</a>
        </div>
      </div>
    );
  };

  const Meal = ({ m, accent, dayId }) => {
    const key = `m-${dayId}-${m.name}`;
    const isDone = !!done[key];
    return (
      <div style={{ ...st.mealCard, borderLeft:`3px solid ${accent}`, opacity: isDone ? 0.55 : 1 }}>
        <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
          <span style={{ fontSize:28, lineHeight:1 }}>{m.emoji}</span>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", marginBottom:2 }}>
              <span style={{ fontSize:10, color:"#9CA3AF", fontWeight:700 }}>{m.time}</span>
              <span style={st.tag(accent)}>{m.tag}</span>
            </div>
            <p style={{ margin:0, fontSize:14, fontWeight:700, textDecoration: isDone ? "line-through" : "none" }}>{m.name}</p>
            <p style={{ margin:"2px 0 0", fontSize:12, color:"#9CA3AF" }}>📍 {m.area}</p>
            <p style={{ margin:"3px 0 0", fontSize:12, color:"#6B7280", lineHeight:1.4 }}>{m.note}</p>
          </div>
          <button onClick={() => toggleDone(key)} aria-label="방문 완료"
            style={{ width:26, height:26, borderRadius:"50%", flexShrink:0, cursor:"pointer",
              border: isDone ? "none" : "2px solid #4B5563", background: isDone ? "#34D399" : "transparent",
              color:"#0D1117", fontWeight:700, fontSize:13, lineHeight:1 }}>{isDone ? "✓" : ""}</button>
        </div>
        <Photo place={m.map} />
      </div>
    );
  };

  return (
    <div style={st.page}>
      <style>{`
        html, body, #root { margin: 0; padding: 0; background: #0D1117; }
        * { box-sizing: border-box; }
        body { overflow-x: hidden; }
      `}</style>
      <div style={st.app}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;600;700&display=swap" rel="stylesheet"/>

      <div style={st.topBar}>
        <div>
          <p style={{ margin:0, fontSize:16, fontWeight:700 }}>🗾 도쿄 여행 일정</p>
          <p style={{ margin:"2px 0 0", fontSize:11, color:"#9CA3AF" }}>2026.06.03 ~ 06.06 · 3박 4일</p>
        </div>
        <div style={{ background:"#1F2937", borderRadius:20, padding:"5px 12px", fontSize:12, fontWeight:700, color:"#60A5FA" }}>{ddayText()}</div>
      </div>

      {tab === "home" && (
        <>
          <div style={{ display:"flex", gap:6, overflowX:"auto", padding:"10px 16px 0", background:"#111827" }}>
            {DATA.days.map((d, i) => (
              <button key={d.id} onClick={() => { setActiveDay(i); setExpandedIdx(null); }}
                style={{ flex:"0 0 auto", padding:"6px 14px", borderRadius:20, fontSize:12, fontWeight:700, border:"none", cursor:"pointer",
                  background: activeDay===i ? d.color : "#1F2937", color: activeDay===i ? "#fff" : "#9CA3AF" }}>
                Day {d.id} · {d.date.split(" ")[0]}
              </button>
            ))}
          </div>

          <div style={st.content}>
            <div style={{ background: day.color, borderRadius:12, padding:"14px 16px", marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <p style={{ margin:0, fontSize:11, color:"rgba(255,255,255,0.75)", fontWeight:700 }}>DAY {day.id} · {day.date}</p>
                  <p style={{ margin:"4px 0 0", fontSize:15, fontWeight:700, color:"#fff" }}>{day.theme}</p>
                </div>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:26, lineHeight:1 }}>{day.weather}</div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.85)", marginTop:3 }}>{day.weatherText}</div>
                </div>
              </div>
            </div>

            {/* MAP */}
            <div ref={mapRef} style={{ width:"100%", height:210, borderRadius:12, overflow:"hidden", marginBottom:6, background:"#1F2937", position:"relative", zIndex:1 }} />
            <p style={{ fontSize:11, color:"#6B7280", margin:"0 0 14px" }}>🗺 아래 루트나 지도 위 번호를 누르면, 이전 지점 → 선택 지점 경로가 표시돼요{day.id!==1 ? " (첫 지점은 숙소🏨에서 출발)" : ""}</p>

            <p style={st.sectionTitle}>📍 이동 루트</p>
            <div style={{ background:"#1F2937", borderRadius:12, overflow:"hidden", marginBottom:6 }}>
              <div style={{ padding:"14px 14px 6px" }}>
                {day.route.map((r, i) => {
                  const key = `r-${day.id}-${r.name}`;
                  const isDone = !!done[key];
                  const exp = expandedIdx === i;
                  return (
                    <div key={i}>
                      <div style={{ display:"flex", gap:12, marginBottom: exp ? 4 : 14, alignItems:"flex-start" }}>
                        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", width:34 }}>
                          <div onClick={() => setExpandedIdx(exp ? null : i)}
                            style={{ width:34, height:34, borderRadius:"50%", background: typeColor[r.type]+"22", border:`2px solid ${typeColor[r.type]}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0, cursor:"pointer", opacity: isDone ? 0.5 : 1 }}>
                            {isDone ? "✓" : r.emoji}
                          </div>
                          {i < day.route.length - 1 && <div style={{ width:2, height:18, background: typeColor[r.type]+"55", margin:"2px 0" }}/>}
                        </div>
                        <div style={{ flex:1, paddingTop:4 }}>
                          <div onClick={() => setExpandedIdx(exp ? null : i)} style={{ cursor:"pointer" }}>
                            <div style={{ display:"flex", alignItems:"center" }}>
                              <span style={{ fontSize:10, color:"#9CA3AF", fontWeight:700 }}>{r.time}</span>
                              <span style={st.tag(typeColor[r.type])}>{typeLabel[r.type]}</span>
                            </div>
                            <p style={{ margin:"3px 0 0", fontSize:14, fontWeight:700, color: isDone ? "#6B7280" : "#F9FAFB", textDecoration: isDone ? "line-through" : "none" }}>{r.name}</p>
                          </div>
                          {exp && (
                            <div style={{ marginBottom:10 }}>
                              <p style={{ margin:"4px 0 0", fontSize:12, color:"#9CA3AF", lineHeight:1.5 }}>{r.note}</p>
                              <Photo place={r.map} />
                            </div>
                          )}
                        </div>
                        <button onClick={() => toggleDone(key)} aria-label="방문 완료"
                          style={{ width:24, height:24, borderRadius:"50%", flexShrink:0, cursor:"pointer", marginTop:4,
                            border: isDone ? "none" : "2px solid #4B5563", background: isDone ? "#34D399" : "transparent",
                            color:"#0D1117", fontWeight:700, fontSize:12, lineHeight:1 }}>{isDone ? "✓" : ""}</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <p style={{ ...st.sectionTitle, marginTop:16 }}>🍽 오늘의 식사</p>
            {day.meals.map((m, i) => <Meal key={i} m={m} accent={day.color} dayId={day.id} />)}
          </div>
        </>
      )}

      {tab === "food" && (
        <div style={st.content}>
          <p style={{ margin:"0 0 14px", fontSize:16, fontWeight:700 }}>🍽 전체 맛집 ({DATA.days.reduce((s,d)=>s+d.meals.length,0)}곳)</p>
          {DATA.days.map(d => (
            <div key={d.id}>
              <div style={{ display:"flex", alignItems:"center", gap:8, margin:"8px 0" }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:d.color }}/>
                <span style={{ fontSize:13, fontWeight:700, color:"#9CA3AF" }}>DAY {d.id} · {d.date}</span>
              </div>
              {d.meals.map((m, i) => <Meal key={i} m={m} accent={d.color} dayId={d.id} />)}
            </div>
          ))}
          <p style={{ ...st.sectionTitle, marginTop:12 }}>💡 체크리스트</p>
          {DATA.tips.map((t, i) => (
            <div key={i} style={{ background:"#1F2937", borderRadius:10, padding:"12px 14px", marginBottom:8, display:"flex", gap:12 }}>
              <span style={{ fontSize:24 }}>{t.emoji}</span>
              <div>
                <div style={{ display:"flex", alignItems:"center" }}>
                  <span style={{ fontSize:13, fontWeight:700 }}>{t.title}</span>
                  {t.urgent && <span style={st.urgentBadge}>필수</span>}
                </div>
                <p style={{ margin:"3px 0 0", fontSize:12, color:"#9CA3AF", lineHeight:1.5, whiteSpace:"pre-line" }}>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "transport" && (
        <div style={st.content}>
          <div style={{ background:"#1D4ED822", border:"1px solid #1D4ED8", borderRadius:12, padding:"14px", marginBottom:14 }}>
            <p style={{ margin:"0 0 10px", fontSize:14, fontWeight:700, color:"#60A5FA" }}>💳 Suica 카드</p>
            {DATA.transport.suica.map((t, i) => (
              <div key={i} style={{ display:"flex", gap:10, marginBottom:8, alignItems:"flex-start" }}>
                <div style={{ width:22, height:22, borderRadius:"50%", background:"#1D4ED8", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"#fff", flexShrink:0 }}>{i+1}</div>
                <span style={{ fontSize:13, color:"#D1D5DB", lineHeight:1.5, paddingTop:2 }}>{t}</span>
              </div>
            ))}
          </div>
          <div style={{ background:"#B91C1C22", border:"1px solid #B91C1C", borderRadius:12, padding:"14px", marginBottom:14 }}>
            <p style={{ margin:"0 0 8px", fontSize:14, fontWeight:700, color:"#FCA5A5" }}>✈️ 케이세이 스카이라이너</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
              <div style={{ background:"#1F2937", borderRadius:8, padding:"8px 10px" }}>
                <p style={{ margin:0, fontSize:10, color:"#9CA3AF" }}>소요시간</p>
                <p style={{ margin:"2px 0 0", fontSize:16, fontWeight:700, color:"#FCA5A5" }}>40분</p>
              </div>
              <div style={{ background:"#1F2937", borderRadius:8, padding:"8px 10px" }}>
                <p style={{ margin:0, fontSize:10, color:"#9CA3AF" }}>요금 (편도/인)</p>
                <p style={{ margin:"2px 0 0", fontSize:16, fontWeight:700, color:"#FCA5A5" }}>¥2,570</p>
              </div>
            </div>
            <p style={{ margin:0, fontSize:12, color:"#9CA3AF", lineHeight:1.6 }}>Suica 사용 불가 → 케이세이 카운터 별도 구매<br/>트레블월렛 카드 현장 결제 가능</p>
          </div>
          <div style={{ background:"#1F2937", borderRadius:12, padding:"14px", marginBottom:14 }}>
            <p style={{ margin:"0 0 12px", fontSize:14, fontWeight:700, color:"#34D399" }}>💰 교통비 요약 (1인)</p>
            {DATA.transport.costs.map((c, i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #374151" }}>
                <span style={{ fontSize:13, color:"#D1D5DB" }}>{c[0]}</span>
                <span style={{ fontSize:13, fontWeight:700 }}>{c[1]}</span>
              </div>
            ))}
            <div style={{ display:"flex", justifyContent:"space-between", padding:"12px 0 4px", borderTop:"1px solid #34D399", marginTop:4 }}>
              <span style={{ fontSize:14, fontWeight:700, color:"#34D399" }}>총합계 (1인)</span>
              <span style={{ fontSize:16, fontWeight:700, color:"#34D399" }}>≈ ¥7,990</span>
            </div>
            <p style={{ margin:"4px 0 0", fontSize:11, color:"#6B7280" }}>* 약 72,000원 기준</p>
          </div>
          <p style={st.sectionTitle}>일별 상세 경로</p>
          {DATA.transport.dayCosts.map((dc, di) => (
            <div key={di} style={{ background:"#1F2937", borderRadius:12, marginBottom:8, overflow:"hidden" }}>
              <button onClick={() => setExpandedCostDay(expandedCostDay===di ? null : di)}
                style={{ width:"100%", background:"#374151", padding:"10px 14px", border:"none", cursor:"pointer", display:"flex", justifyContent:"space-between", color:"#F9FAFB", fontWeight:700, fontSize:13, fontFamily:"inherit" }}>
                <span>📅 {dc.day}</span><span>{expandedCostDay===di ? "▲" : "▼"}</span>
              </button>
              {expandedCostDay === di && (
                <div style={{ padding:"10px 14px" }}>
                  {dc.routes.map((r, ri) => (
                    <div key={ri} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:"1px solid #374151", alignItems:"flex-start" }}>
                      <div>
                        <span style={{ fontSize:12 }}>{r.from} → {r.to}</span>
                        <p style={{ margin:"2px 0 0", fontSize:10, color:"#9CA3AF" }}>{r.via}</p>
                      </div>
                      <span style={{ fontSize:12, fontWeight:700, color: r.yen==="무료" ? "#34D399" : "#F9FAFB", flexShrink:0, marginLeft:8 }}>{r.yen}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <nav style={st.bottomNav}>
        {[{ id:"home", icon:"🗺", label:"일정" },{ id:"food", icon:"🍽", label:"맛집" },{ id:"transport", icon:"🚇", label:"교통" }].map(n => (
          <button key={n.id} onClick={() => setTab(n.id)}
            style={{ flex:1, padding:"10px 4px 14px", background:"transparent", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, fontFamily:"inherit" }}>
            <span style={{ fontSize:20 }}>{n.icon}</span>
            <span style={{ fontSize:10, fontWeight:700, color: tab===n.id ? "#60A5FA" : "#4B5563" }}>{n.label}</span>
          </button>
        ))}
      </nav>
    </div>
    </div>
  );
}