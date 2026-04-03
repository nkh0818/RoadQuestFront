import api from "./axios";

// 휴게소 상세 정보 조회 (@GetMapping("/restareas/detail/{id}"))
export const fetchRestAreaDetail = async (id) => {
  const response = await api.get(`/restareas/detail/${id}`);
  return response.data;
};

// 경로 기반 휴게소 검색 
export const searchRestAreas = async (start, end) => {
  const response = await api.get('/restareas/search', {
    params: { start, end }
  });

  return response.data.map((item, index) => ({
    id: item['휴게소코드'] || index,
    name: item['휴게소명'],
    distance: "경로상",
    gasoline: item.gasolinePrice > 0 ? `${item.gasolinePrice.toLocaleString()}원` : "정보없음",
    diesel: item.dieselPrice > 0 ? `${item.dieselPrice.toLocaleString()}원` : "정보없음",
    brand: item['휴게소종류'] || "휴게소",
    tag: "추천"
  }));
};