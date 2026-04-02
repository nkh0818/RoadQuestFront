import { useState, useMemo } from "react";
import { useUserStore } from "../store/useUserStore";

const TAG_MAP = [
  { keywords: ["맛있", "맛나", "국물", "존맛"], tag: "찐맛집" },
  { keywords: ["청결", "깨끗", "화장실"], tag: "위생만점" },
  { keywords: ["주차", "넓어", "주차장"], tag: "주차편함" },
  { keywords: ["풍경", "전망", "뷰"], tag: "뷰맛집" },
];

export function useReviewForm({ verifyStatus, onSuccess }) {
  const addReviewReward = useUserStore((state) => state.addReviewReward);

  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [tagList, setTagList] = useState([]);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dynamicTags = useMemo(() => {
    if (!content.trim()) return [];
    const detected = TAG_MAP.filter((item) =>
      item.keywords.some((key) => content.includes(key))
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
    setPhotoPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const handlePhotoRemove = (idx) => {
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== idx));
    setPhotoFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || content.length < 5)
      return alert("별점과 내용을 5자 이상 입력해주세요!");

    setIsSubmitting(true);
    try {
      // TODO: await axios.post('/api/reviews', formData) 로 교체
      const mockResponse = {
        points: verifyStatus === "verified" ? 200 : 100,
        xp: 30,
        isVerified: verifyStatus === "verified",
      };

      addReviewReward(mockResponse.points, mockResponse.xp);
      onSuccess(mockResponse);
    } catch (error) {
      alert("리뷰 저장에 실패했습니다.");
      console.log("리뷰 저장 실패:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    content, setContent,
    rating, setRating,
    tagList, dynamicTags, addTag, removeTag,
    photoFiles,
    photoPreviews, handlePhotoDrop, handlePhotoRemove,
    isSubmitting, handleSubmit,
  };
}
