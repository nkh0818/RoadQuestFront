import { create } from "zustand";
import api from "../api/axios";
import { deleteReviewApi } from "../api/review";

const useReviewStore = create((set, get) => ({
  reviews: [], // 전체 리뷰 목록 (커뮤니티)
  isLoading: false,
  page: 0, // 페이징용
  hasMore: true, // 다음 페이지 유무

  fetchNextPage: () => {
    const { page, hasMore, isLoading, fetchReviews } = get();
    if (!isLoading && hasMore) {
      fetchReviews(page + 1);
    }
  },

  // 리뷰 데이터 가져오기 (커뮤니티/전체)
  fetchReviews: async (pageNum = 0) => {
    if (get().isLoading) return;

    set({ isLoading: true });
    try {
      // 백엔드 페이징 API 호출
      const res = await api.get(
        `/reviews/community?page=${pageNum}&size=10`,
      );

      const { content, last } = res.data;

      set((state) => ({
        reviews: pageNum === 0 ? content : [...state.reviews, ...content],
        page: pageNum,
        hasMore: !last,
        isLoading: false,
      }));
    } catch (error) {
      console.error("리뷰 로드 실패:", error);
      set({ isLoading: false });
    }
  },

  // 새 리뷰 추가 (작성 즉시 맨 위로)
  addReview: (newReview) => {
    set((state) => ({
      reviews: [newReview, ...state.reviews],
    }));
  },

  // 리뷰 삭제 (서버 연동 + 로컬 상태 반영)
  deleteReview: async (reviewId) => {
    try {
      await deleteReviewApi(reviewId); // 실제 서버 삭제
      set((state) => ({
        reviews: state.reviews.filter((r) => r.reviewId !== reviewId),
      }));
    } catch (error) {
      console.error("리뷰 삭제 실패:", error);
      throw error;
    }
  },

  //유저 차단
  blockUser: async (blockedUserId) => {
    try {
      const response = await api.post("/blocks", { blockedUserId });
      set((state) => ({
        reviews: state.reviews.filter((r) => r.userId !== blockedUserId),
      }));
      return response.data;
    } catch (error) {
      console.error("차단 실패 상세:", error.response?.data || error.message);
      throw error;
    }
  },

  unblockUser: async (blockedUserId) => {
    try {
      await api.delete(`/blocks/${blockedUserId}`);
      // 성공 시 로컬 상태 업데이트 (목록에서 제거 등)
    } catch (error) {
      console.error("해제 실패:", error);
    }
  },
}));

export default useReviewStore;
