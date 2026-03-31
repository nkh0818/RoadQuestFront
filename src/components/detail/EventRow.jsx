// EventRow.jsx — 이벤트 목록의 개별 행 컴포넌트 (아코디언 열기/닫기 상태 관리)
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function EventRow({ item, index }) {
  const [isOpen, setIsOpen] = useState(false);

  const period = `${ item.stime || '' } ~ ${ item.etime || '' }`;

  return (
    <div>
      <button
        onClick={ () => setIsOpen(!isOpen) }
        className="w-full flex items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-slate-50 active:bg-blue-50"
      >
        <span className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-50 text-[11px] font-black text-blue-500">
          { index }
        </span>
        <span className="flex-1 min-w-0 text-[13px] font-bold text-slate-800 line-clamp-2">
          { item.eventNm }
        </span>
        <span className="shrink-0 text-[11px] font-bold text-slate-400 whitespace-nowrap">
          { period !== " ~ " ? period : "" }
        </span>
        <ChevronDown
          size={ 16 }
          strokeWidth={ 2.5 }
          className={ `shrink-0 text-slate-400 transition-transform duration-200 ${ isOpen ? "rotate-180 text-blue-500" : "" }` }
        />
      </button>
      { isOpen && (
        <div className="px-5 pb-5 pt-1 border-t border-slate-50 bg-blue-50/40">
          <p className="text-[13px] font-bold text-slate-500 leading-relaxed whitespace-pre-wrap">
            { item.eventDetail || "상세 내용이 없습니다." }
          </p>
        </div>
      ) }
    </div>
  );
}