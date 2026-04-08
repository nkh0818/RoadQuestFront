import { create } from "zustand";
import { fetchMe, updateNickname } from "../api/auth";

export const useUserStore = create((set, get) => ({
  // 상태 초기화
  user: null,
  accessToken: localStorage.getItem("accessToken") || null,
  isLoading: false,

  setUserData: (authData) => {
    const { accessToken, ...userData } = authData;

    set({
      user: userData,
      accessToken: accessToken,
      isLoading: false,
    });

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }
  },

  /** * 닉네임 및 프로필 이미지 변경 API 호출 
   * @param {string} newNickname - 변경할 닉네임
   * @param {string} profileImage - S3 업로드 후 받은 이미지 URL
   */
  changeNickname: async (newNickname, profileImage) => {
    try {
      //  API 호출 시 이미지 URL도 함께 전달하도록 수정
      const updatedUserData = await updateNickname(newNickname, profileImage); 
      
      // 서버에서 받아온 최신 데이터(새 닉네임, 새 이미지 등)로 스토어 동기화
      get().updateNicknameInStore(updatedUserData);
      
      return updatedUserData;
    } catch (error) {
      console.error("닉네임/프로필 변경 실패:", error);
      throw error;
    }
  },

  /** 부분 업데이트 */
  updateNicknameInStore: (authData) => {
    const { nickname, accessToken, profileImage } = authData; //  profileImage 추출 추가

    set((state) => ({
      user: state.user
        ? { 
            ...state.user, 
            nickname: nickname, 
            profileImage: profileImage, // 스토어 유저 상태에 이미지 주소 반영
          }
        : null,
      accessToken: accessToken || state.accessToken,
    }));

    // 로컬 스토리지 동기화
    localStorage.setItem("nickname", nickname);
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }
  },

  /** 내 정보 새로고침 호출 */
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

      set({
        user: {
          ...data,
          rewardPoint: data.rewardPoint,
          xp: data.xp,
          level: data.level,
          profileImage: data.profileImage, // 확실히 매핑
        },
        accessToken: token,
        isLoading: false,
      });
    } catch (error) {
      console.error("fetchUser 에러 발생:", error);
      set({ isLoading: false });
    }
  },

  /** 로그아웃 */
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("nickname");
    set({ user: null, accessToken: null });
  },

  /** 현재 XP 숫자 반환 */
  getCurrentXp: () => {
    const { user } = get();
    return Number(user?.xp) || 0;
  },

  /** 게이지 바 퍼센트 (0~100) */
  getXpPercentage: () => {
    const { user } = get();
    if (!user) return 0;
    const currentXp = Number(user.xp) || 0;
    return Math.min(currentXp, 100);
  },

  /** 좋아요 토글 */
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