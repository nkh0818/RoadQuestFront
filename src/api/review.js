import api from './axios';

// 내가 작성한 리뷰 목록 가져오기
export const fetchMyReviews = async () => {
  const token = localStorage.getItem("accessToken");
  const response = await api.get(`/reviews/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

// 리뷰 삭제하기
export const deleteReviewApi = async (reviewId) => {
  const token = localStorage.getItem("accessToken");
  await api.delete(`/reviews/${reviewId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};
// 이미지 S3 업로드 (추가)
export const uploadImageToS3 = async (file) => {
  const token = localStorage.getItem("accessToken");
  const formData = new FormData();
  formData.append('image', file); // 백엔드 @RequestParam("image")와 이름 맞춤

  const response = await api.post(`/test/upload`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data; // 서버에서 준 S3 URL 주소 반환
};

// 리뷰 저장하기 (신규/수정)
export const createReviewApi = async (reviewData) => {
  const token = localStorage.getItem("accessToken");
  const response = await api.post(`/reviews`, reviewData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};