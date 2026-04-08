import { useState, useMemo, useEffect } from "react";
import { useUserStore } from "../store/useUserStore";
import axios from "axios";
import toast from "react-hot-toast";

const TAG_MAP = [
  { keywords: ["맛있", "맛나", "국물", "존맛"], tag: "찐맛집" },
  { keywords: ["청결", "깨끗", "화장실"], tag: "위생만점" },
  { keywords: ["주차", "넓어", "주차장"], tag: "주차편함" },
  { keywords: ["풍경", "전망", "뷰"], tag: "뷰맛집" },
];

export function useReviewForm({
  verifyStatus,
  userLocation,
  onSuccess,
  initialData,
  restAreaId,
}) {
  const token = localStorage.getItem("accessToken");
  const fetchUser = useUserStore((state) => state.fetchUser);
  const addReviewToTop = useUserStore((state) => state.addReviewToTop);

  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [tagList, setTagList] = useState([]);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setContent(initialData.content || "");
      setRating(initialData.rating || 0);
      setTagList(initialData.tagList || initialData.tags || []);
    }
  }, [initialData]);

  const dynamicTags = useMemo(() => {
    if (!content.trim()) return [];
    const detected = TAG_MAP.filter((item) =>
      item.keywords.some((key) => content.includes(key)),
    ).map((item) => item.tag);
    return [...new Set(detected)].filter((tag) => !tagList.includes(tag));
  }, [content, tagList]);

  const addTag = (tag) => {
    if (!tagList.includes(tag)) setTagList((prev) => [...prev, tag]);
  };

  const removeTag = (tag) => {
    setTagList((prev) => prev.filter((v) => v !== tag));
  };

  const handlePhotoDrop = (files) => {
    setPhotoFiles((prev) => [...prev, ...files]);
    setPhotoPreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const handlePhotoRemove = (idx) => {
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== idx));
    setPhotoFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e, currentRestAreaId) => {
    if (e) e.preventDefault();

    // 1. 최신 ID 결정 (View에서 넘겨준 ID -> 훅 호출 시 받은 ID -> URL ID 순)
    const finalId = currentRestAreaId || restAreaId;

    // 2. 유효성 검사 (ID가 'new'나 'undefined'면 절대 안 넘어감)
    if (!finalId || finalId === "new" || finalId === "undefined") {
      return toast.error("리뷰를 작성할 휴게소를 먼저 선택해 주세요.");
    }

    if (rating === 0 || content.length < 5) {
      return toast.error("별점과 내용을 5글자 이상 입력해 주세요.");
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        restAreaId: finalId,
        rating: rating,
        content: content,
        tags: tagList,
        imageUrl: photoPreviews[0] || "",
        userLat: userLocation?.latitude || 0.0,
        userLon: userLocation?.longitude || 0.0,
      };

      let response;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (initialData?.reviewId) {
        response = await axios.put(
          `/api/reviews/${initialData.reviewId}`,
          reviewData,
          config,
        );
      } else {
        response = await axios.post("/api/reviews", reviewData, config);
      }

      if (!initialData && response.data && addReviewToTop) {
        addReviewToTop(response.data);
      }

      if (fetchUser) await fetchUser(true);

      onSuccess({
        points: verifyStatus === "verified" ? 200 : 100,
        xp: 30,
        isVerified: verifyStatus === "verified",
        newReview: response.data || null,
      });

      toast.success(
        initialData ? "리뷰를 수정했습니다!" : "리뷰를 등록했습니다!",
      );
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "처리 중 오류가 발생했습니다.";
      toast.error(errorMsg);
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
