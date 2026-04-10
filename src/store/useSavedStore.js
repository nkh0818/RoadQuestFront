import { create } from "zustand";
import { fetchMyFavoritesApi, toggleFavoriteApi } from "../api/favorite";

export const useSavedStore = create((set, get) => ({
  savedRestAreas: [],
  isLoading: false,

  // 서버에서 내 찜 목록 동기화 (페이지 진입 시 호출)
  fetchFavorites: async () => {
    try {
      const data = await fetchMyFavoritesApi();
      set({ savedRestAreas: data || [] });
      console.log("📡 API 응답 원본:", data);
    } catch (error) {
      console.error("찜 목록 로드 실패", error);
    } finally {
      set({ isLoading: false });
    }
  },

  // 찜 토글 (서버 통신)
  toggleSave: async (restArea) => {
    try {
      // API 호출 (stdRestCd만 전달)
      const isFavorited = await toggleFavoriteApi(restArea.stdRestCd);

      const { savedRestAreas } = get();
      if (!isFavorited) {
        set({
          savedRestAreas: savedRestAreas.filter(
            (item) => item.stdRestCd !== restArea.stdRestCd,
          ),
        });
      } else {
        set({ savedRestAreas: [...savedRestAreas, restArea] });
      }
    } catch (error) {
      console.error("토글 실패", error);
    }
  },

  isSaved: (stdRestCd) => {
    const { savedRestAreas } = get();
    return savedRestAreas.some((item) => item.stdRestCd === stdRestCd);
  },
}));
