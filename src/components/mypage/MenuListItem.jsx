import React from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FadeIn from "../common/FadeIn";

// 마이페이지 메뉴의 개별 항목 버튼 컴포넌트
export default function MenuListItem({ item, delay }) {
  const navigate = useNavigate();

  return (
    <FadeIn delay={delay}>
      <button
        onClick={() => navigate(item.path)}
        className="w-full bg-white p-5 rounded-[2rem] flex items-center justify-between group active:scale-[0.97] transition-all border border-transparent hover:border-blue-100 shadow-sm"
      >
        <div className="flex items-center gap-4">
          {/* 메뉴 아이콘 — hover 시 살짝 확대 */}
          <div
            className={`w-11 h-11 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}
          >
            {item.icon}
          </div>
          <span className="font-bold text-[16px] text-slate-700">
            {item.title}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* 개수 뱃지 — count 값이 있을 때만 표시 */}
          {item.count !== undefined && (
            <span className="text-[12px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              {item.count}
            </span>
          )}
          {/* 화살표 아이콘 — hover 시 오른쪽으로 이동 */}
          <ChevronRight
            size={18}
            className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"
          />
        </div>
      </button>
    </FadeIn>
  );
}
