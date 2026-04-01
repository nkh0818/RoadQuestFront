// InfoSection.jsx — 상세 페이지의 각 섹션을 감싸는 공통 래퍼 컴포넌트
import React from "react";
import { ChevronDown } from "lucide-react";

export default function InfoSection({ title, subTitle, icon, children, onShowMore, hasMore }) {
  return (
    <section className="px-6 mb-12">
      <div className="flex justify-between items-end mb-5 px-2">
        <div>
          {subTitle && <p className="text-[11px] font-black text-blue-500 uppercase tracking-widest mb-1">{subTitle}</p>}
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-[24px] font-black text-slate-900 tracking-tighter">{title}</h3>
          </div>
        </div>
      </div>
      {children}
      {onShowMore && hasMore && (
        <button
          onClick={onShowMore}
          className="mt-4 w-full flex items-center justify-center gap-2 py-4 rounded-[2rem] bg-blue-50 border border-blue-100 text-blue-600 font-black text-[14px] hover:bg-blue-600 hover:text-white transition-all active:scale-[0.98]"
        >
          더보기
          <ChevronDown size={16} strokeWidth={2.5} />
        </button>
      )}
    </section>
  );
}
