import { create } from "zustand";
import api from "../api/axios";

export const useHistoryStore = create((set) => ({
  // 1. 초기 상태 정의
  historyLogs: [],
  userStats: {
    nickname: "",
    level: 1,
    xp: 0,
    rewardPoint: 0,
    reviewCount: 0,
    currentTitle: "칭호 없음",
    profileImage: null,
  },
  isLoading: false,

  // 2. 히스토리 목록 가져오기
  fetchHistory: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/user/history");
      set({ historyLogs: response.data });
    } catch (error) {
      console.error("히스토리 로드 실패:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  // 3. 유저 통계 정보 가져오기
  fetchUserStats: async () => {
    try {
      const response = await api.get("/user/my");
      set({ userStats: response.data });
      console.log("유저 데이터:", response.data);
    } catch (error) {
      console.error("유저 통계 로드 실패:", error);
    }
  },
}));