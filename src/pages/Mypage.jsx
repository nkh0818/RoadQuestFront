import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Settings,
  ChevronRight,
  MessageSquare,
  Map,
  Gift,
  LogOut,
  Check,
  X,
  CreditCard,
  Award,
} from "lucide-react";
import PhotoUploader from "../components/common/PhotoUploader";
import SubHeader from "../components/common/SubHeader";
import FadeIn from "../components/common/FadeIn";

import { useUserStore } from "../store/useUserStore";
import { updateNickname } from "../api/auth";

export default function MyPageView() {
  const [profilePreviews, setProfilePreviews] = useState([]);

  const navigate = useNavigate();

  // 스토어 데이터 및 함수 가져오기
  const { user, fetchUser, isLoading, logout, updateNicknameInStore } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);

  const [tempNickname, setTempNickname] = useState(user?.nickname || "");

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (isLoading) return <div className="p-20 text-center">로딩 중...</div>;
  if (!user)
    return (
      <div className="p-20 text-center space-y-4">
        <p className="font-bold text-slate-600">
          로그인이 필요한 서비스입니다.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl"
        >
          로그인하러 가기
        </button>
      </div>
    );

  const handleSave = async () => {
    if (!tempNickname.trim()) {
      alert("닉네임을 입력하세요.");
      return;
    }

    try {
      const updatedUserData = await updateNickname(tempNickname);

      updateNicknameInStore(updatedUserData.nickname);
      setIsEditing(false);
    } catch (e) {
      console.error("닉네임을 수정하지 못했습니다:", e);
      setTempNickname(user?.nickname || "");
    }
  };

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      logout();
      navigate("/"); // 메인 페이지로 이동
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <SubHeader
        title={
          <span className="text-[18px] font-black text-slate-900">
            마이페이지
          </span>
        }
        rightElement={
          <div className="flex gap-2">
            {isEditing ? (
              <div className="flex gap-1.5">
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2.5 text-slate-400 bg-slate-100 rounded-xl active:scale-90 transition-all"
                >
                  <X size={20} />
                </button>
                <button
                  onClick={handleSave}
                  className="p-2.5 text-white bg-blue-600 rounded-xl shadow-lg shadow-blue-200 active:scale-90 transition-all"
                >
                  <Check size={20} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2.5 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Settings size={22} />
              </button>
            )}
          </div>
        }
      />

      {/* 프로필 상단 */}
      <section className="relative px-6 pt-6 pb-12 overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-60" />

        <div className="relative flex flex-col items-center">
          <div className="relative group">
            <div
              className={`w-32 h-32 rounded-[2.8rem] overflow-hidden border-4 ${isEditing ? "border-blue-100 ring-4 ring-blue-50" : "border-white shadow-md"} transition-all duration-500`}
            >
              {profilePreviews.length > 0 ? (
                <img
                  src={profilePreviews[0]}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                  <User size={40} strokeWidth={1.5} />
                </div>
              )}
            </div>
            {isEditing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-[2.8rem] backdrop-blur-[2px] animate-in fade-in">
                <PhotoUploader
                  type="profile"
                  previews={profilePreviews}
                  onDrop={(files) =>
                    setProfilePreviews([URL.createObjectURL(files[0])])
                  }
                />
              </div>
            )}
          </div>

          <div className="mt-6 text-center space-y-2">
            {isEditing ? (
              <input
                autoFocus
                className="bg-white border-2 border-blue-100 rounded-2xl px-4 py-2 text-center text-xl font-black text-slate-800 outline-none focus:border-blue-500 transition-all shadow-sm"
                value={tempNickname}
                onChange={(e) => setTempNickname(e.target.value)}
              />
            ) : (
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-blue-600">
                  <Award size={14} fill="currentColor" fillOpacity={0.2} />
                  <span className="text-[12px] font-black uppercase tracking-wider">
                    LV.{user.level || 1} TRAVELER
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {user.nickname}
                </h2>
                {user.currentTitle && (
                <div className="mt-1">
                  <span className="text-[12px] font-extrabold text-yellow-500 bg-yellow-50 px-3 py-1 rounded-lg">
                    {user.currentTitle.titleName}
                  </span>
                </div>
)}
              </div>
            )}
            <p className="text-[13px] font-bold text-slate-400">{user.email}</p>
          </div>
        </div>

        {/* 포인트/기록 대시보드 (실제 데이터 반영) */}
        <div className="mt-10 grid grid-cols-2 gap-4">
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
            <CreditCard
              size={50}
              className="absolute -right-4 -bottom-4 text-blue-50 -rotate-12 group-hover:rotate-0 transition-transform duration-500"
            />
          </div>
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
            <MessageSquare
              size={50}
              className="absolute -right-4 -bottom-4 text-blue-50 -rotate-12 group-hover:rotate-0 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* 메뉴 리스트 */}
      <main
        className={`px-6 pb-10 space-y-3 transition-all ${isEditing ? "opacity-30 pointer-events-none scale-[0.98]" : ""}`}
      >
        <h3 className="text-[13px] font-black text-slate-400 uppercase tracking-[0.15em] ml-2 mb-4">
          계정 설정
        </h3>

        {[
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
        ].map((item, idx) => (
          <FadeIn key={idx} delay={idx * 80}>
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
                <span className="font-bold text-[16px] text-slate-700">
                  {item.title}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {item.count !== undefined && (
                  <span className="text-[12px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                    {item.count}
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
          onClick={handleLogout}
          className="w-full mt-10 p-5 flex items-center justify-center gap-2 text-slate-400 font-bold text-[14px] hover:text-red-400 transition-colors"
        >
          <LogOut size={16} />
          로그아웃
        </button>
      </main>
    </div>
  );
}