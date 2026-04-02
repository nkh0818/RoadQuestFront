import React from "react";
import { CreditCard, MessageSquare } from "lucide-react";

// XP(경험치)와 리뷰 수를 카드 형태로 보여주는 통계 대시보드
export default function StatsDashboard({ user }) {
  return (
    <div className="mt-10 grid grid-cols-2 gap-4">
      {/* XP 카드 */}
      <div className="bg-white p-5 rounded-[2.2rem] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.03)] border border-slate-50 relative overflow-hidden group">
        <div className="relative z-10">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-tighter mb-1">
            My XP
          </p>
          <p className="text-[20px] font-black text-slate-900">
            {(user.xp || 0).toLocaleString()}
            <span className="text-[13px] ml-0.5 text-blue-600">xp</span>
          </p>
        </div>
        {/* 배경 아이콘 — hover 시 회전 애니메이션 */}
        <CreditCard
          size={50}
          className="absolute -right-4 -bottom-4 text-blue-50 -rotate-12 group-hover:rotate-0 transition-transform duration-500"
        />
      </div>

      {/* 리뷰 수 카드 */}
      <div className="bg-white p-5 rounded-[2.2rem] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.03)] border border-slate-50 relative overflow-hidden group">
        <div className="relative z-10">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-tighter mb-1">
            Reviews
          </p>
          <p className="text-[20px] font-black text-slate-900">
            {user.reviews?.length || 0}
            <span className="text-[13px] ml-0.5 text-blue-600">건</span>
          </p>
          <p className="text-[12px] text-slate-400">
            평균 평점: {user.avgRating || 0}
          </p>
        </div>
        {/* 배경 아이콘 — hover 시 회전 애니메이션 */}
        <MessageSquare
          size={50}
          className="absolute -right-4 -bottom-4 text-blue-50 -rotate-12 group-hover:rotate-0 transition-transform duration-500"
        />
      </div>
    </div>
  );
}
