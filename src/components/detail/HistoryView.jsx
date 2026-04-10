import React, { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  TrendingUp,
  Award,
  Quote,
  Share2,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import SubHeader from "../../components/common/SubHeader";
import ShareModal from "../../components/common/ShareModal";
import { useHistoryStore } from "../../store/useHistoryStore";

//목업 데이터
const MOCK_HISTORY = [
  {
    id: 101,
    date: "2026.04.10",
    title: "영동고속도로 식도락 여행",
    routeName: "영동고속도로",
    aiSummary:
      "횡성휴게소의 한우 국밥과 덕평의 산책로가 완벽한 조화를 이룬 여정이었어요. 전반적으로 평점이 높은 명소들만 쏙쏙 골라 방문하셨네요!",
    stops: [
      { name: "덕평자연휴게소", score: 4.8 },
      { name: "여주휴게소", score: 4.2 },
      { name: "횡성휴게소", score: 4.9 },
    ],
  },
  {
    id: 102,
    date: "2026.04.08",
    title: "경부선 뷰 맛집 탐험",
    routeName: "경부고속도로",
    aiSummary:
      "금강휴게소의 탁 트인 강변 뷰가 이번 여정의 하이라이트였네요. 운전의 피로를 싹 날려버릴 수 있는 힐링 코스였습니다.",
    stops: [
      { name: "안성휴게소", score: 4.5 },
      { name: "금강휴게소", score: 4.9 },
      { name: "추풍령휴게소", score: 4.0 },
    ],
  },
  {
    id: 103,
    date: "2026.04.05",
    title: "서해안 퀘스트 정복",
    routeName: "서해안고속도로",
    aiSummary:
      "행담도 휴게소는 규모가 커서 볼거리가 많죠! 서해바다 내음을 만끽하며 즐거운 간식 타임을 가지셨군요.",
    stops: [
      { name: "매송휴게소", score: 4.1 },
      { name: "행담도휴게소", score: 4.7 },
    ],
  },
];

export default function HistoryView() {
  const [selectedLog, setSelectedLog] = useState(null);

  // 통계는 실제 데이터를 쓰고, 로그는 목업을 씁니다.
  const { userStats, fetchUserStats } = useHistoryStore();

  useEffect(() => {
    fetchUserStats(); // 유저 LV, XP 등은 실제 데이터 반영
  }, []);

  // 실제 로그 대신 목업 데이터 사용
  const historyLogs = MOCK_HISTORY;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans text-slate-900">
      <SubHeader
        showBack={true}
        title={
          <span className="font-black tracking-tighter">
            나의 <span className="text-blue-600">퀘스트 기록</span>
          </span>
        }
        className="bg-white/80 backdrop-blur-xl border-b border-slate-100"
      />

      <header className="px-6 pt-8 pb-10 bg-white rounded-b-[3.5rem] shadow-sm border-b border-slate-100">
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Award size={28} />
            </div>
            <div>
              <p className="text-[11px] font-black text-blue-600 uppercase tracking-widest mb-0.5">
                현재 칭호
              </p>
              <h2 className="text-[20px] font-black tracking-tight leading-none">
                {userStats.currentTitle &&
                userStats.currentTitle !== "칭호 없음"
                  ? userStats.currentTitle
                  : userStats.userTitles?.[0] || "신참 여행자"}
              </h2>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-bold text-slate-400">
              활동 레벨
            </p>
            <p className="text-[18px] font-black text-slate-900">
              LV. {userStats.level || 5}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-[480px] mx-auto">
          <StatCard
            label="보유 경험치"
            value={userStats.xp || 1250}
            unit="XP"
            icon={<TrendingUp size={16} />}
            color="text-blue-600"
          />
          <StatCard
            label="정복한 휴게소"
            value={userStats.reviewCount || 8}
            unit="곳"
            icon={<MapPin size={16} />}
            color="text-emerald-500"
          />
        </div>
      </header>

      <main className="p-6">
        <div className="flex items-center justify-between mb-8 px-2">
          <h3 className="text-[18px] font-black tracking-tight">
            로드 퀘스트 리포트
          </h3>
          <Sparkles size={18} className="text-amber-400" />
        </div>

        <div className="space-y-12 relative">
          <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-200" />

          {historyLogs.map((log) => (
            <div key={log.id} className="relative pl-12 group">
              <div className="absolute left-0 top-1 w-10 h-10 bg-white rounded-full border-2 border-slate-200 flex items-center justify-center z-10 group-hover:border-blue-500 transition-colors">
                <div className="w-3 h-3 bg-slate-300 rounded-full group-hover:bg-blue-500 transition-colors" />
              </div>

              <div
                className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all duration-500 cursor-pointer"
                onClick={() => setSelectedLog(log)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar size={14} className="text-slate-400" />
                      <span className="text-[12px] font-bold text-slate-400">
                        {log.date}
                      </span>
                    </div>
                    <h4 className="text-[22px] font-black tracking-tighter">
                      {log.title}
                    </h4>
                  </div>
                </div>

                <div className="bg-blue-50/50 rounded-2xl p-4 mb-6 relative border border-blue-100/50">
                  <Quote
                    size={14}
                    className="text-blue-200 absolute top-3 left-3"
                  />
                  <p className="text-[13px] text-slate-600 leading-relaxed pl-5 font-medium">
                    {log.aiSummary}
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <MapPin size={12} /> Visited Points
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {log.stops.map((stop, i) => (
                      <div
                        key={i}
                        className="bg-white border border-slate-100 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full bg-blue-500`}
                        />
                        <span className="text-[12px] font-bold text-slate-700">
                          {stop.name}
                        </span>
                        <span className="text-[10px] font-black text-blue-600">
                          ★{stop.score}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-50 flex justify-between items-center text-slate-300">
                  <span className="text-[11px] font-bold italic">
                    {log.routeName}
                  </span>
                  <div className="flex items-center gap-1 text-blue-600 font-black text-[12px]">
                    상세보기 <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <ShareModal
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        log={selectedLog || {}}
      />
    </div>
  );
}

function StatCard({ label, value, unit, icon, color }) {
  return (
    <div className="p-5 rounded-[2.2rem] bg-white border border-slate-100 shadow-sm transition-transform hover:-translate-y-1">
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-2 rounded-xl bg-slate-50 ${color}`}>{icon}</div>
        <p className="text-[11px] font-black text-slate-400 uppercase">
          {label}
        </p>
      </div>
      <p
        className={`text-[26px] font-black tracking-tighter ${color} leading-none`}
      >
        {value}
        <span className="text-[14px] text-slate-300 ml-1 font-bold">
          {unit}
        </span>
      </p>
    </div>
  );
}
