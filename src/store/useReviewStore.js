import { create } from 'zustand';

const useReviewStore = create((set, get) => ({
  reviews: [],
  isLoading: false,

  // 리뷰 데이터
  fetchReviews: async (force = false) => {
    if (get().reviews.length > 0 && !force) return;

    set({ isLoading: true });
    try {
      await new Promise((res) => setTimeout(res, 800));
      const mockData = [
        { 
          id: 1, 
          placeName: "덕평 자연 휴게소",
          nickname: "초코송이", 
          rating: 5, 
          content: "여기 떡라면 진짜 명물이네요!", 
          tags: ["찐맛집"], 
          date: "2024.05.20",
          liked: false,
          likeCount: 5,
          comments: [
            { id: 10, author: "관리자", text: "맛있게 드셨다니 다행입니다!", date: "2024.05.21" }
          ]
        },
        { 
          id: 2, 
          placeName: "횡성 휴게소",
          nickname: "여행자A", 
          rating: 4, 
          content: "주차장이 넓어서 편해요.", 
          tags: ["주차편함"], 
          date: "2024.05.15",
          liked: true,
          likeCount: 12,
          comments: []
        },
      ];
      set({ reviews: mockData });
    } finally {
      set({ isLoading: false });
    }
  },

  // 리뷰 삭제
  deleteReview: (id) => {
    // 실제 환경: await axios.delete(`/api/reviews/${id}`)
    set((state) => ({
      reviews: state.reviews.filter((r) => r.id !== id)
    }));
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