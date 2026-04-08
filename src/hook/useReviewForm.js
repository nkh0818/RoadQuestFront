import { useState, useMemo, useEffect } from "react";
import { useUserStore } from "../store/useUserStore";
import { uploadImageToS3 } from "../api/review";
import axios from "axios";
import toast from "react-hot-toast";

const TAG_MAP = [
  { keywords: ["맛있", "맛나", "국물", "존맛"], tag: "찐맛집" },
  { keywords: ["청결", "깨끗", "화장실"], tag: "위생만점" },
  { keywords: ["주차", "넓어", "주차장"], tag: "주차편함" },
  { keywords: ["풍경", "전망", "뷰"], tag: "뷰맛집" },
];

export function useReviewForm({ verifyStatus, onSuccess, initialData, restAreaId }) {
  const token = localStorage.getItem("accessToken");
  const fetchUser = useUserStore((state) => state.fetchUser);
  const addReviewToTop = useUserStore((state) => state.addReviewToTop);

  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [tagList, setTagList] = useState([]);
  const [photoFiles, setPhotoFiles] = useState([]); // 필요 시 유지
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setContent(initialData.content || "");
      setRating(initialData.rating || 0);
      setTagList(initialData.tagList || initialData.tags || []);
    }
  }, [initialData]);

  // 다이나믹 태그
  const dynamicTags = useMemo(() => {
    if (!content.trim()) return [];
    const detected = TAG_MAP.filter((item) =>
      item.keywords.some((key) => content.includes(key)),
    ).map((item) => item.tag);
    return [...new Set(detected)].filter((tag) => !tagList.includes(tag));
  }, [content, tagList]);

  // 태그 관리 (추가/삭제)
  const addTag = (tag) => {
    if (!tagList.includes(tag)) setTagList((prev) => [...prev, tag]);
  };

  const removeTag = (tag) => {
    setTagList((prev) => prev.filter((v) => v !== tag));
  };

  // 사진 처리 (드롭/삭제) - S3 업로드 로직 통합
  const handlePhotoDrop = async (files) => {
    const loadingToast = toast.loading("이미지를 S3에 업로드 중...");
    try {
      // 1. 파일을 받자마자 S3로 업로드 실행
      const uploadPromises = files.map(file => uploadImageToS3(file));
      const s3Urls = await Promise.all(uploadPromises);

      // 2. 서버가 준 진짜 S3 주소들을 프리뷰 상태에 저장
      setPhotoPreviews((prev) => [...prev, ...s3Urls]);
      
      // 기존 로직 유지를 위해 파일 객체도 저장 (필요 없으면 제거 가능)
      setPhotoFiles((prev) => [...prev, ...files]);

      toast.success("업로드 완료!", { id: loadingToast });
    } catch (error) {
      console.error("S3 업로드 에러:", error);
      toast.error("이미지 업로드에 실패했습니다.", { id: loadingToast });
    }
  };

  const handlePhotoRemove = (idx) => {
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== idx));
    setPhotoFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  // 리뷰 등록
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || content.length < 5)
      return toast.error("별점과 내용을 5글자 이상 입력해 주세요.");

    setIsSubmitting(true);

    try {
      // 1. 요청 데이터 구성
      const reviewData = {
        restAreaId: restAreaId,
        rating: rating,
        content: content,
        tags: tagList,
        // S3 서버 URL 주소
        imageUrl: photoPreviews[0] || "", 
        userLat: verifyStatus?.lat || 37.1234,
        userLon: verifyStatus?.lon || 127.1234,
      };

let response;
      // 1. API 주소 베이스 설정 (환경 변수 활용)
      const API_BASE_URL = import.meta.env.VITE_API_URL || '';

      // 2. 등록(POST) vs 수정(PUT) 분기 처리 (기존 로직 유지)
      if (initialData?.reviewId) {
        // 수정 모드
        response = await axios.put(`${API_BASE_URL}/api/reviews/${initialData.reviewId}`, reviewData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json" 
          },
        });
      } else {
        // 등록 모드 (S3 URL 등이 포함된 reviewData 전송)
        console.log("보내준 Review 데이터 확인 (S3 URL 포함):", reviewData);
        response = await axios.post(`${API_BASE_URL}/api/reviews`, reviewData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json" 
          },
        });
      }

      // 3. 성공 후 상태 업데이트
      if (response.data && addReviewToTop) {
        addReviewToTop(response.data);
      }
      
      if (fetchUser) await fetchUser(true);

      // 콜백 실행 (포인트 팝업 등을 위해 결과 전달)
      onSuccess({
        points: verifyStatus === "verified" ? 200 : 100,
        xp: 30,
        isVerified: verifyStatus === "verified",
        newReview: response.data || null
      });

      toast.success(initialData ? "리뷰를 수정했습니다!" : "리뷰를 등록했습니다!");
      
    } catch (error) {
      toast.error(initialData ? "리뷰 수정에 실패했습니다." : "리뷰 등록에 실패했습니다.");
      console.error("Review 처리 실패:", error.response?.data || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    content,
    setContent,
    rating,
    setRating,
    tagList,
    dynamicTags,
    addTag,
    removeTag,
    photoFiles,
    photoPreviews,
    handlePhotoDrop,
    handlePhotoRemove,
    isSubmitting,
    handleSubmit,
  };
}