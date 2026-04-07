import React from "react";
import { Trophy, Medal, Award, Star } from "lucide-react";

export default function UserExplorerRanking({ data }) {
  if (!data || data.length === 0) return null;

  const top3 = data.slice(0, 3);
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);

  const rankConfigs = {
    1: {
      height: "h-[240px]", // 높이 살짝 보정
      icon: <Trophy className="text-white fill-white" size={32} />, // 1등은 화이트 아이콘
      label: "1st",
      boxClass: "bg-blue-600 border-blue-600 shadow-[0_25px_50px_-12px_rgba(37,99,235,0.3)]", 
      textClass: "text-white",
      subTextClass: "text-blue-100",
      badgeClass: "bg-white text-blue-600"
    },
    2: {
      height: "h-[200px]",
      icon: <Medal className="text-blue-600" size={28} />,
      label: "2nd",
      boxClass: "bg-white border-slate-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]",
      textClass: "text-slate-900",
      subTextClass: "text-slate-400",
      badgeClass: "bg-blue-600 text-white"
    },
    3: {
      height: "h-[180px]",
      icon: <Award className="text-blue-600" size={26} />,
      label: "3rd",
      boxClass: "bg-white border-slate-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]",
      textClass: "text-slate-900",
      subTextClass: "text-slate-400",
      badgeClass: "bg-blue-600 text-white"
    },
  };

  return (
    <section className="bg-white px-6 py-16">
      <div className="flex flex-col items-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full mb-3 border border-blue-100">
          <Star className="fill-blue-600 text-blue-600" size={14} />
          <span className="text-[11px] font-black text-blue-700 uppercase tracking-widest text-center">Hall of Fame</span>
        </div>
        <h2 className="text-[28px] font-black text-slate-950 tracking-tighter text-center">
          이달의 <span className="text-blue-600">탐험가</span>
        </h2>
        <p className="text-[14px] text-slate-400 font-bold mt-1">최고의 리뷰러 TOP 3를 소개합니다</p>
      </div>

      <div className="flex items-end justify-center gap-4 max-w-2xl mx-auto">
        {podiumOrder.map((user) => {
          const actualRank = data.findIndex((u) => u.id === user.id) + 1;
          const config = rankConfigs[actualRank];

          return (
            <div
              key={user.id}
              className={`flex-1 flex flex-col items-center justify-center rounded-[2.5rem] border transition-all duration-500 hover:-translate-y-2 ${config.boxClass} ${config.height}`}
            >
              <div className="mb-4 flex flex-col items-center">
                {config.icon}
                <span className={`text-[10px] font-black uppercase mt-1.5 tracking-wider ${config.subTextClass}`}>
                  {config.label}
                </span>
              </div>

              <div className="text-center w-full px-4 mb-4">
                <h3 className={`text-[17px] font-black tracking-tight leading-tight truncate ${config.textClass}`}>
                  {user.nickname}
                </h3>
                <div className={`inline-block mt-2 px-2.5 py-0.5 text-[10px] font-black rounded-full shadow-sm max-w-[90%] truncate ${config.badgeClass}`}>
                  {user.currentTitle || "정복자"}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <span className={`text-[12px] font-black ${config.textClass}`}>
                  LV.{user.level}
                </span>
                <span className={`text-[10px] font-bold ${config.subTextClass}`}>
                  {user.reviewCount} 리뷰
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}