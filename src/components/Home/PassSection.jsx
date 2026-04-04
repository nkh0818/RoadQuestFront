import React, { useEffect } from "react";
import {
  Trophy,
  ChevronRight,
  Award,
  Heart,
  MessageSquare,
} from "lucide-react";
import { useUserStore } from "../../store/useUserStore";
import { useNavigate } from "react-router-dom";
import useReviewStore from "../../store/useReviewStore";
import { useSavedStore } from "../../store/useSavedStore";

export default function PassSection() {
  const { savedRestAreas, fetchFavorites } = useSavedStore();

  const { reviews, fetchReviews } = useReviewStore();
  const { user, isLoading, fetchUser, getXpPercentage } = useUserStore();

  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
    fetchReviews();
    fetchFavorites();
  }, []);

  // 로딩 상태 UI
  if (isLoading) {
    return (
      <div className="px-6 mb-10">
        <div className="bg-white rounded-[2.5rem] p-10 h-[280px] animate-pulse border border-gray-100 flex flex-col justify-center items-center gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-3xl" />
          <div className="w-48 h-6 bg-gray-100 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!user && !isLoading) {
    return (
      <div className="px-6 mb-10">
        <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
          <Award size={48} className="text-slate-300 mb-4" />
          <p className="text-slate-500 font-bold mb-6">
            로그인하고 나만의 여행 기록을
            <br />
            차곡차곡 쌓아보세요!
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-blue-100 active:scale-95 transition-all"
          >
            로그인하러 가기
          </button>
        </div>
      </div>
    );
  }

  const handleReviewClick = () => {
    if (reviewCount === 0) navigate("/history"); //여기서 여행기록으로 연결하고 -> 여행기록에서 휴게소 클릭하면 상세페이지로 이동하거나 바로 리뷰페이지로 이어지는 경험 필요함
  };

  const reviewCount = user?.reviews?.length || 0;
  const progress = getXpPercentage();

  // 2. 데이터 배열 정리
  const stats = [
    {
      label: "찜한 휴게소",
      value: `${savedRestAreas.length}곳`,
      icon: <Heart size={18} fill="currentColor" fillOpacity={0.2} />,
      iconBg: "bg-pink-50 text-pink-500",
      // 💡 추가: 찜 목록 페이지로 이동
      onClick: () => navigate("/place"),
      isSpecial: savedRestAreas.length > 0,
    },
    {
      label: "타이틀 개수",
      value: `${user?.userTitles?.length || 0}개`,
      icon: <Trophy size={18} />,
      iconBg: "bg-amber-50 text-amber-500",
    },
    {
      label: "작성한 리뷰",
      value:
        reviews.length === 0
          ? "첫 리뷰를 작성해보세요!"
          : `${reviews.length}개`,
      icon: <MessageSquare size={18} />,
      iconBg: "bg-blue-50 text-blue-500",
      isSpecial: reviews.length === 0,
      onClick: handleReviewClick,
    },
  ];

  return (
    <section className=" mb-10">
      <div className="max-w-[600px] mx-auto relative overflow-hidden bg-white rounded-[2.5rem] p-7 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] border border-slate-100 transition-all hover:shadow-[0_40px_80px_-15px_rgba(49,130,206,0.12)]">
        {/* 장식용 배경 광원 */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-100/50 rounded-full blur-[60px] pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-slate-100 rounded-full blur-[50px] pointer-events-none" />

        <article className="max-w-[480px] mx-auto">
          {/* 상단: 유저 정보 */}
          <div className="flex justify-between items-start mb-10 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-slate-900 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.1em] shadow-lg shadow-slate-200">
                  Lv.{user.level}{" "}
                  {user.currentTitle?.titleName || "신규 여행자"}
                </span>
              </div>
              <h3 className="text-[26px] font-black text-slate-900 leading-tight tracking-tighter">
                {user.nickname}님,
                <br />
                <span className="text-slate-400">반가워요!</span>
              </h3>
            </div>
            {/* 트로피 아이콘 박스 디자인 강화 */}
            <div className="w-16 h-16 bg-gradient-to-br from-slate-50 to-slate-100 rounded-[1.5rem] flex items-center justify-center text-slate-800 border border-white shadow-inner">
              <Trophy
                size={32}
                className="drop-shadow-sm"
                fill="#FFD700"
                fillOpacity={0.2}
              />
            </div>
          </div>

          {/* 통계 리스트 */}
          <div className="grid grid-cols-1 gap-2 mb-10">
            {stats.map((stat, index) => (
              <StatRow key={index} {...stat} />
            ))}
          </div>

          {/* 하단: 경험치 영역 */}
          <div className="space-y-4 relative z-10 bg-slate-50/50 p-5 rounded-3xl border border-slate-100/50">
            <div className="flex justify-between items-center px-1">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Next Level
                </span>
                <span className="text-[13px] font-bold text-slate-600">
                  {isLoading
                    ? "계산 중..."
                    : progress >= 100
                      ? "Level Up!"
                      : `${100 - ((user?.xp || 0) % 100)} XP 남았어요`}
                </span>
              </div>
              <span className="text-[20px] font-black text-[#3182CE] italic">
                {progress}%
              </span>
            </div>

            <div className="w-full h-4 bg-white rounded-full p-1 shadow-inner border border-slate-200/50 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 via-blue-600 to-blue-500 rounded-full transition-all duration-1000 relative shadow-sm"
                style={{ width: `${progress}%` }}
              >
                {/* 바 내부 광원 애니메이션 */}
                <div
                  className="absolute inset-0 w-full h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  style={{ backgroundSize: "200% 100%" }}
                />
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <button
            onClick={() => navigate("/history")}
            className="w-full mt-6 py-5 bg-slate-900 hover:bg-blue-600 text-white rounded-[1.5rem] flex items-center justify-center gap-3 transition-all font-black text-[15px] shadow-xl shadow-slate-200 active:scale-95"
          >
            나의 여행기록 보기
            <ChevronRight size={20} strokeWidth={3} />
          </button>
        </article>
      </div>
    </section>
  );
}

function StatRow({ label, value, icon, iconBg, isSpecial, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between py-4 border-b border-gray-50 last:border-0 group px-2 ${onClick ? "cursor-pointer active:scale-95" : ""} transition-all`}
    >
      <div className="flex items-center gap-4 w-full">
        {/* 아이콘 박스 */}
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all group-hover:rotate-6 shadow-sm shrink-0 ${iconBg}`}
        >
          {icon}
        </div>

        {/* 텍스트 영역: w-full과 min-w-0을 주어 내부 요소가 넘치지 않게 조절 */}
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">
            {label}
          </span>

          {/* 가로 정렬 컨테이너 */}
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-tighter leading-none transition-colors truncate
              ${isSpecial ? "text-[15px] text-blue-600" : "text-[16px] text-slate-800"}
            `}
            >
              {value}
            </span>

            {/* 아이콘: shrink-0으로 찌그러짐 방지 */}
            {isSpecial && (
              <ChevronRight
                size={16}
                className="text-blue-500 shrink-0 animate-pulse"
                strokeWidth={3}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
