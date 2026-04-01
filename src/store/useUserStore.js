import { create } from "zustand";
import { fetchMe } from "../api/auth";

const MOCK_FIELDS = {
  xp: 75,
  points: 1250,
  currentTitle: {
    id: 101,
    titleName: "프로 여행러",
  },
  reviewLikes: [1, 2, 3, 4, 5], // 찜한 리뷰 ID 리스트
  userTitles: [1, 2, 3], // 보유한 타이틀 ID 리스트
  reviews: [1, 2], // 작성한 리뷰 리스트
};

export const useUserStore = create((set, get) => ({
  user: null,
  accessToken: null,
  isLoading: false,

  /**
   * 로그인/회원가입 성공 시 호출
   * 백엔드 데이터(authData)와 목업 데이터를 합성하여 저장
   */
  setUserData: (authData) => {
    set({
      user: {
        ...MOCK_FIELDS,
        nickname: authData.nickname,
        email: authData.email,
        level: authData.level,
        accessToken: authData.accessToken,
      },
      isLoading: false,
    });

    // API 요청 시 사용할 토큰/닉네임을 로컬 스토리지에 저장
    if (authData.accessToken) {
      localStorage.setItem("accessToken", authData.accessToken);
    }
    if (authData.nickname) {
      localStorage.setItem("nickname", authData.nickname);
    }
  },

  /**
   * 부분 업데이트 (닉네임 변경)
   */
  updateNicknameInStore: (newNickname) => {
    set((state) => ({
      user: state.user ? { ...state.user, nickname: newNickname } : null,
    }));
    // 로컬 스토리지도 갱신
    localStorage.setItem("nickname", newNickname);
  },

  /**
   * 새로고침 호출
   */
  fetchUser: async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      set({ user: null, isLoading: false });
      return;
    }

    set({ isLoading: true });
    try {
      const data = await fetchMe();

      // 서버 데이터와 목업 데이터를 다시 합성
      set({
        user: { ...MOCK_FIELDS, ...data },
        isLoading: false,
      });
    } catch (error) {
      console.error("🚨 fetchUser 에러 발생:", error);
      get().logout();
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
   * XP 퍼센트 계산
   */
  getXpPercentage: () => {
    const { user } = get();
    if (!user) return 0;
    const currentXp = user.xp || 0;
    return Math.min(Math.max(currentXp % 100, 0), 100);
  },

  /**
   * 좋아요 토글
   */
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
