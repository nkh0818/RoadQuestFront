import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useSearchStore from "../store/useSearchStore";
import SearchResultList from "../components/search/SearchResultList";
import SubHeader from "../components/common/SubHeader";
import { Search, X, Map as MapIcon, Loader2 } from "lucide-react";
import { fetchHotKeywords } from "../api/search";

export default function SearchPage() {
  const navigate = useNavigate();
  const observerRef = useRef(null);

  // Zustand 상태 추출
  const { 
    searchTerm, setSearchTerm, 
    sortBy, setSortBy, 
    getFilteredItems, 
    fetchInitialData,
    page, hasMore, isLoading 
  } = useSearchStore();

  const [inputValue, setInputValue] = useState(searchTerm);
  const [hotKeywords, setHotKeywords] = useState([]);

  // 1. 초기 데이터 및 핫키워드 로드
  useEffect(() => {
    fetchInitialData(0); // 첫 페이지 로드
    const getRanking = async () => {
      try {
        const data = await fetchHotKeywords();
        setHotKeywords(data);
      } catch (error) {
        console.log("에러 발생:", error);
        setHotKeywords([]);
      }
    };
    getRanking();
  }, []);

  // 2. 무한 스크롤 Observer 설정
  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchInitialData(page + 1); // 다음 페이지 호출
        }
      },
      { threshold: 0.5 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading, page]);

  // 3. 검색어 디바운싱
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 400);
    return () => clearTimeout(timer);
  }, [inputValue]);

  const filteredAndSortedItems = getFilteredItems();

  return (
    <div className="flex-1 min-h-screen w-full mx-auto bg-white flex flex-col relative overflow-hidden">
      
      {/* 고정 상단 영역 */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-50">
        <SubHeader>
          <div className="flex-1 bg-slate-100/80 rounded-full px-5 py-4 flex items-center gap-3 group focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <Search size={18} className={inputValue ? "text-blue-600" : "text-slate-400"} />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="찾으시는 휴게소가 어디인가요?"
              className="bg-transparent outline-none text-[15px] w-full font-bold text-slate-800 placeholder:text-slate-400"
            />
            {inputValue && (
              <button onClick={() => { setInputValue(""); setSearchTerm(""); }}>
                <X size={18} className="text-slate-300 hover:text-slate-500" />
              </button>
            )}
          </div>
        </SubHeader>

        {/* 핫 트렌드 가로 스크롤 */}
        <div className="px-6 py-3 overflow-x-auto no-scrollbar flex gap-2 items-center">
          <span className="shrink-0 text-[11px] font-black text-blue-600 uppercase tracking-tighter mr-1">지금 제일 핫해요!</span>
          {hotKeywords?.map((word) => (
            <button
              key={word}
              onClick={() => { setInputValue(word); setSearchTerm(word); }}
              className="shrink-0 px-4 py-1.5 bg-slate-50 rounded-full text-[13px] font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all border border-slate-100"
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      {/* 메인 리스트 영역 */}
      <div className="flex-1 flex flex-col overflow-y-auto scrollbar-hide">
        <SearchResultList
          items={filteredAndSortedItems}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onItemClick={(id) => navigate(`/detail/${id}`)}
        />
        
        {/* 무한 스크롤 바닥 감지 및 로더 */}
        <div ref={observerRef} className="h-40 flex items-center justify-center bg-[#F8FAFC]">
          {isLoading && (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              <p className="text-[12px] font-bold text-slate-400">데이터 로드 중...</p>
            </div>
          )}
          {!hasMore && filteredAndSortedItems.length > 0 && (
            <p className="text-[13px] font-bold text-slate-300">모든 휴게소를 불러왔습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}