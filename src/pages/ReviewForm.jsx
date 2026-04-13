import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import api from "../api/axios";

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

  // 이전 페이지 데이터
  const reviewData = location.state?.review;
  const isEdit = !!reviewData;

  const [selectedRestArea, setSelectedRestArea] = useState(() => {
    if (isEdit && reviewData) {
      return {
        id: reviewData.restAreaCode || reviewData.restAreaId,
        name: reviewData.restAreaName,
        latitude: reviewData.latitude ?? null,
        longitude: reviewData.longitude ?? null,
      };
    }

    if (id) {
    return {
      id: id,
      name: location.state?.areaName || "선택된 휴게소",
      latitude:  null,
      longitude: null,
    };
  }

    return null;
  });

  // 2. 단건 조회 API 연동
  useEffect(() => {
    const isValidId = id && id !== "undefined" && id !== "new";

    if (isValidId && !isEdit && (!selectedRestArea || selectedRestArea.name === "선택된 휴게소")) {
      const fetchRestArea = async () => {
        try {
          console.log("[API 요청] 상세 정보 호출 시작 - ID:", id);
          
          const response = await api.get(`/restareas/detail/${id}`);
          console.log("[API 응답] 전체 데이터:", response.data);
          
          const data = response.data;


          if (data && data.info) {
            console.log("[데이터 확인] info 객체를 찾았습니다:", data.info);
            
            const restInfo = data.info;
            
            setSelectedRestArea({
              id: restInfo.stdRestCd || restInfo.id,
              name: restInfo.dbName || restInfo.name, 
              latitude: restInfo.latitude,
              longitude: restInfo.longitude,
            });
            
            console.log("[상태 업데이트 완료] 적용된 이름:", restInfo.dbName || restInfo.name);
          } else {
            console.warn("[주의] data.info가 없습니다. data 자체를 확인해 보세요.");
            
            setSelectedRestArea({
              id: data.stdRestCd || data.id,
              name: data.dbName || data.name,
              latitude: data.latitude,
              longitude: data.longitude,
            });
          }

        } catch (error) {
          console.error("❌ [API 에러] 휴게소 정보 로드 실패:", error);
          if (error.response) {
            console.error("에러 상태:", error.response.status);
            console.error("에러 내용:", error.response.data);
          }
        }
      };
      fetchRestArea();
    }
  }, [id, isEdit]);

  const { verifyStatus, userLocation } = useLocationVerify(
    selectedRestArea?.latitude ? selectedRestArea : null
  );

  // 3. 리뷰 제출 훅
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
              disabled={isSubmitting || verifyStatus === "loading" || !selectedRestArea}
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