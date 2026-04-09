import { useState, useMemo, useEffect } from "react";
import { useUserStore } from "../store/useUserStore";
import { uploadImageToS3 } from "../api/review";
import api from "../api/axios";
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
  isEdit
}) {
  const fetchUser = useUserStore((state) => state.fetchUser);
  const addReviewToTop = useUserStore((state) => state.addReviewToTop);

  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [tagList, setTagList] = useState([]);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    if (isEdit && initialData) {
      // 수정 모드: 전달받은 데이터로 세팅
      setContent(initialData.content || "");
      setRating(initialData.rating || 0);
      setTagList(initialData.tagList || initialData.tags || []);
      if (initialData.imageUrl) {
        setPhotoPreviews([initialData.imageUrl]);
      } else {
        setPhotoPreviews([]);
      }
    } else if (!isEdit) {
      // 신규 작성 모드: 모든 상태를 명시적으로 초기화
      setContent("");
      setRating(0);
      setTagList([]);
      setPhotoFiles([]);
      setPhotoPreviews([]);
    }
  }, [initialData, isEdit]);

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

  // 사진 처리 (S3 업로드)
  const handlePhotoDrop = async (files) => {
    const loadingToast = toast.loading("이미지를 업로드 중...");
    try {
      const uploadPromises = files.map(file => uploadImageToS3(file));
      const s3Urls = await Promise.all(uploadPromises);
      setPhotoPreviews((prev) => [...prev, ...s3Urls]);
      setPhotoFiles((prev) => [...prev, ...files]);
      toast.success("업로드 완료!", { id: loadingToast });
    } catch (error) {
      console.log("이미지 업로드 실패:", error);
      toast.error("이미지 업로드에 실패했습니다.", { id: loadingToast });
    }
  };

  const handlePhotoRemove = (idx) => {
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== idx));
    setPhotoFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  // 리뷰 제출
  const handleSubmit = async (e, currentRestAreaId) => {
    if (e) e.preventDefault();

    // ID 결정 우선순위 명확화
    const finalId = currentRestAreaId || restAreaId;

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
        imageUrl: photoPreviews.length > 0 ? photoPreviews[0] : "", 
        userLat: userLocation?.latitude || 0.0,
        userLon: userLocation?.longitude || 0.0,
      };

      let response;

      if (isEdit && initialData?.reviewId) {
        response = await api.put(`/reviews/${initialData.reviewId}`, reviewData);
      } else {
        response = await api.post("/reviews", reviewData);
      }

      if (!isEdit && response.data && addReviewToTop) {
        addReviewToTop(response.data);
      }
      
      if (fetchUser) await fetchUser(true);

      // 성공 콜백
      onSuccess({
        points: verifyStatus === "verified" ? 200 : 100,
        xp: 30,
        isVerified: verifyStatus === "verified",
        newReview: response.data || null,
      });

      toast.success(isEdit ? "리뷰를 수정했습니다!" : "리뷰를 등록했습니다!");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "처리 중 오류가 발생했습니다.";
      toast.error(errorMsg);
      console.error("Review 처리 실패:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    content, setContent,
    rating, setRating,
    tagList, dynamicTags,
    addTag, removeTag,
    photoFiles, photoPreviews,
    handlePhotoDrop, handlePhotoRemove,
    isSubmitting, handleSubmit,
  };
}