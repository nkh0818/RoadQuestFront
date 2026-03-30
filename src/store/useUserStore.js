import { create } from 'zustand';

const MOCK_USER = {
  id: 1,
  nickname: "동해번쩍서해번쩍",
  level: 5,
  xp: 75, 
  points: 1250,
  currentTitle: {
    id: 101,
    titleName: "프로 여행러"
  },
  reviewLikes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  userTitles: [1, 2, 3],
  role: "USER"
};

export const useUserStore = create((set, get) => ({
  user: null,
  isLoading: true,

  // 유저 정보 초기화
  fetchUser: async () => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 400));
    set({ user: { ...MOCK_USER }, isLoading: false });
  },

  // 리뷰 작성 보상 합산 로직
  addReviewReward: (rewardPoints, rewardXp) => {
    const { user } = get();
    if (!user) return;

    let newXp = user.xp + rewardXp;
    let newLevel = user.level;

    if (newXp >= 100) {
      newLevel += Math.floor(newXp / 100);
      newXp = newXp % 100;
      console.log(`🎉 축하합니다! 레벨 ${newLevel}로 상승하셨습니다!`);
    }

    set({
      user: {
        ...user,
        points: (user.points || 0) + rewardPoints,
        xp: newXp,
        level: newLevel,
      }
    });
  },

  // 좋아요 상태 업데이트
  toggleReviewLike: (reviewId) => {
    const { user } = get();
    if (!user) return;

    const isExist = user.reviewLikes.includes(reviewId);
    const newLikes = isExist 
      ? user.reviewLikes.filter(id => id !== reviewId)
      : [...user.reviewLikes, reviewId];

    set({ user: { ...user, reviewLikes: newLikes } });
  },

  // XP 퍼센트 계산
  getXpPercentage: () => {
    const { user } = get();
    if (!user) return 0;
    return Math.min(Math.max((user.xp / 100) * 100, 0), 100);
  }
}));