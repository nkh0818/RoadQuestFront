import React from "react";
import { Heart, Navigation } from "lucide-react";
import { useSavedStore } from "../../store/useSavedStore";
import SubHeader from "../common/SubHeader";

export default function DetailHero({ data }) {
  const { toggleSave, isSaved } = useSavedStore();
  const saved = isSaved(data?.stdRestCd);

  if (!data) return null;

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
    p-3 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] 
    border-2 shadow-lg flex items-center justify-center
    ${
      saved
        ? "bg-rose-500 border-rose-500 text-white scale-110"
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
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1545143333-11bbba59718d?q=80&w=2000')] bg-cover bg-center opacity-60 scale-110 group-hover:scale-100 transition-transform duration-[5000ms]" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-transparent to-slate-950 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40 z-10" />
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-48 px-8">
        
        {/* 타이틀 & 설명 */}
        <div className="text-center space-y-4 mb-12">
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-6 bg-blue-500/40" />
            <span className="text-[13px] font-black text-blue-400 uppercase tracking-[0.4em]">{data.routeName}</span>
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
