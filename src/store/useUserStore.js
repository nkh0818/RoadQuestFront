import { create } from 'zustand';
import { fetchMe } from '../api/auth';

/**
 * [MOCK_DATA] 
 * 백엔드 API(AuthResponseDTO)에 아직 포함되지 않은 필드들을 위한 임시 데이터입니다.
 * 백엔드에서 해당 데이터를 제공하기 시작하면 이 객체에서 하나씩 삭제하세요.
 */
const MOCK_FIELDS = {
  xp: 75, // 경험치 (0~99)
  points: 1250, // 포인트
  currentTitle: { 
    id: 101, 
    titleName: "프로 여행러" 
  },
  reviewLikes: [1, 2, 3, 4, 5], // 찜한 리뷰 ID 리스트
  userTitles: [1, 2, 3], // 보유한 타이틀 ID 리스트
  reviews: [1, 2], // 작성한 리뷰 리스트 (개수 표시용)
};

export const useUserStore = create((set, get) => ({
  user: null,
  isLoading: false,

  /**
   * 1. 로그인/회원가입 성공 시 호출
   * 백엔드 데이터(authData)와 목업 데이터를 합성하여 저장합니다.
   */
  setUserData: (authData) => {
    set({
      user: {
        ...MOCK_FIELDS, // (1) 기본 목업 데이터 주입
        nickname: authData.nickname, // (2) 실제 닉네임 (백엔드)
        email: authData.email,       // (2) 실제 이메일 (백엔드)
        level: authData.level,       // (2) 실제 레벨 (백엔드)
        accessToken: authData.accessToken, // (2) 실제 토큰 (백엔드)
      },
      isLoading: false
    });

    // API 요청 시 사용할 토큰/닉네임을 로컬 스토리지에 저장
    if (authData.accessToken) {
      localStorage.setItem('accessToken', authData.accessToken);
    }
    if (authData.nickname) {
      localStorage.setItem('nickname', authData.nickname);
    }
  },

  /**
   * 2. 새로고침 시 호출
   * 로컬 스토리지의 토큰을 이용해 백엔드에서 최신 유저 정보를 가져옵니다.
   */
  fetchUser: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      set({ user: null, isLoading: false });
      return;
    }

    set({ isLoading: true });
    try {
      // TODO: 백엔드에 현재 로그인 정보를 가져오는 GET /api/auth/me 엔드포인트 필요
      const data = await fetchMe();
      
      // 서버 데이터와 목업 데이터를 다시 합성
      set({ 
        user: { ...MOCK_FIELDS, ...data },
        isLoading: false 
      });
    } catch (error) {
      console.error("🚨 fetchUser 에러 발생 (여기서 토큰 지움):", error);
      // localStorage.removeItem('accessToken'); // 👈 잠시 주석 처리하고 테스트해보세요!
      set({ user: null, isLoading: false });
    }
  },

  /**
   * 3. 로그아웃
   */
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('nickname');
    set({ user: null });
  },

  /**
   * 4. XP 퍼센트 계산 로직
   * PassSection의 경험치 바(Progress Bar) 계산에 사용됩니다.
   */
  getXpPercentage: () => {
    const { user } = get();
    if (!user) return 0;
    
    // xp가 100을 넘어가면 레벨업하는 구조라면 % 100 사용
    // 현재는 목업 데이터 75를 기준으로 75% 반환
    const currentXp = user.xp || 0;
    return Math.min(Math.max(currentXp % 100, 0), 100);
  },

  /**
   * 5. 좋아요(찜) 토글 (로컬 상태 우선 반영)
   */
  toggleReviewLike: (reviewId) => {
    const { user } = get();
    if (!user) return;

    const isExist = user.reviewLikes?.includes(reviewId);
    const newLikes = isExist 
      ? user.reviewLikes.filter(id => id !== reviewId)
      : [...(user.reviewLikes || []), reviewId];

    set({ user: { ...user, reviewLikes: newLikes } });
  }
}));