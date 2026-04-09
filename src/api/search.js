import api from './axios';

//랭킹
export const fetchHotKeywords = async () => {
  try {
    const response = await api.get('/ranking/search/daily');
    
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error("랭킹 로드 실패:", error);
    throw error;
  }
};

// 랜덤 휴게소 목록 (초기 로드용)
export const fetchRandomRestAreas = async (page = 0, size = 10) => {
  const response = await api.get('/restareas/random', {
    params: { page, size }
  });
  return response.data;
};