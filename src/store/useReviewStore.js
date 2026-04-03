import { create } from 'zustand';
import { fetchMyReviews, deleteReviewApi } from '../api/review';

const useReviewStore = create((set, get) => ({
  reviews: [],
  isLoading: false,

  // 리뷰 데이터
  fetchReviews: async (force = false) => {
    if (get().reviews.length > 0 && !force) return;

    set({ isLoading: true });
    try {
       const data = await fetchMyReviews();
      set({ reviews: data });
    } catch (error) {
      console.error("리뷰 로딩 실패:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  // 리뷰 삭제
  deleteReview: async (id) => {
    try {
      await deleteReviewApi(id); // 🚀 서버에서 삭제
      set((state) => ({
        reviews: state.reviews.filter((r) => r.id !== id)
      }));
    } catch (error) {
      console.error("리뷰 삭제 실패:", error);
      throw error;
    }
  },

  // 좋아요 토글 (실시간 카운트 반영)
  toggleLike: (reviewId) => {
    set((state) => ({
      reviews: state.reviews.map((r) =>
        r.id === reviewId
          ? { 
              ...r, 
              liked: !r.liked, 
              likeCount: r.liked ? r.likeCount - 1 : r.likeCount + 1 
            }
          : r
      ),
    }));
  },

  // 댓글 추가
  addComment: (reviewId, text) => {
    const newComment = {
      id: Date.now(),
      author: "나(USER)",
      text,
      date: new Date().toLocaleDateString().replace(/\.$/, ""), // YYYY.MM.DD 형식
    };

    set((state) => ({
      reviews: state.reviews.map((r) =>
        r.id === reviewId ? { ...r, comments: [...r.comments, newComment] } : r
      ),
    }));
  },

  // 댓글 수정
  editComment: (reviewId, commentId, newText) => {
    set((state) => ({
      reviews: state.reviews.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              comments: r.comments.map((c) =>
                c.id === commentId ? { ...c, text: newText } : c
              ),
            }
          : r
      ),
    }));
  },

  // 댓글 삭제
  deleteComment: (reviewId, commentId) => {
    set((state) => ({
      reviews: state.reviews.map((r) =>
        r.id === reviewId
          ? { ...r, comments: r.comments.filter((c) => c.id !== commentId) }
          : r
      ),
    }));
  },
}));

export default useReviewStore;