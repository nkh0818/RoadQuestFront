import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TrendingUp, ChevronRight, Zap } from "lucide-react";
import useSearchStore from "../../store/useSearchStore";

export default function TrendSection({ data }) {
  const [keywords, setKeywords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const { setSearchTerm } = useSearchStore();

  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      setKeywords(data);
      setIsLoading(false);
      return;
    }

    const fetchRanking = async () => {
      try {
        const res = await axios.get("/api/ranking/search/daily");
        let result = [];
        if (Array.isArray(res.data)) result = res.data;
        else if (res.data && Array.isArray(res.data.data)) result = res.data.data;
        setKeywords(result);
      } catch (err) {
        console.error("Ranking Fetch Error:", err);
        setKeywords([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRanking();
  }, [data]);

  useEffect(() => {
    if (keywords.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % Math.min(keywords.length, 10));
    }, 3000);
    return () => clearInterval(interval);
  }, [keywords.length]);

  if (isLoading || !keywords || keywords.length === 0) return null;

  const currentKeyword = keywords[activeIndex];

  return (
    <section className="bg-white px-6 py-6">
      <div 
        onClick={() => { 
          if (currentKeyword) {
            setSearchTerm(currentKeyword); 
            navigate("/search"); 
          }
        }}
        className="group relative flex items-center gap-4 bg-white border border-slate-100 px-6 py-5 rounded-[2rem] cursor-pointer shadow-[0_15px_40px_-12px_rgba(0,0,0,0.08)] transition-all hover:shadow-[0_20px_50px_-12px_rgba(37,99,235,0.12)] hover:border-blue-100 active:scale-[0.98]"
      >
        <div className="flex items-center gap-2 shrink-0 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100/50">
          <Zap size={14} className="text-blue-600 fill-blue-600" />
          <span className="text-[11px] font-black text-blue-700 uppercase">검색어</span>
        </div>

        <div className="w-[1px] h-4 bg-slate-200 mx-1" />

        <div className="relative flex-1 h-[28px] overflow-hidden">
          {currentKeyword && (
            <div 
              key={activeIndex}
              className="flex items-center gap-3 animate-slide-up-text h-full"
            >
              <span className="text-[18px] font-black italic text-blue-600 w-5 shrink-0">
                {activeIndex + 1}
              </span>
              <span className="text-[16px] font-bold text-slate-900 truncate tracking-tight">
                {currentKeyword}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 group-hover:bg-blue-600 transition-colors">
          <ChevronRight size={16} className="text-slate-400 group-hover:text-white transition-colors" />
        </div>
      </div>
    </section>
  );
}