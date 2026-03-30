import React, { useState } from "react";
import {
  MapPin,
  Navigation,
  Search,
  LocateFixed,
  ArrowRightLeft,
} from "lucide-react";

export default function HeroSection({ routeInfo, setRouteInfo, onSearch }) {
  const [isLocating, setIsLocating] = useState(false);

  const handleGetMyLocation = () => {
    if (!navigator.geolocation) {
      alert("GPS를 지원하지 않는 브라우저입니다.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setRouteInfo({
          ...routeInfo,
          start: `${longitude.toFixed(5)},${latitude.toFixed(5)}`,
        });
        setIsLocating(false);
        alert("현재 위치가 설정되었습니다!");
      },
      () => {
        setIsLocating(false);
        alert("위치 정보를 가져오지 못했습니다.");
      },
      { enableHighAccuracy: true },
    );
  };

  return (
    <section className="relative min-h-[480px] w-full bg-gradient-to-b from-[#1E40AF] via-[#3182CE] to-[#6366F1] rounded-b-[4rem] p-8 pt-20 pb-28 overflow-hidden shadow-2xl shadow-blue-200">
      
      {/* 배경 장식) */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-20%] left-[-10%] w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />

      <div className="max-w-[420px] relative z-10 mx-auto">
        <h2 className="text-white text-[38px] font-[900] leading-[1.1] tracking-tighter drop-shadow-md">
          여행, <br />
          <span className="text-blue-100">어디로 가시나요?</span>
        </h2>
        <p className="text-blue-50/80 font-bold mt-3 text-[16px] tracking-tight">
          고속도로 위 최고의 휴식을 찾아드릴게요.
        </p>

        {/* 🗺️ 경로 입력 폼 */}
        <div className="mt-12 relative max-w-[480px] mx-auto">
          
          {/* 출발지와 목적지를 잇는 선 */}
          <div className="absolute left-[27px] top-12 bottom-12 w-[2px] border-l-2 border-dotted border-white/30 z-0" />

          <div className="space-y-4 relative z-10">
            {/* 출발지 입력창 */}
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 rounded-full border-[3px] border-[#3182CE] bg-white shadow-sm" />
              </div>
              <input
                type="text"
                value={routeInfo.start}
                onChange={(e) => setRouteInfo({ ...routeInfo, start: e.target.value })}
                placeholder="어디서 출발할까요?"
                className="w-full bg-white rounded-[1.8rem] py-5 pl-14 pr-32 outline-none font-bold text-gray-900 placeholder:text-gray-400 focus:ring-4 focus:ring-white/20 transition-all shadow-[0_15px_30px_-5px_rgba(0,0,0,0.1)]"
              />
              <button
                onClick={handleGetMyLocation}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-50 hover:bg-slate-100 text-[#3182CE] px-4 py-2.5 rounded-2xl flex items-center gap-1.5 transition-all border border-slate-100 active:scale-95 shadow-sm"
              >
                {isLocating ? (
                  <div className="w-4 h-4 border-2 border-[#3182CE]/30 border-t-[#3182CE] rounded-full animate-spin" />
                ) : (
                  <LocateFixed size={16} strokeWidth={2.5} />
                )}
                <span className="text-[12px] font-black">현위치</span>
              </button>
            </div>

            {/* 목적지 입력창 */}
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3182CE]">
                <MapPin size={20} fill="currentColor" fillOpacity={0.2} strokeWidth={2.5} />
              </div>
              <input
                type="text"
                value={routeInfo.end}
                onChange={(e) => setRouteInfo({ ...routeInfo, end: e.target.value })}
                placeholder="어디로 갈까요?"
                className="w-full bg-white rounded-[1.8rem] py-5 pl-14 pr-6 outline-none font-bold text-gray-900 placeholder:text-gray-400 focus:ring-4 focus:ring-white/20 transition-all shadow-[0_15px_30px_-5px_rgba(0,0,0,0.1)]"
              />
            </div>

            {/* 경로 찾기 버튼 */}
            <button
              onClick={onSearch}
              className="w-full bg-slate-900 hover:bg-black text-white py-5 rounded-[1.8rem] font-black text-[17px] flex items-center justify-center gap-3 shadow-2xl shadow-blue-900/40 active:scale-[0.97] transition-all mt-4"
            >
              <Navigation size={22} fill="white" className="rotate-45" />
              휴게소 탐색 시작
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuickTag({ icon, label, bgColor, textColor }) {
  return (
    <button
      className={`flex items-center gap-2 ${bgColor} backdrop-blur-sm border border-white/20 px-5 py-2.5 rounded-full whitespace-nowrap active:scale-95 transition-all`}
    >
      <span className="text-base">{icon}</span>
      <span className={`${textColor} text-[14px] font-bold`}>{label}</span>
    </button>
  );
}
