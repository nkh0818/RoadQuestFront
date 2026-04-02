import React from "react";
import { MessageSquare, Map, Gift, LogOut } from "lucide-react";
import MenuListItem from "./MenuListItem";

// 마이페이지 메뉴 목록과 로그아웃 버튼을 렌더링하는 컴포넌트
export default function MenuList({ user, isEditing, onLogout }) {
  // 메뉴 항목 정의 — 경로, 아이콘, 색상, 개수 뱃지 포함
  const menuItems = [
    {
      title: "내가 쓴 전체 리뷰",
      icon: <MessageSquare size={20} />,
      color: "text-blue-500",
      bg: "bg-blue-50",
      path: "/my-reviews",
      count: user.reviews?.length,
    },
    {
      title: "다녀온 장소 지도",
      icon: <Map size={20} />,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      path: "/mymap",
    },
    {
      title: "쿠폰함",
      icon: <Gift size={20} />,
      color: "text-amber-500",
      bg: "bg-amber-50",
      path: "/coupons",
    },
  ];

  return (
    // 편집 모드일 때 메뉴 영역을 흐리게 처리하고 클릭 비활성화
    <main
      className={`px-6 pb-10 space-y-3 transition-all ${
        isEditing ? "opacity-30 pointer-events-none scale-[0.98]" : ""
      }`}
    >
      <h3 className="text-[13px] font-black text-slate-400 uppercase tracking-[0.15em] ml-2 mb-4">
        계정 설정
      </h3>

      {/* 메뉴 항목 리스트 — FadeIn 딜레이를 순서대로 적용 */}
      {menuItems.map((item, idx) => (
        <MenuListItem key={idx} item={item} delay={idx * 80} />
      ))}

      {/* 로그아웃 버튼 — 클릭 시 확인 후 처리 */}
      <button
        onClick={onLogout}
        className="w-full mt-10 p-5 flex items-center justify-center gap-2 text-slate-400 font-bold text-[14px] hover:text-red-400 transition-colors"
      >
        <LogOut size={16} />
        로그아웃
      </button>
    </main>
  );
}
