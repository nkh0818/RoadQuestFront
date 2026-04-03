import { create } from "zustand";
import { fetchMe } from "../api/auth";

// 0403 나다희 수정

export const useUserStore = create((set, get) => ({
  //상태 초기화
  user: null,
  accessToken: localStorage.getItem("accessToken") || null,
  isLoading: false,

  setUserData: (authData) => {
    const { accessToken, ...userData } = authData;

    set({
      user: userData, // DTO에서 온 유저 정보
      accessToken: accessToken,
      isLoading: false,
    });

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }
  },

  /** 부분 업데이트 (닉네임 변경) */
  updateNicknameInStore: (authData) => {
    const { nickname, accessToken } = authData;

    set((state) => ({
      user: state.user
        ? { ...state.user, nickname: nickname, accessToken: accessToken }
        : null,
    }));

    localStorage.setItem("nickname", nickname);
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }
  },

  /**
   * 새로고침 호출
   */
  fetchUser: async () => {
    const { isLoading, user } = get();
    if (isLoading || user) return;

    const token = localStorage.getItem("accessToken");
    if (!token) return;

    set({ isLoading: true });
    try {
      const data = await fetchMe();
      set({
        user: data,
        accessToken: token,
        isLoading: false,
      });
    } catch (error) {
      console.error("🚨 fetchUser 에러 발생:", error);
      get().logout();
    }
  },

  /**
   * 로그아웃
   */
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("nickname");
    set({ user: null, accessToken: null, isAuthenticated: false });
  },

  /**
   * XP 퍼센트 계산
   */
  getXpPercentage: () => {
    const { user } = get();
    // user가 없거나 xp가 없으면 0 반환
    if (!user || typeof user.xp === "undefined") return 0;

    const currentXp = Number(user.xp) || 0; // 혹시 문자열로 들어올 경우를 대비해 숫자로 변환
    return Math.min(Math.max(currentXp % 100, 0), 100);
  },

  /** 좋아요 토글 : ID리스트 */
  toggleReviewLike: (reviewId) => {
    const { user } = get();
    if (!user) return;

    const isExist = user.reviewLikes?.includes(reviewId);
    const newLikes = isExist
      ? user.reviewLikes.filter((id) => id !== reviewId)
      : [...(user.reviewLikes || []), reviewId];

    set({ user: { ...user, reviewLikes: newLikes } });
  },
}));
