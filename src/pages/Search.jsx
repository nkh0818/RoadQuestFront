import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSearchStore from "../store/useSearchStore";
import KakaoMapSection from "../components/search/KakaoMap";
import SearchResultList from "../components/search/SearchResultList";
import SubHeader from "../components/common/SubHeader";
import { Search, X } from "lucide-react";

export default function SearchPage() {
  const navigate = useNavigate();

  // Zustand에서 상태와 액션 추출
  const { searchTerm, setSearchTerm, sortBy, setSortBy, getFilteredItems } = useSearchStore();

  // 실제 검색만 디바운싱
  const [inputValue, setInputValue] = useState(searchTerm);

  // 디바운싱 로직: 입력을 멈추고 0.4초 뒤에 전역 스토어 업데이트
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
          <Search size={16} className={inputValue ? 'text-[#3182CE]' : 'text-slate-400'} />
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="휴게소 이름 검색" 
            className="bg-transparent outline-none text-[14px] w-full font-semibold text-slate-700 placeholder:text-slate-400" 
          />
          {inputValue && (
            <button 
              onClick={() => { setInputValue(''); setSearchTerm(''); }} 
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </SubHeader>

      {/* 지도 섹션 */}
      <section className="w-full h-[38vh] shrink-0 relative z-10 border-b border-gray-100">
        <KakaoMapSection 
          center={{ lat: 37.235, lng: 127.105 }} 
          locations={filteredAndSortedItems} 
        />
      </section>

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