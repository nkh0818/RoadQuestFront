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

  // 사진 처리 (드롭/삭제)
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

  //리뷰 작성
  const handleSubmit = async (e) => {
    e.preventDefault();
    

    // 유효성 검사
    if (rating === 0 || content.length < 5) {
      return toast.error("별점과 내용을 5글자 이상 입력해 주세요.");
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        restAreaId: restAreaId,
        rating: rating,
        content: content,
        tags: tagList,
        imageUrl: photoPreviews[0] || "", // 현재는 단일 이미지 처리
        userLat: verifyStatus?.lat || 37.1234,
        userLon: verifyStatus?.lon || 127.1234,
      };

      console.log("보내준 Review 데이터 확인:", reviewData);

      let response;

      if (initialData?.reviewId) {
        // 수정 모드: @PutMapping("/{reviewId}") 호출
        response = await axios.put(
          `/api/reviews/${initialData.reviewId}`,
          reviewData,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      } else {
        // 등록 모드: @PostMapping 호출
        response = await axios.post("/api/reviews", reviewData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (!initialData && response.data && addReviewToTop) {
        addReviewToTop(response.data);
      }

      // 유저 정보(포인트 등) 갱신
      if (fetchUser) {
        console.log("리뷰 작성 성공! 최신 칭호를 가져옵니다...");
        await fetchUser(true);
      }

      // 콜백 실행 (포인트 팝업 등을 위해 결과 전달)
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
      toast.error(
        initialData ? "리뷰 수정에 실패했습니다." : "리뷰 등록에 실패했습니다.",
      );
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
