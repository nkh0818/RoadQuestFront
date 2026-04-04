import { Gift, Award, MessageSquare } from "lucide-react";

export default function StatsDashboard({ rewardPoint, xp, xpPercent, reviewCount }) {
  return (
    <div className="mt-10 grid grid-cols-2 gap-4">
      {/* 포인트 카드 */}
      <div className="bg-white p-5 rounded-[2.2rem] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.03)] border border-slate-50 relative overflow-hidden group">
        <div className="relative z-10">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-tighter mb-1">
            My Points
          </p>
          <p className="text-[20px] font-black text-slate-900">
            {(rewardPoint || 0).toLocaleString()}
            <span className="text-[13px] ml-0.5 text-amber-500">P</span>
          </p>
        </div>
        <Gift
          size={50}
          className="absolute -right-4 -bottom-4 text-amber-50 -rotate-12 group-hover:rotate-0 transition-transform duration-500"
        />
      </div>

      {/* 경험치 카드 */}
      <div className="bg-white p-5 rounded-[2.2rem] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.03)] border border-slate-50 relative overflow-hidden group">
        <div className="relative z-10">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-tighter mb-1">
            My XP
          </p>
          <p className="text-[20px] font-black text-slate-900">
            {(xp || 0).toLocaleString()}
            <span className="text-[13px] ml-0.5 text-blue-600">XP</span>
          </p>
          <div className="mt-2 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-1000"
              style={{ width: `${xpPercent || 0}%` }}
            />
          </div>
        </div>
        <Award
          size={50}
          className="absolute -right-4 -bottom-4 text-blue-50 -rotate-12 group-hover:rotate-0 transition-transform duration-500"
        />
      </div>

      {/* 리뷰 카드 */}
      <div className="bg-white p-5 rounded-[2.2rem] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.03)] border border-slate-50 relative overflow-hidden group">
        <div className="relative z-10">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-tighter mb-1">
            Reviews
          </p>
          <p className="text-[20px] font-black text-slate-900">
            {reviewCount || 0}
            <span className="text-[13px] ml-0.5 text-blue-600">건</span>
          </p>
        </div>
        <MessageSquare
          size={50}
          className="absolute -right-4 -bottom-4 text-blue-50 -rotate-12 group-hover:rotate-0 transition-transform duration-500"
        />
      </div>
    </div>
  );
}
