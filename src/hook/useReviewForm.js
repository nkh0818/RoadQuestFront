import { useState, useMemo } from "react";
import { useUserStore } from "../store/useUserStore";
import axios from "axios";
import toast from "react-hot-toast";

const TAG_MAP = [
  { keywords: ["맛있", "맛나", "국물", "존맛"], tag: "찐맛집" },
  { keywords: ["청결", "깨끗", "화장실"], tag: "위생만점" },
  { keywords: ["주차", "넓어", "주차장"], tag: "주차편함" },
  { keywords: ["풍경", "전망", "뷰"], tag: "뷰맛집" },
];

export function useReviewForm({ verifyStatus, onSuccess, restAreaId }) {
  const token = localStorage.getItem("accessToken");
  const fetchUser = useUserStore((state) => state.fetchUser);
  const addReviewToTop = useUserStore((state) => state.addReviewToTop);

  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [tagList, setTagList] = useState([]);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // 리뷰 등록
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || content.length < 5)
      return toast.error("별점과 내용을 5글자 이상 입력해 주세요.");

    setIsSubmitting(true);

    try {
      const reviewData = {
        restAreaId: restAreaId,
        rating: rating,
        content: content,
        tags: tagList,
        imageUrl: photoPreviews[0] || "",
        userLat: verifyStatus?.lat || 37.1234,
        userLon: verifyStatus?.lon || 127.1234,
      };

      console.log("보내준 Review 데이터 확인:", reviewData);

      const response = await axios.post("/api/reviews", reviewData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && addReviewToTop) {
        addReviewToTop(response.data);
      }

      if (fetchUser) await fetchUser(true);

      onSuccess({
        points: verifyStatus === "verified" ? 200 : 100,
        xp: 30,
        isVerified: verifyStatus === "verified",
        newReview: response.data
      });
      toast.success("리뷰를 등록했습니다!");
    } catch (error) {
      toast.error("리뷰 작성에 실패했습니다.");
      console.log("리뷰 저장 실패:", error.response?.data || error.message);
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
