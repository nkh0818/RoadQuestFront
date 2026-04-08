import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import axios from "axios"; // axios 추가

import SubHeader from "../components/common/SubHeader";
import StarRating from "../components/review/StarRating";
import PhotoUploader from "../components/common/PhotoUploader";
import TagSystem from "../components/review/TagSystem";
import ReviewTextArea from "../components/review/ReviewTextArea";
import VerifyStatusCard from "../components/review/VerifyStatusCard";
import RestAreaSelectorModal from "../components/review/RestAreaSelectorModal";
import RewardModal from "../components/review/RewardModal";
import { useLocationVerify } from "../hook/useLocationVerify";
import { useReviewForm } from "../hook/useReviewForm";

export default function ReviewFormView() {
  const { id } = useParams();

  const navigate = useNavigate();
  const location = useLocation();
  const [rewardData, setRewardData] = useState(null);
  const [showSelector, setShowSelector] = useState(false);

  // 수정모드 확인
  const reviewData = location.state?.review;
  const isEdit = !!reviewData;

  // 1. 휴게소 선택 상태 관리
  const [selectedRestArea, setSelectedRestArea] = useState(() => {
    if (isEdit && reviewData) {
      return {
        id: reviewData.restAreaCode || reviewData.restAreaId,
        name: reviewData.restAreaName,
        latitude: reviewData.latitude ?? null,
        longitude: reviewData.longitude ?? null,
      };
    }
    return null;
  });

  // 2. 단건 조회 API 연동 및 유효성 검사
  useEffect(() => {
    console.log("🚩 [진입] URL 파라미터 ID:", id);
    const isValidId = id && id !== "undefined" && id !== "new";

    if (isValidId && !isEdit) {
      const fetchRestArea = async () => {
        try {
          const response = await axios.get(`/api/restareas/${id}`);
          const data = response.data;
          setSelectedRestArea({
            id: data.stdRestCd,
            name: data.dbName,
            latitude: data.latitude,
            longitude: data.longitude,
          });
          console.log("✅ [조회 성공] 가져온 휴게소 데이터:", data);
        } catch (error) {
          console.error("휴게소 정보 로드 실패:", error);
          // 데이터 로드 실패 시 유저가 직접 선택할 수 있도록 유도
          setSelectedRestArea(null);
        }
      };
      fetchRestArea();
    }
  }, [id, isEdit]);

  // GPS 인증 훅
  const { verifyStatus, userLocation } = useLocationVerify(
    selectedRestArea?.latitude ? selectedRestArea : null,
  );

  // 4. 리뷰 제출 훅
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
    handleSubmit: submitToHook,
  } = useReviewForm({
    verifyStatus,
    userLocation,
    onSuccess: setRewardData,
    restAreaId: selectedRestArea?.id || id,
    initialData: reviewData,
    isEdit,
  });

  const onHandleSubmit = (e) => {
    e.preventDefault();
    submitToHook(e, selectedRestArea?.id);
    console.log(
      "🚀 [제출 버튼 클릭] 현재 selectedRestArea 상태:",
      selectedRestArea,
    );
    console.log(
      "🚀 [제출 버튼 클릭] 훅으로 보낼 최종 ID:",
      selectedRestArea?.id,
    );
  };

  const pageTitle = `${selectedRestArea?.name || "휴게소"} 리뷰 ${isEdit ? "수정" : "작성"}`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-['Pretendard']">
      <SubHeader showBack={true} title={pageTitle} />

      <main className="p-6 max-w-full mx-auto space-y-8">
        <VerifyStatusCard
          status={selectedRestArea ? verifyStatus : "idle"}
          restAreaName={selectedRestArea?.name}
          onSelectRequest={() => setShowSelector(true)}
          isEdit={isEdit}
          hasLocationData={!!selectedRestArea?.latitude}
        />

        <form onSubmit={onHandleSubmit} className="space-y-10">
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
              type="submit"
              disabled={
                isSubmitting || verifyStatus === "loading" || !selectedRestArea
              }
              className={`w-full py-5 rounded-[2rem] font-black text-white shadow-2xl transition-all flex items-center justify-center gap-2 ${
                isSubmitting || !selectedRestArea
                  ? "bg-slate-300"
                  : "bg-slate-900 hover:bg-blue-600 active:scale-95"
              }`}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : !selectedRestArea ? (
                "휴게소를 먼저 선택해주세요"
              ) : isEdit ? (
                "수정 완료"
              ) : (
                "작성 완료 및 보상받기"
              )}
            </button>
          </div>
        </form>
      </main>

      {showSelector && (
        <RestAreaSelectorModal
          onSelect={(area) => {
            console.log("📍 모달에서 넘어온 원본 데이터:", area);
            setSelectedRestArea({
              id: area.restAreaCode || area.stdRestCd || area.id,
              name: area.restAreaName || area.dbName || area.name,
              latitude: area.latitude || null,
              longitude: area.longitude || null,
            });
            setShowSelector(false);
          }}
          onClose={() => setShowSelector(false)}
        />
      )}

      {rewardData && (
        <RewardModal data={rewardData} onClose={() => navigate("/community")} />
      )}
    </div>
  );
}
