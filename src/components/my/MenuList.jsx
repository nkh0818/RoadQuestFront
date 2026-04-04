import { useNavigate } from "react-router-dom";
import { MessageSquare, Map, Gift, ChevronRight, LogOut } from "lucide-react";
import FadeIn from "../common/FadeIn";

const MENU_ITEMS = [
  {
    title: "내가 쓴 전체 리뷰",
    icon: <MessageSquare size={20} strokeWidth={2.5} />,
    color: "text-blue-500",
    bg: "bg-blue-50",
    path: "/my-reviews",
    showCount: true,
  },
  {
    title: "다녀온 장소 지도",
    icon: <Map size={20} strokeWidth={2.5} />,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    path: "/mymap",
  },
  {
    title: "쿠폰함",
    icon: <Gift size={20} strokeWidth={2.5} />,
    color: "text-amber-500",
    bg: "bg-amber-50",
    path: "/coupons",
  },
];

export default function MenuList({ reviewCount, isEditing, onLogout }) {
  const navigate = useNavigate();

  return (
    <main
      className={`px-6 pb-10 space-y-3 transition-all ${
        isEditing ? "opacity-30 pointer-events-none scale-[0.98]" : ""
      }`}
    >
      <h3 className="text-[13px] font-black text-slate-400 uppercase tracking-[0.15em] ml-2 mb-4">
        계정 설정
      </h3>

      {MENU_ITEMS.map((item, idx) => (
        <FadeIn key={item.path} delay={idx * 80}>
          <button
            onClick={() => navigate(item.path)}
            className="w-full bg-white p-5 rounded-[2rem] flex items-center justify-between group active:scale-[0.97] transition-all border border-transparent hover:border-blue-100 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-11 h-11 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}
              >
                {item.icon}
              </div>
              <span className="font-bold text-[16px] text-slate-700">{item.title}</span>
            </div>
            <div className="flex items-center gap-3">
              {item.showCount && reviewCount !== undefined && (
                <span className="text-[12px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                  {reviewCount}
                </span>
              )}
              <ChevronRight
                size={18}
                className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"
              />
            </div>
          </button>
        </FadeIn>
      ))}

      <button
        onClick={onLogout}
        className="w-full mt-10 p-5 flex items-center justify-center gap-2 text-slate-400 font-bold text-[14px] hover:text-red-400 transition-colors"
      >
        <LogOut size={16} strokeWidth={2.5} />
        로그아웃
      </button>
    </main>
  );
}
