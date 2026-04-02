import React, { useState } from "react";
import {
  MapPin,
  Calendar,
  ChevronRight,
  Share2,
  TrendingUp,
  Award,
} from "lucide-react";
import ShareModal from "../common/ShareModal";
import SubHeader from "../common/SubHeader";

export default function HistoryView() {
  const [selectedLog, setSelectedLog] = useState(null);

  const driveLogs = [
    {
      id: 1,
      date: "2024.03.22",
      route: "서울 → 부산",
      distance: "380km",
      stops: ["안성", "추풍령", "칠곡"],
    },
    {
      id: 2,
      date: "2024.03.15",
      route: "서울 → 강릉",
      distance: "220km",
      stops: ["가평", "내린천"],
    },
  ];

  const getTheme = (id) => {
    const themes = {
      1: {
        gradient: "from-rose-400 to-orange-400",
        iconBg: "bg-rose-50",
        point: "bg-rose-500",
        text: "text-rose-600",
      },
      2: {
        gradient: "from-blue-400 to-indigo-500",
        iconBg: "bg-blue-50",
        point: "bg-blue-500",
        text: "text-blue-600",
      },
      // 기본값
      default: {
        gradient: "from-slate-400 to-slate-600",
        iconBg: "bg-slate-50",
        point: "bg-slate-500",
        text: "text-slate-600",
      },
    };
    return themes[id] || themes.default;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans">
      <SubHeader
        showBack={true}
        title={
          <span className="text-slate-900 font-black tracking-tighter">
            여행 <span className="text-blue-600">히스토리</span>
          </span>
        }
        className="bg-white/80 backdrop-blur-xl border-b border-slate-100"
        rightElement={<TrendingUp size={20} />}
      />
      {/* 상단 헤더 */}
      <header className="px-6 pt-8 pb-10 bg-white rounded-b-[3.5rem] shadow-sm border-b border-slate-100">
        <div className="flex items-center gap-2 mb-6 px-2">
          <Award size={20} className="text-amber-500" />
          <span className="text-[16px] font-black text-slate-400 uppercase tracking-widest">
            나의 기록
          </span>
        </div>

        <div className="max-w-[480px] mx-auto grid grid-cols-2 gap-4">
          <StatCard
            label="총 주행 거리"
            value="1,240"
            unit="km"
            icon={<TrendingUp size={16} />}
            color="text-blue-600"
          />
          <StatCard
            label="방문 휴게소"
            value="12"
            unit="곳"
            icon={<MapPin size={16} />}
            color="text-emerald-500"
          />
        </div>
      </header>

      {/* 메인 */}
      <main className="p-6 space-y-8">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[18px] font-black text-slate-900 tracking-tight">
            최근 여행 리포트
          </h3>
          <span className="text-[12px] font-bold text-slate-400">
            Total {driveLogs.length}
          </span>
        </div>

        {driveLogs.map((log) => {
          const style = getTheme(log.id);

          return (
            <div
              key={log.id}
              className="max-w-[480px] mx-auto group bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all duration-500 cursor-pointer"
            >
              {/* 상단 카드 배경 */}
              <div
                className={`p-7 bg-gradient-to-br ${style.gradient} relative overflow-hidden`}
              >
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

                <div className="relative z-10 text-white">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white/90 text-[12px] font-bold">
                      <Calendar size={14} /> {log.date}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLog(log);
                      }}
                      className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl hover:bg-white text-white hover:text-slate-900 transition-all active:scale-90"
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                  {/* ------------------------------------------ */}

                  <h4 className="text-[26px] font-black text-white tracking-tighter mb-1">
                    {log.route}
                  </h4>
                  <p className="text-[14px] font-bold text-white/80 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    {log.distance} 주행 완료
                  </p>
                </div>
              </div>

              {/* 하단 방문지 리스트 */}
              <div className="p-7">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-1 h-4 rounded-full ${style.point}`} />
                  <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest">
                    Visited Rest Areas
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {log.stops.map((stop, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 ${style.iconBg} px-4 py-2.5 rounded-2xl text-[13px] font-black text-slate-700`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${style.point}`}
                      />
                      {stop}
                    </div>
                  ))}
                  <div className="flex items-center gap-2 ml-auto text-slate-300">
                    <span className="text-[11px] font-black">
                      {log.stops.length}곳 방문
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </main>

      <ShareModal
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        log={selectedLog || {}}
      />
    </div>
  );
}

/* --- 통계 카드 서브 컴포넌트 --- */
function StatCard({ label, value, unit, icon, color }) {
  return (
    <div className="p-5 rounded-[2rem] bg-[#F8FAFC] border border-slate-100 shadow-inner group hover:bg-white hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-2 rounded-lg bg-white shadow-sm ${color}`}>
          {icon}
        </div>
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-tighter">
          {label}
        </p>
      </div>
      <p className={`text-[24px] font-black tracking-tighter ${color}`}>
        {value}
        <span className="text-[14px] text-slate-400 ml-1 font-bold">
          {unit}
        </span>
      </p>
    </div>
  );
}