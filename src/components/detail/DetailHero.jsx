import React from "react";
import { Heart, Navigation } from "lucide-react";
import { useSavedStore } from "../../store/useSavedStore";
import SubHeader from "../common/SubHeader";
import KakaoMap from "../search/KakaoMap";

export default function DetailHero({ data }) {
  const { toggleSave, isSaved } = useSavedStore();
  const saved = isSaved(data?.stdRestCd);

  if (!data) return null;

  const center = { lat: data.latitude, lng: data.longitude };
  const locations = [
    { lat: data.latitude, lng: data.longitude, name: data.name },
  ];

  console.log(center);
  console.log("데이터 이름 타입 확인:", typeof data.name, data.name);

  return (
    <section className="relative h-[100vh] w-full shrink-0 overflow-hidden font-sans group bg-slate-900">
      <div className="absolute top-0 left-0 right-0 z-50">
        <SubHeader
          title={
            <span className="text-[#2D3748] font-bold text-[18px] tracking-tighter">
              휴게소 상세 보기
            </span>
          }
          className="bg-transparent border-none"
          rightElement={
            <button
              onClick={() => toggleSave(data)}
              className={`
    p-3 rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] 
    border-2 flex items-center justify-center
    ${
      saved
        ? "text-rose-500 scale-130 bg-transparent border-transparent"
        : "bg-gray-600/20 backdrop-blur-md border-white/20 text-white hover:bg-gray-600/40"
    }
    active:scale-90
  `}
            >
              <Heart
                size={20}
                className={`transition-transform duration-300 ${saved ? "animate-heart-pop" : ""}`}
                fill={saved ? "currentColor" : "none"}
                strokeWidth={2.5}
              />
            </button>
          }
        />
      </div>

      {/* 배경 영역: 맵 또는 대표 이미지 */}
      <div className="absolute inset-0 z-0 h-full w-full">
        {/* 좌표가 확실히 있을 때만 컴포넌트 렌더링 */}
        {center.lat && center.lng && (
          <div className="w-full h-full grayscale-[30%] opacity-80">
            <KakaoMap center={center} locations={locations} />
          </div>
        )}
        {/* 오버레이들 */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-800 via-slate-100/0 to-transparent z-10" />
      </div>

      {/* 콘텐츠 영역 */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-48 px-8">
        {/* 타이틀 & 설명 */}
        <div className="text-center space-y-4 mb-12">
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-6 bg-blue-500/40" />
            <span className="text-[13px] font-black text-blue-400 uppercase tracking-[0.4em]">
              {data.routeName}
            </span>
            <div className="h-[1px] w-6 bg-blue-500/40" />
          </div>
          <h2 className="text-[52px] font-black leading-none tracking-tighter text-white drop-shadow-2xl">
            {data.name}
          </h2>
        </div>

        {/* 메인 액션 버튼 */}
        <div className="w-full max-w-sm space-y-3">
          <button className="flex items-center justify-center gap-3 w-full py-5 bg-[#3182CE] text-white rounded-[2rem] font-black text-[18px] shadow-2xl shadow-blue-900/40 active:scale-95 transition-all hover:bg-blue-500">
            <Navigation size={20} fill="currentColor" />
            카카오맵 길찾기
          </button>
        </div>
      </div>

      {/* 스크롤 안내 */}
      <div className="absolute bottom-10 left-0 right-0 z-30 flex flex-col items-center gap-3">
        <span className="text-white/20 text-[10px] font-black tracking-[0.4em] uppercase animate-pulse">
          Scroll Down
        </span>

        <div className="group relative w-[1.5px] h-14 overflow-hidden">
          <div className="absolute inset-0 bg-white/10 rounded-full" />

          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-blue-400 to-transparent animate-scroll-line" />
        </div>
      </div>
    </section>
  );
}
