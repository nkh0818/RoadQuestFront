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
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    getFilteredItems,
    fetchInitialData,
    page,
    hasMore,
    isLoading,
  } = useSearchStore();

  const [inputValue, setInputValue] = useState(searchTerm);
  const [hotKeywords, setHotKeywords] = useState([]);
  const filteredAndSortedItems = getFilteredItems();

  // 초기 데이터 및 핫키워드 로드
  useEffect(() => {
    fetchInitialData(0);
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

  //옵저버 설정
  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchInitialData(page + 1);
        }
      },
      { threshold: 0.5 },
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

  return (
    <div className="flex-1 min-h-screen w-full mx-auto bg-white flex flex-col relative overflow-hidden">
      {/* 고정 상단 영역 */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-50">
        <SubHeader>
          <div className="flex-1 bg-slate-100/80 rounded-full px-5 py-4 flex items-center gap-3 group focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <Search
              size={18}
              className={inputValue ? "text-blue-600" : "text-slate-400"}
            />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="찾으시는 휴게소가 어디인가요?"
              className="bg-transparent outline-none text-[15px] w-full font-bold text-slate-800 placeholder:text-slate-400"
            />
            {inputValue && (
              <button
                onClick={() => {
                  setInputValue("");
                  setSearchTerm("");
                }}
              >
                <X size={18} className="text-slate-300 hover:text-slate-500" />
              </button>
            )}
          </div>
        </SubHeader>

        {/* 핫 트렌드 가로 스크롤 */}
        <div className="px-6 py-3 overflow-x-auto scrollbar-hide flex gap-2 items-center">
          <span className="shrink-0 text-[11px] font-black text-blue-600 uppercase tracking-tighter mr-1">
            지금 제일 핫해요!
          </span>
          {hotKeywords?.map((word) => (
            <button
              key={word}
              onClick={() => {
                setInputValue(word);
                setSearchTerm(word);
              }}
              className="shrink-0 px-4 py-1.5 bg-slate-50 rounded-full text-[13px] font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all border border-slate-100"
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      {/* 메인 리스트 영역 */}
      <div className="flex-1 flex flex-col overflow-y-auto scrollbar-hide">
        {/* 1. 최초 로딩 처리: 데이터가 아예 없고(null) 로딩 중일 때는 리스트 대신 큰 로더 노출 */}
        {isLoading && filteredAndSortedItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] gap-3">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="text-slate-500 font-bold">
              휴게소 정보를 불러오는 중입니다...
            </p>
          </div>
        ) : (
          <>
            {/* 2. 실제 리스트 노출 (데이터가 있을 때) */}
            {filteredAndSortedItems.length > 0 ? (
              <SearchResultList
                items={filteredAndSortedItems}
                sortBy={sortBy}
                setSortBy={setSortBy}
                onItemClick={(id) => navigate(`/detail/${id}`)}
              />
            ) : (
              /* 3. 로딩이 끝났는데도 데이터가 0개일 때만 "결과 없음" 노출 */
              !isLoading && (
                <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
                  <p className="text-slate-400 font-bold text-[15px]">
                    찾으시는 휴게소가 없습니다.
                  </p>
                  <p className="text-slate-300 text-[13px] mt-1">
                    검색어를 다시 확인해 주세요.
                  </p>
                </div>
              )
            )}
          </>
        )}

        {/* 4. 하단 무한 스크롤 관찰 영역 */}
        <div
          ref={observerRef}
          className="h-40 flex items-center justify-center bg-[#F8FAFC]"
        >
          {/* 추가 데이터를 가져올 때만 하단 스피너 노출 */}
          {isLoading && filteredAndSortedItems.length > 0 && (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              <p className="text-[12px] font-bold text-slate-400">
                데이터 로드 중...
              </p>
            </div>
          )}

          {/* 더 이상 데이터가 없을 때 */}
          {!hasMore && filteredAndSortedItems.length > 0 && (
            <p className="text-[13px] font-bold text-slate-300">
              모든 휴게소를 불러왔습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
