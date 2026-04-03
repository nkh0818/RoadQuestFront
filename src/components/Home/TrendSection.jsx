import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import axios from "axios";

const ITEM_HEIGHT = 60;
const VISIBLE_COUNT = 1;

const RANK_COLORS = [
  { icon: "trophy", color: "#FFD700", bg: "bg-amber-50", text: "text-amber-500" },
  { icon: "trophy", color: "#C0C0C0", bg: "bg-slate-100", text: "text-slate-400" },
  { icon: "trophy", color: "#CD7F32", bg: "bg-orange-50", text: "text-orange-400" },
];

function RankItem({ rank, name, isActive }) {
  const rankStyle = RANK_COLORS[rank - 1];

  return (
    <div
      className={`flex items-center gap-4 px-5 transition-colors duration-500 ${
        isActive ? "bg-blue-50/60" : "bg-transparent"
      }`}
      style={{ height: ITEM_HEIGHT }}
    >
      {/* 순위 뱃지 */}
      <div
        className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
          rankStyle ? rankStyle.bg : "bg-slate-50"
        }`}
      >
        {rankStyle ? (
          <Trophy
            size={17}
            fill={rankStyle.color}
            fillOpacity={0.9}
            stroke={rankStyle.color}
            strokeWidth={1.5}
          />
        ) : (
          <span className="text-[12px] font-black text-slate-400">{rank}</span>
        )}
      </div>

      {/* 휴게소 이름 */}
      <span
        className={`font-black text-[15px] tracking-tight leading-none truncate transition-colors duration-500 ${
          isActive ? "text-blue-600" : "text-slate-800"
        }`}
      >
        {name}
      </span>

      {/* 활성 인디케이터 */}
      {isActive && (
        <div className="ml-auto shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
      )}
    </div>
  );
}

export default function TrendSection() {
  const [keywords, setKeywords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionMs, setTransitionMs] = useState(700);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await axios.get("/api/ranking/search/daily");
        if (Array.isArray(response.data)) {
          setKeywords(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          setKeywords(response.data.data);
        }
      } catch (error) {
        console.error("랭킹 로드 실패:", error);
        setKeywords([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRanking();
  }, []);

  // 3초마다 다음 아이템으로 슬라이드
  useEffect(() => {
    if (keywords.length === 0) return;
    const id = setInterval(() => {
      setTransitionMs(700);
      setCurrentIndex((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(id);
  }, [keywords]);

  // 복사본(마지막) 도달 시 → 전환 완료 후 0으로 즉시 스냅
  useEffect(() => {
    if (keywords.length === 0 || currentIndex !== keywords.length) return;
    const snap = setTimeout(() => {
      setTransitionMs(0);
      setCurrentIndex(0);
      setTimeout(() => setTransitionMs(700), 50);
    }, 750); // 700ms 전환 완료 + 여유
    return () => clearTimeout(snap);
  }, [currentIndex, keywords.length]);

  // 마지막 자리에 첫 번째 아이템 복사본 추가
  const duplicated = keywords.length > 0 ? [...keywords, keywords[0]] : [];
  const containerHeight = VISIBLE_COUNT * ITEM_HEIGHT;

  return (
    <section className="px-5 py-4 bg-transparent">
      {/* 헤더 */}
      <div className="flex justify-between items-end mb-8 px-1">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 w-1.5 h-1.5 rounded-full animate-pulse" />
            <p className="text-blue-600 font-black text-[12px] uppercase tracking-[0.2em]">
              LIVE HOT TREND
            </p>
          </div>
          <h3 className="text-[26px] font-black text-slate-900 tracking-tighter leading-none">
            지금 <span className="text-blue-600">사람들이 제일 많이 검색하는</span> 휴게소예요!
          </h3>
        </div>
      </div>

      {/* 카드 컨테이너 */}
      <div className="bg-white rounded-[2.2rem] py-5 shadow-[0_15px_45px_-12px_rgba(0,0,0,0.06)] border border-slate-100/60 overflow-hidden">
        {isLoading ? (
          /* 스켈레톤 */
          <div className="flex items-center gap-4 px-5 animate-pulse" style={{ height: ITEM_HEIGHT }}>
            <div className="w-9 h-9 bg-slate-100 rounded-2xl shrink-0" />
            <div className="h-4 bg-slate-100 rounded-lg flex-1" />
          </div>
        ) : keywords.length === 0 ? (
          <div
            className="flex items-center justify-center text-slate-400 text-[13px] font-bold"
            style={{ height: containerHeight }}
          >
            랭킹 데이터를 불러오는 중...
          </div>
        ) : (
          /* 슬라이더 뷰포트 */
          <div
            style={{ height: containerHeight, overflow: "hidden" }}
          >
            <div
              style={{
                transform: `translateY(-${currentIndex * ITEM_HEIGHT}px)`,
                transition: `transform ${transitionMs}ms ease`,
              }}
            >
              {duplicated.map((name, i) => (
                <RankItem
                  key={i}
                  rank={(i % keywords.length) + 1}
                  name={name}
                  isActive={i % keywords.length === currentIndex % keywords.length}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
