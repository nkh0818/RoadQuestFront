import { useEffect, useRef } from "react";
import { X, Search, MapPin, Loader2 } from "lucide-react";
import useSearchStore from "../../store/useSearchStore";

// ⚠️ 백엔드 TODO: /api/restareas/search-name 응답에 latitude, longitude 필드 추가 필요
// 현재는 좌표가 없으므로 null로 전달 → ReviewForm에서 GPS 인증 불가 처리

export default function RestAreaSelectorModal({ onSelect, onClose }) {
  
  const inputRef = useRef(null);
  const { searchResults, isLoading, setSearchTerm, fetchInitialData, resetSearch } =
    useSearchStore();

  useEffect(() => {
    fetchInitialData(0);
    inputRef.current?.focus();
    return () => resetSearch();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };


  const handleSelect = (item) => {

    console.log("📍 모달에서 클릭한 아이템 원본:", item);

    onSelect({
      id: item.stdRestCd || item.restAreaCode || item.unitCode || item.id, 
      name: item.dbName || item.name || item.restAreaName,
      latitude: item.y || item.latitude || null,
      longitude: item.x || item.longitude || null,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[600px] bg-white rounded-t-[2rem] p-6 pb-safe max-h-[80dvh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[18px] font-black text-slate-900">휴게소 선택</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-slate-100 flex items-center justify-center active:scale-95"
          >
            <X size={18} strokeWidth={2.5} className="text-slate-500" />
          </button>
        </div>

        {/* 검색창 */}
        <div className="flex items-center gap-3 bg-slate-100 rounded-2xl px-4 py-3 mb-4">
          <Search size={18} strokeWidth={2.5} className="text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="휴게소 이름을 검색하세요"
            onChange={handleSearch}
            className="flex-1 bg-transparent text-[14px] font-bold text-slate-800 placeholder:text-slate-400 outline-none"
          />
          {isLoading && (
            <Loader2 size={16} strokeWidth={2.5} className="text-blue-500 animate-spin shrink-0" />
          )}
        </div>

        {/* 결과 리스트 */}
        <div className="flex-1 overflow-y-auto space-y-1 no-scrollbar">
          {!isLoading && searchResults.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <MapPin size={36} strokeWidth={2} className="mb-3 opacity-40" />
              <p className="text-[14px] font-bold">검색 결과가 없어요</p>
              <p className="text-[12px] mt-1">다른 이름으로 검색해 보세요</p>
            </div>
          )}

          {searchResults.map((item) => (
            <button
              key={item.stdRestCd || item.restAreaCode || item.id}
              type="button"
              onClick={() => handleSelect(item)}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-blue-50 active:bg-blue-100 transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                <MapPin size={18} strokeWidth={2.5} className="text-blue-600" />
              </div>
              <span className="text-[14px] font-black text-slate-800">
                {item.dbName || item.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
