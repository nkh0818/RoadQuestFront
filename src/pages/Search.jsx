import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSearchStore from "../store/useSearchStore";
import KakaoMapSection from "../components/search/KakaoMap";
import SearchResultList from "../components/search/SearchResultList";
import SubHeader from "../components/common/SubHeader";
import { Search, X } from "lucide-react";
import axios from "axios";

export default function SearchPage() {
  const navigate = useNavigate();

  // Zustand에서 상태와 액션 추출
  const { searchTerm, setSearchTerm, sortBy, setSortBy, getFilteredItems } =
    useSearchStore();

  // 실제 검색만 디바운싱
  const [inputValue, setInputValue] = useState(searchTerm);

  const [hotKeywords, setHotKeywords] = useState([]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setSearchTerm(inputValue);
    }
  };

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await axios.get("/api/ranking/search/daily");
        console.log("랭킹 데이터 확인:", response.data);

        if (Array.isArray(response.data)) {
          setHotKeywords(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          setHotKeywords(response.data.data);
        }
      } catch (error) {
        console.error("랭킹 로드 실패:", error);
        setHotKeywords([]);
      }
    };
    fetchRanking();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 400);
    return () => clearTimeout(timer);
  }, [inputValue, setSearchTerm]);

  const filteredAndSortedItems = getFilteredItems();

  return (
    <div className="flex-1 min-h-screen w-full mx-auto bg-gray-50 flex flex-col relative overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300 ease-out">
      {/* 검색 바 섹션 */}
      <SubHeader>
        <div className="flex-1 bg-gray-100/60 rounded-full px-4 py-4 flex items-center gap-2 group focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-50 transition-all">
          <Search
            size={16}
            className={inputValue ? "text-[#3182CE]" : "text-slate-400"}
          />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="휴게소 이름 검색"
            className="bg-transparent outline-none text-[14px] w-full font-semibold text-slate-700 placeholder:text-slate-400"
          />
          {inputValue && (
            <button
              onClick={() => {
                setInputValue("");
                setSearchTerm("");
              }}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </SubHeader>

      {/* 핫트렌드 */}
      <div className="px-6 py-3 overflow-x-auto no-scrollbar flex gap-2 bg-white">
        <span className="shrink-0 text-[12px] font-bold text-blue-600 flex items-center gap-1">
          현재 핫 트렌드
        </span>

        {hotKeywords && hotKeywords.length > 0 ? (
          hotKeywords.map((word) => (
            <button
              key={word}
              onClick={() => {
                setInputValue(word);
                setSearchTerm(word);
              }}
              className="shrink-0 px-3 py-1 bg-gray-100 rounded-full text-[12px] text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              {word}
            </button>
          ))
        ) : (
          <span className="text-[12px] text-slate-400">
            데이터를 불러오는 중...
          </span>
        )}
      </div>

      {/* 맵 */}
      <KakaoMapSection />

      {/* 리스트 섹션 */}
      <SearchResultList
        items={filteredAndSortedItems}
        sortBy={sortBy}
        setSortBy={setSortBy} // 리스트 안의 탭을 누르면 전역 상태 변경
        onItemClick={(id) => navigate(`/detail/${id}`)}
      />
    </div>
  );
}
