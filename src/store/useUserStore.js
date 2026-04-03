import { create } from "zustand";
import { fetchMe } from "../api/auth";

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
  fetchUser: async (force = false) => {
    const { isLoading, user } = get();

    if (!force) {
    if (isLoading || user) return;
  }

    const token = localStorage.getItem("accessToken");
    if (!token) return;

    set({ isLoading: true });
    try {
      const data = await fetchMe();
      console.log("서버에서 준 전체 데이터:", data);
      
      set({
      user: {
        ...data,
        rewardPoint: data.rewardPoint, 
        xp: data.xp,
        level: data.level
      },
      accessToken: token,
      isLoading: false,
    });
    } catch (error) {
      console.error("fetchUser 에러 발생:", error);
      set({ isLoading: false });
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
 * 현재 XP 숫자 그대로 반환
 */
getCurrentXp: () => {
  const { user } = get();
  return Number(user?.xp) || 0;
},

/**
 * 게이지 바 전용 퍼센트 (0~100)
 */
getXpPercentage: () => {
  const { user } = get();
  if (!user) return 0;
  const currentXp = Number(user.xp) || 0;
  // 레벨업 기준이 100이라면 그대로 리턴
  return Math.min(currentXp, 100); 
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
