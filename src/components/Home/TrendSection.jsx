import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useSearchStore from "../../store/useSearchStore";

const ITEM_HEIGHT = 60;

const RANK_COLORS = [
  { icon: "trophy", color: "#FFD700", bg: "bg-amber-50", text: "text-amber-500" },
  { icon: "trophy", color: "#C0C0C0", bg: "bg-slate-100", text: "text-slate-400" },
  { icon: "trophy", color: "#CD7F32", bg: "bg-orange-50", text: "text-orange-400" },
];

function RankItem({ rank, name, isActive, animKey, onClick }) {
  const rankStyle = RANK_COLORS[rank - 1];

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 px-5 cursor-pointer transition-colors duration-300 hover:bg-blue-50/60 active:bg-blue-100/60 ${
        isActive ? "bg-blue-50/40" : "bg-transparent"
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
      <div className="overflow-hidden flex-1 min-w-0">
        <span
          key={isActive ? animKey : undefined}
          className={`block font-black text-[20px] tracking-tight leading-none truncate transition-colors duration-300 ${
            isActive
              ? "text-blue-600 animate-slide-up-text"
              : "text-slate-800"
          }`}
        >
          {name}
        </span>
      </div>
    </div>
  );
}

export default function TrendSection() {
  const [keywords, setKeywords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const navigate = useNavigate();
  const { setSearchTerm } = useSearchStore();

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

  // 2초마다 active 아이템 순환
  useEffect(() => {
    if (keywords.length === 0) return;
    const count = Math.min(keywords.length, 3);
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % count);
      setAnimKey((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(id);
  }, [keywords]);

  const handleKeywordClick = (keyword) => {
    setSearchTerm(keyword);
    navigate("/search");
  };

  const visibleKeywords = keywords.slice(0, 3);

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
          <h3 className="text-[18px] font-black text-slate-900 tracking-tighter leading-none">
            지금 <span className="text-blue-600">사람들이 제일 많이 검색하는</span> 휴게소예요!
          </h3>
        </div>
      </div>

      {/* 카드 컨테이너 */}
      <div className="bg-white rounded-[2.2rem] py-5 shadow-[0_15px_45px_-12px_rgba(0,0,0,0.06)] border border-slate-100/60 overflow-hidden">
        {isLoading ? (
          /* 스켈레톤 3개 */
          [0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-5 animate-pulse"
              style={{ height: ITEM_HEIGHT }}
            >
              <div className="w-9 h-9 bg-slate-100 rounded-2xl shrink-0" />
              <div className="h-4 bg-slate-100 rounded-lg flex-1" />
            </div>
          ))
        ) : keywords.length === 0 ? (
          <div
            className="flex items-center justify-center text-slate-400 text-[16px] font-bold"
            style={{ height: ITEM_HEIGHT * 3 }}
          >
            랭킹 데이터를 수집하는 중입니다...
          </div>
        ) : (
          visibleKeywords.map((name, i) => (
            <RankItem
              key={i}
              rank={i + 1}
              name={name}
              isActive={i === activeIndex}
              animKey={animKey}
              onClick={() => handleKeywordClick(name)}
            />
          ))
        )}
      </div>
    </section>
  );
}
