// DiningItem.jsx — 메뉴 목록의 개별 아이템 컴포넌트 (음식 이모지 조건부 선택 및 BEST 뱃지 표시)
import React from "react";

export default function DiningItem({ item }) {
  return (
    <div className="group flex items-start gap-4 p-4 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-blue-200 transition-all active:scale-[0.98]">

      {/* 아이콘 */}
      <div className="w-14 h-14 bg-orange-50 rounded-[1.5rem] flex items-center justify-center text-[24px] group-hover:bg-orange-100 transition-colors shrink-0">
        {item.foodName.includes("가스") || item.foodName.includes("가츠") || item.foodName.includes("까스")
          ? "🍱"
          : item.foodName.includes("면") ? "🍜" : "🍲"}
      </div>

      {/* 콘텐츠 전체 영역 */}
      <div className="flex-1 min-w-0 flex justify-between items-start gap-3">

        {/* 이름 & 카테고리 */}
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-black text-[17px] text-slate-900 tracking-tight line-clamp-2 max-w-[180px]">
              {item.foodName}
            </h4>
            {item.isBest && (
              <span className="bg-orange-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shrink-0">
                BEST
              </span>
            )}
          </div>
          <span className="text-[12px] font-bold text-slate-400">{item.category}</span>
        </div>

        {/* 3. 가격 영역: 우측 상단 고정 및 영역 확보 (shrink-0) */}
        <div className="text-right shrink-0 pt-0.5">
          <span className="text-[18px] font-black text-slate-900 tracking-tighter">
            {Number(item.price).toLocaleString()}
          </span>
          <span className="text-[12px] font-bold text-slate-300 ml-0.5">원</span>
        </div>
      </div>

    </div>
  );
}
