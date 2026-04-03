import api from "./axios";

// home - 베스트 푸드 가져오기
export const fetchBestFoodsApi = async () => {
  const response = await api.get("/main/best-food");
  return response.data;
};