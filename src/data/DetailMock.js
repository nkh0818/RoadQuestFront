// data/DetailMock.js (예시)
export const MOCK_REST_AREA = {
  // 1. 휴게소 & 주유소 기본 정보 (API)
  info: {
    stdRestCd: "A000123",
    name: "김제휴게소",
    routeName: "호남선 • 부산방향", // 한국 패치
    location: "전라북도 김제시 백구면 번영로",
    latitude: 35.892, 
    longitude: 127.012,
    gasoline_price: "1,645",
    disel_price: "1,520",
    lpg_price: "1,050",
    oilCompany: "알뜰주유소",
    telNo: "063-544-XXXX",
  },
  design: {
    aiTags: [
      "#깔끔한화장실", "#주차간격넓음", "#음식맛있음", 
      "#전기차충전", "#수면실있음", "#반려동물환영"
    ]
  },
  // 2. 이벤트 정보 (Event API)
  events: [
    {
      no: 1,
      title: "봄맞이 특선 메뉴 출시! 제철 나물 비빔밥 한정 판매",
      period: "03.01 ~ 04.30",
      content: "봄철을 맞아 지역 농가에서 직접 수확한 제철 나물을 활용한 비빔밥을 한정 수량으로 판매합니다. 선착순 소진 시 조기 마감될 수 있으니 서두르세요!",
    },
    {
      no: 2,
      title: "고속도로 여행객 전용 주유 할인 이벤트",
      period: "03.15 ~ 04.15",
      content: "현대오일뱅크 제휴 카드로 주유 시 리터당 50원 추가 할인 혜택을 드립니다. 단, 1회 30리터 이상 주유 시 적용됩니다.",
    },
    {
      no: 3,
      title: "전기차 무료 충전 프로모션 (선착순 100명)",
      period: "03.01 ~ 03.31",
      content: "3월 한 달간 EV 충전소 이용 고객 중 선착순 100명에게 충전 요금을 전액 지원합니다. 앱에서 쿠폰을 발급받은 후 충전 전 제시해 주세요.",
    },
  ],

  // 3. 메뉴 정보 (Food API)
  food: [
    { 
    id: 1,
    foodName: "명품 김제 육회비빔밥 이름이 이렇게 길어지면 어떻게 처리할 건데 니가 뭘 할 수 있는데", 
    price: 12000, 
    category: "한식", 
    isBest: "Y", 
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c" 
  },
  { 
    id: 2,
    foodName: "한 번 먹으면 고속도로 유턴하게 되는 못잊어 돈가츠", 
    price: 9500, 
    category: "양식", 
    isBest: "Y", 
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591" 
  },
  { 
    id: 3,
    foodName: "강원도 산간지방에서 직접 공수한 황태 해장국", 
    price: 10000, 
    category: "한식", 
    isBest: "N", 
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd" 
  },
  { 
    id: 4,
    foodName: "졸음운전 싹 달아나는 매콤 얼큰 해물 라면", 
    price: 6500, 
    category: "분식", 
    isBest: "Y", 
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624" 
  },
  { 
    id: 5,
    foodName: "아이들이 환장하는 치즈 쭉쭉 핫바", 
    price: 4500, 
    category: "간식", 
    isBest: "N", 
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0" 
  },
  { 
    id: 6,
    foodName: "이거 안 먹으면 휴게소 왔다고 할 수 없는 통감자 구이", 
    price: 5000, 
    category: "간식", 
    isBest: "Y", 
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" 
  },
  { 
    id: 7,
    foodName: "안동 종갓집 레시피 그대로 담은 안동 간고등어 정식", 
    price: 13000, 
    category: "한식", 
    isBest: "N", 
    image: "https://images.unsplash.com/photo-1589187151032-573a91317445" 
  },
  { 
    id: 8,
    foodName: "겉바속촉 끝판왕 겉은 바삭 속은 촉촉 떡볶이와 튀김 세트", 
    price: 8500, 
    category: "분식", 
    isBest: "N", 
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061" 
  },
  { 
    id: 9,
    foodName: "운전자 필수 코스! 잠 깨는 아이스 아메리카노 (20oz)", 
    price: 4500, 
    category: "카페", 
    isBest: "N", 
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c" 
  },
  { 
    id: 10,
    foodName: "휴게소의 꽃! 정통 수제 츄러스", 
    price: 3500, 
    category: "간식", 
    isBest: "N", 
    image: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85" 
  }
  ]
};