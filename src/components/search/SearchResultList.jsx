import React from "react";
import { Star, Fuel, SearchX, ChevronRight, MapPin, Store } from "lucide-react";

export default function SearchResultList({
  items,
  sortBy,
  setSortBy,
  onItemClick,
}) {
  const handleReset = () => {
    window.location.reload();
  };

  return (
    <section className="flex-1 min-h-0 bg-[#F8FAFC] rounded-t-[2.5rem] shadow-[0_-20px_60px_rgba(0,0,0,0.1)] z-20 -mt-8 flex flex-col overflow-hidden border-t border-white/50">
      <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 mb-2 shrink-0 opacity-50" />

      <div className="px-7 py-5 flex flex-col gap-5 shrink-0">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[11px] font-black text-blue-500 uppercase tracking-widest mb-1">
              Stations
            </p>
            <h3 className="font-black text-[22px] text-slate-900 tracking-tight leading-none">
              전국 휴게소{" "}
              <span className="text-blue-600 ml-1">{items.length}</span>
            </h3>
          </div>
        </div>

        <div className="flex gap-2">
          <SortChip
            label="거리순"
            active={sortBy === "distance"}
            onClick={() => setSortBy("distance")}
          />
          <SortChip
            label="유가순"
            active={sortBy === "price"}
            onClick={() => setSortBy("price")}
          />
        </div>
      </div>

      {/* 3. 리스트 영역 */}
      <div className="flex-1 overflow-y-auto px-6 scrollbar-hide">
        {items.length > 0 ? (
          <div className="space-y-4 pt-1 pb-32">
            {items.map((item) => (
              <div
                key={item.dbName}
                onClick={() => onItemClick(item.stdRestCd)}
                className="group flex gap-4 p-4 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:border-blue-200 active:scale-[0.97] transition-all duration-300 cursor-pointer"
              >
                {/* 썸네일 */}
                <div className="w-22 h-22 rounded-[1.5rem] overflow-hidden shrink-0 bg-slate-100 shadow-inner flex items-center justify-center">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      alt={item.dbName}
                    />
                  ) : (
                    <Store className="w-10 h-10 text-slate-300 group-hover:scale-110 transition-transform duration-500" />
                  )}
                </div>

                {/* 정보 영역 */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-black text-[17px] text-slate-900 truncate tracking-tight group-hover:text-blue-600 transition-colors">
                        {item.dbName}
                      </h4>
                      <div className="flex items-center gap-1 text-blue-600 shrink-0 ml-2">
                        <MapPin
                          size={12}
                          fill="currentColor"
                          className="opacity-20"
                        />
                        <span className="text-[14px] font-black tracking-tighter">
                          {item.distance ? `${item.distance}km` : "0.0km"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg">
                        <Star
                          size={12}
                          className="fill-amber-400 text-amber-400"
                        />
                        <span className="text-[12px] font-black text-amber-700">
                          {item.rating || "4.5"}
                        </span>
                      </div>
                      <span className="text-slate-300 text-[11px] font-bold uppercase tracking-tighter">
                        #{item.tags?.[0] || "추천휴게소"}
                      </span>
                    </div>
                  </div>

                  {/* 하단 유가 정보 박스 (개선된 디자인) */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                      <div className="w-5 h-5 bg-blue-600 rounded-md flex items-center justify-center shadow-sm">
                        <Fuel size={10} className="text-white" />
                      </div>
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-[14px] font-black text-slate-800 tracking-tighter">
                          {item.gasolinePrice?.toLocaleString() || "0"}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          원
                        </span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* 4. 검색 결과 없음 */
          <div className="flex flex-col items-center justify-center pt-20 pb-32 text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-slate-200 blur-3xl opacity-30 animate-pulse" />
              <div className="relative w-24 h-24 bg-white rounded-[2.5rem] shadow-xl flex items-center justify-center">
                <SearchX size={40} className="text-slate-300" />
              </div>
            </div>
            <h4 className="text-slate-900 font-black text-[20px] mb-2 tracking-tight">
              검색 결과가 없어요
            </h4>
            <p className="text-slate-400 text-[14px] leading-relaxed font-bold max-w-[200px] mx-auto">
              다른 키워드나 태그로
              <br />
              다시 한번 검색해 보세요.
            </p>
            <button
              onClick={handleReset}
              className="mt-10 px-8 py-4 bg-slate-900 text-white text-[14px] font-black rounded-2xl shadow-xl shadow-slate-200 active:scale-95 transition-all"
            >
              전체 목록 보기
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* --- 서브 컴포넌트: 정렬 칩 --- */
function SortChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-2xl text-[13px] font-black transition-all border-2 ${
        active
          ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 scale-105"
          : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );
}
