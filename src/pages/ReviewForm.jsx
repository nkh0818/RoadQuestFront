import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { 
  Gift, Sparkles, CheckCircle2, MapPin, ShieldCheck, 
  Loader2, Camera, Info, AlertCircle 
} from "lucide-react";
import axios from "axios";

// 공통 및 서브 컴포넌트 임포트
import StarRating from "../components/review/StarRating";
import PhotoUploader from "../components/review/PhotoUploader";
import TagSystem from "../components/review/TagSystem";
import SubHeader from "../components/common/SubHeader";
import { useUserStore } from "../store/useUserStore"; // 유저 스토어 가져오기

export default function ReviewFormView() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const location = useLocation();

  // Zustand 스토어 액션 가져오기
  const addReviewReward = useUserStore((state) => state.addReviewReward);

  // 1. 로컬 상태 관리 (폼 입력 데이터)
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [tagList, setTagList] = useState([]);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  
  // 인증 및 로딩 상태
  const [verifyStatus, setVerifyStatus] = useState('loading');
  const [restAreaInfo, setRestAreaInfo] = useState(location.state?.restArea || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rewardData, setRewardData] = useState(null);

  // 2. GPS 위치 인증 로직
  useEffect(() => {
    const checkLocationMatch = async () => {
      try {
        let targetLat, targetLon;

        // 휴게소 정보 로드
        if (!restAreaInfo) {
          // 실제 환경에서는 백엔드 API 호출: await axios.get(`/api/restareas/${id}`);
          // 여기서는 예시 좌표 사용
          targetLat = 37.235; 
          targetLon = 127.105;
          setRestAreaInfo({ name: "용인 휴게소", latitude: targetLat, longitude: targetLon });
        } else {
          targetLat = restAreaInfo.latitude;
          targetLon = restAreaInfo.longitude;
        }

        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              // 약 500m 이내 여부 판단 (오차 범위 0.005)
              const isNear = Math.abs(latitude - targetLat) < 0.005 && Math.abs(longitude - targetLon) < 0.005;
              setVerifyStatus(isNear ? 'verified' : 'normal');
            },
            () => setVerifyStatus('normal'),
            { enableHighAccuracy: true, timeout: 5000 }
          );
        } else {
          setVerifyStatus('normal');
        }
      } catch (error) {
        setVerifyStatus('normal');
      }
    };
    checkLocationMatch();
  }, [id, restAreaInfo]);

  // 3. 텍스트 분석 기반 동적 태그 추천
  const dynamicTags = useMemo(() => {
    const TAG_MAP = [
      { keywords: ["맛있", "맛나", "국물", "존맛"], tag: "찐맛집" },
      { keywords: ["청결", "깨끗", "화장실"], tag: "위생만점" },
      { keywords: ["주차", "넓어", "주차장"], tag: "주차편함" },
      { keywords: ["풍경", "전망", "뷰"], tag: "뷰맛집" },
    ];
    if (!content.trim()) return [];
    const detected = TAG_MAP.filter((item) =>
      item.keywords.some((key) => content.includes(key)),
    ).map((item) => item.tag);
    return [...new Set(detected)].filter((tag) => !tagList.includes(tag));
  }, [content, tagList]);

  // 4. 리뷰 제출 핸들러 (Zustand 연동 포인트)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || content.length < 5) return alert("별점과 내용을 5자 이상 입력해주세요!");

    setIsSubmitting(true);

    try {
      // [백엔드 연결 시점] FormData 구성 및 전송
      // const formData = new FormData();
      // formData.append("content", content);
      // ... (기타 데이터 추가)
      // const response = await axios.post("/api/reviews", formData);

      // 가상의 응답 데이터 (서버에서 준 보상값이라고 가정)
      const mockResponse = {
        points: verifyStatus === 'verified' ? 200 : 100, // 인증 시 2배
        xp: 30,
        isVerified: verifyStatus === 'verified'
      };

      // ✅ 핵심: Zustand 스토어에 보상 정보 반영 (포인트, XP 업데이트 및 레벨업 체크)
      addReviewReward(mockResponse.points, mockResponse.xp);

      setRewardData(mockResponse);
    } catch (error) {
      alert("리뷰 저장에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-['Pretendard']">
      <SubHeader showBack={true} title={`${restAreaInfo?.name || '휴게소'} 리뷰 작성`} />

      <main className="p-6 max-w-full mx-auto space-y-8">
        {/* 상단 인증 상태 섹션 */}
        <section className={`p-5 rounded-[2rem] border-2 transition-all duration-500 flex items-center justify-between ${
          verifyStatus === 'verified' ? 'bg-blue-50 border-blue-100' : 'bg-white border-slate-100 shadow-sm'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
              verifyStatus === 'verified' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              {verifyStatus === 'loading' ? <Loader2 className="animate-spin" /> : 
               verifyStatus === 'verified' ? <ShieldCheck size={26} /> : <MapPin size={24} />}
            </div>
            <div>
              <h3 className="text-[15px] font-black text-slate-900 leading-tight">
                {verifyStatus === 'loading' ? "위치 확인 중..." : 
                 verifyStatus === 'verified' ? "현장 방문 인증됨" : "일반 리뷰 모드"}
              </h3>
              <p className="text-[12px] font-bold text-slate-400 mt-0.5">
                {verifyStatus === 'verified' ? "포인트와 XP가 더 많이 적립됩니다!" : "현장 근처에서만 인증이 가능해요."}
              </p>
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* 별점 컴포넌트 */}
          <StarRating rating={rating} setRating={setRating} />

          {/* 텍스트 입력 섹션 */}
          <section className="space-y-4">
            <label className="text-[14px] font-black text-slate-900 flex items-center gap-1.5 px-1">
              <div className="w-1 h-3.5 bg-blue-600 rounded-full" /> 상세 리뷰
            </label>
            <div className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-slate-100 focus-within:border-blue-200 transition-all">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-40 border-none focus:ring-0 text-[16px] font-medium p-0 bg-transparent text-slate-700 placeholder:text-slate-300 leading-relaxed resize-none font-['Pretendard']"
                placeholder="어떤 점이 좋았나요? 맛이나 시설 등 자유롭게 기록해 보세요."
              />
            </div>
          </section>

          {/* 사진 업로더 컴포넌트 */}
          <PhotoUploader 
            previews={photoPreviews} 
            onDrop={(files) => {
              setPhotoFiles(prev => [...prev, ...files]);
              setPhotoPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
            }} 
            onRemove={(idx) => {
              setPhotoPreviews(prev => prev.filter((_, i) => i !== idx));
              setPhotoFiles(prev => prev.filter((_, i) => i !== idx));
            }} 
          />

          {/* 태그 시스템 컴포넌트 */}
          <TagSystem 
            tags={tagList} 
            dynamicTags={dynamicTags} 
            onAdd={(t) => setTagList([...tagList, t])} 
            onRemove={(t) => setTagList(tagList.filter((v) => v !== t))} 
          />

          {/* 하단 플로팅 버튼 영역 */}
          <div className="sticky bottom-6 z-10">
            <button
              disabled={isSubmitting || verifyStatus === 'loading'}
              className={`w-full py-5 rounded-[2rem] font-black text-white shadow-2xl transition-all flex items-center justify-center gap-2 ${
                isSubmitting ? "bg-slate-400" : "bg-slate-900 hover:bg-blue-600 active:scale-95"
              }`}
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "작성 완료 및 보상받기"}
            </button>
          </div>
        </form>
      </main>

      {/* 보상 알림 모달 */}
      {rewardData && (
        <RewardModal 
          data={rewardData} 
          onClose={() => navigate('/community')} 
        />
      )}
    </div>
  );
}

// 보상 결과 모달 컴포넌트
function RewardModal({ data, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-slate-900/60 font-['Pretendard']">
      <div className="bg-white rounded-[3.5rem] p-10 w-full max-w-xs text-center shadow-2xl animate-in zoom-in-95 duration-300">
        <div className={`w-24 h-24 mx-auto mb-6 rounded-[2rem] flex items-center justify-center shadow-lg ${data.isVerified ? 'bg-blue-600 shadow-blue-200' : 'bg-slate-800'}`}>
          {data.isVerified ? <ShieldCheck size={40} className="text-white" /> : <Gift size={40} className="text-white" />}
        </div>
        <h3 className="text-[22px] font-black text-slate-900 mb-2">
          {data.isVerified ? "현장 인증 완료!" : "리뷰 기록 완료!"}
        </h3>
        <p className="text-[14px] font-bold text-slate-400 leading-relaxed mb-8">
          소중한 경험을 공유해주셔서 감사해요.<br />
          <span className="text-blue-600 font-black">+{data.points}P / +{data.xp}XP</span>가 적립되었습니다.
        </p>
        <button 
          onClick={onClose} 
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-blue-600 transition-all active:scale-95"
        >
          커뮤니티로 가기
        </button>
      </div>
    </div>
  );
}