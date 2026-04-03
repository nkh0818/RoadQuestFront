import axios from 'axios';

// 내가 작성한 리뷰 목록 가져오기
export const fetchMyReviews = async () => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/reviews/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data; // List<ReviewResponseDTO>를 받아옴
};

// 리뷰 삭제하기
export const deleteReviewApi = async (reviewId) => {
  const token = localStorage.getItem("accessToken");
  await axios.delete(`${import.meta.env.VITE_API_URL}/api/reviews/${reviewId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};