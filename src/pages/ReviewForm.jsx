import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

import SubHeader from "../components/common/SubHeader";
import StarRating from "../components/review/StarRating";
import PhotoUploader from "../components/common/PhotoUploader";
import TagSystem from "../components/review/TagSystem";
import ReviewTextArea from "../components/review/ReviewTextArea";
import VerifyStatusCard from "../components/review/VerifyStatusCard";
import RewardModal from "../components/review/RewardModal";
import { useLocationVerify } from "../hook/useLocationVerify";
import { useReviewForm } from "../hook/useReviewForm";

export default function ReviewFormView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [rewardData, setRewardData] = useState(null);

  const reviewData = location.state?.review; // 이전 페이지(MyReviewItem)에서 보낸 데이터
  const isEdit = !!reviewData; // 데이터가 있으면 true, 없으면 false

  const { verifyStatus, restAreaInfo } = useLocationVerify(
    reviewData?.restAreaId || id,
    reviewData?.restAreaName,
  );

  const {
    content,
    setContent,
    rating,
    setRating,
    tagList,
    dynamicTags,
    addTag,
    removeTag,
    photoPreviews,
    handlePhotoDrop,
    handlePhotoRemove,
    isSubmitting,
    handleSubmit,
  } = useReviewForm({
    verifyStatus,
    onSuccess: setRewardData,
    restAreaId: id,
    initialData: reviewData,
    isEdit,
  });

  const restAreaName = reviewData?.restAreaName || restAreaInfo?.name;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-['Pretendard']">
      <SubHeader
        showBack={true}
        title={`${restAreaName || "휴게소"} 리뷰 ${isEdit ? "수정" : "작성"}`}
      />

      <main className="p-6 max-w-full mx-auto space-y-8">
        <VerifyStatusCard status={verifyStatus} />

        <form onSubmit={handleSubmit} className="space-y-10">
          <StarRating rating={rating} setRating={setRating} />
          <ReviewTextArea value={content} onChange={setContent} />
          <PhotoUploader
            previews={photoPreviews}
            onDrop={handlePhotoDrop}
            onRemove={handlePhotoRemove}
          />
          <TagSystem
            tags={tagList}
            dynamicTags={dynamicTags}
            onAdd={addTag}
            onRemove={removeTag}
          />

          <div className="sticky bottom-6 z-10">
            <button
              disabled={isSubmitting || verifyStatus === "loading"}
              className={`w-full py-5 rounded-[2rem] font-black text-white shadow-2xl transition-all flex items-center justify-center gap-2 ${
                isSubmitting
                  ? "bg-slate-400"
                  : "bg-slate-900 hover:bg-blue-600 active:scale-95"
              }`}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : isEdit ? (
                "수정 완료"
              ) : (
                "작성 완료 및 보상받기"
              )}
            </button>
          </div>
        </form>
      </main>

      {rewardData && (
        <RewardModal data={rewardData} onClose={() => navigate("/community")} />
      )}
    </div>
  );
}
