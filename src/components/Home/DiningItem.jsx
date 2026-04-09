import React from "react";
import { MessageCircle, ChevronRight, Utensils } from "lucide-react";

export default function DiningItem({ item }) {
  // 데이터 구조 분해 (기본값 설정)
  const {
    name = "맛있는 휴게소 메뉴",
    restArea = "고속도로 휴게소",
    price = 0,
  } = item || {};

  return (
    <div className="group relative bg-white p-6 flex gap-5 border-b border-slate-200 transition-all duration-300  hover:border-slate-400 active:scale-[0.98]">
      {/* 왼쪽: 아이콘 영역 (중앙 정렬로 변경) */}
      <div className="w-14 h-14 flex-shrink-0 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
        <Utensils size={24} strokeWidth={2.5} />
      </div>

      {/* 오른쪽: 정보 영역 */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        {/* 상단: 휴게소명 & 리뷰수 */}
        <div className="flex justify-between items-center mb-1">
          <span className="text-[12px] font-black text-slate-400 tracking-tight">
            {restArea}
          </span>
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-[#3182CE]/10 group-hover:text-blue-600 transition-all">
            <ChevronRight size={18} strokeWidth={3} />
          </div>
        </div>

        {/* 중단: 메뉴명 */}
        <h4 className="text-[19px] font-black text-slate-900 leading-tight group-hover:text-blue-600transition-colors truncate">
          {name}
        </h4>

        {/* 하단: 가격 & 화살표 */}
        <div className="flex justify-between items-center mt-2">
          <span className="text-[18px] font-black text-slate-900">
            {price.toLocaleString()}
            <span className="text-[14px] ml-0.5 font-bold text-slate-500">
              원
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
