import api from "./axios";

// 내 찜 목록 가져오기
export const fetchMyFavoritesApi = async () => {
  const response = await api.get("/favorites/me");
  return response.data;
};

// 찜 토글
export const toggleFavoriteApi = async (stdRestCd) => {
  const response = await api.post(`/favorites/${stdRestCd}`);
  return response.data; // true(추가됨) false(삭제됨) 반환
};