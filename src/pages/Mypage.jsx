import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Settings, ChevronRight, MessageSquare, Map, Gift,
  Bell, LogOut, Check, X, CreditCard, Award
} from "lucide-react";
import PhotoUploader from "../components/review/PhotoUploader";
import SubHeader from "../components/common/SubHeader";
import FadeIn from "../components/common/FadeIn";

export default function MyPageView() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    nickname: "여행하는 초코송이",
    email: "choco@travel.com",
    reviewCount: 12,
    point: 5500,
    level: "프로 여행러",
  });

  const [profilePreviews, setProfilePreviews] = useState([]);

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <SubHeader
        title={<span className="text-[18px] font-black text-slate-900">마이페이지</span>}
        rightElement={
          <div className="flex gap-2">
            {isEditing ? (
              <div className="flex gap-1.5">
                <button onClick={() => setIsEditing(false)} className="p-2.5 text-slate-400 bg-slate-100 rounded-xl active:scale-90 transition-all"><X size={20} /></button>
                <button onClick={handleSave} className="p-2.5 text-white bg-blue-600 rounded-xl shadow-lg shadow-blue-200 active:scale-90 transition-all"><Check size={20} /></button>
              </div>
            ) : (
              <button onClick={() => setIsEditing(true)} className="p-2.5 text-slate-400 hover:text-slate-600 transition-colors"><Settings size={22} /></button>
            )}
          </div>
        }
      />

      {/* 프로필 상단 */}
      <section className="relative px-6 pt-6 pb-12 overflow-hidden">
        {/* 배경 장식 */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-60" />
        
        <div className="relative flex flex-col items-center">
          {/* 프로필 이미지 박스 */}
          <div className="relative group">
            <div className={`w-32 h-32 rounded-[2.8rem] overflow-hidden border-4 ${isEditing ? 'border-blue-100 ring-4 ring-blue-50' : 'border-white shadow-md'} transition-all duration-500`}>
              {profilePreviews.length > 0 ? (
                <img src={profilePreviews[0]} alt="profile" className="w-full h-full object-cover" />
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
                   onDrop={(files) => setProfilePreviews([URL.createObjectURL(files[0])])}
                />
              </div>
            )}
          </div>

          {/* 텍스트 영역 */}
          <div className="mt-6 text-center space-y-2">
            {isEditing ? (
              <input
                autoFocus
                className="bg-white border-2 border-blue-100 rounded-2xl px-4 py-2 text-center text-xl font-black text-slate-800 outline-none focus:border-blue-500 transition-all shadow-sm"
                value={userInfo.nickname}
                onChange={(e) => setUserInfo({ ...userInfo, nickname: e.target.value })}
              />
            ) : (
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-blue-600">
                  <Award size={14} fill="currentColor" fillOpacity={0.2} />
                  <span className="text-[12px] font-black uppercase tracking-wider">{userInfo.level}</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{userInfo.nickname}</h2>
              </div>
            )}
            <p className="text-[13px] font-bold text-slate-400">{userInfo.email}</p>
          </div>
        </div>

        {/* 포인트/기록 대시보드 */}
        <div className="mt-10 grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-[2.2rem] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.03)] border border-slate-50 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-tighter mb-1">My Points</p>
              <p className="text-[20px] font-black text-slate-900">{userInfo.point.toLocaleString()}<span className="text-[13px] ml-0.5 text-blue-600">P</span></p>
            </div>
            <CreditCard size={50} className="absolute -right-4 -bottom-4 text-blue-50 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
          </div>
          <div className="bg-white p-5 rounded-[2.2rem] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.03)] border border-slate-50 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-tighter mb-1">Memories</p>
              <p className="text-[20px] font-black text-slate-900">{userInfo.reviewCount}<span className="text-[13px] ml-0.5 text-blue-600">건</span></p>
            </div>
            <MessageSquare size={50} className="absolute -right-4 -bottom-4 text-blue-50 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
          </div>
        </div>
      </section>

      {/* 메뉴 리스트 */}
      <main className={`px-6 pb-10 space-y-3 transition-all ${isEditing ? 'opacity-30 pointer-events-none scale-[0.98]' : ''}`}>
        <h3 className="text-[13px] font-black text-slate-400 uppercase tracking-[0.15em] ml-2 mb-4">계정 설정</h3>
        
        {[
          { title: "내가 쓴 전체 리뷰", icon: <MessageSquare size={20}/>, color: "text-blue-500", bg: "bg-blue-50", path: "/my-reviews", count: userInfo.reviewCount },
          { title: "다녀온 장소 지도", icon: <Map size={20}/>, color: "text-emerald-500", bg: "bg-emerald-50", path: "/mymap" },
          { title: "쿠폰함", icon: <Gift size={20}/>, color: "text-amber-500", bg: "bg-amber-50", path: "/coupons" },
        ].map((item, idx) => (
          <FadeIn key={idx} delay={idx * 80}>
            <button
              onClick={() => navigate(item.path)}
              className="w-full bg-white p-5 rounded-[2rem] flex items-center justify-between group active:scale-[0.97] transition-all border border-transparent hover:border-blue-100 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <span className="font-bold text-[16px] text-slate-700">{item.title}</span>
              </div>
              <div className="flex items-center gap-3">
                {item.count && <span className="text-[12px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">{item.count}</span>}
                <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          </FadeIn>
        ))}

        <button className="w-full mt-10 p-5 flex items-center justify-center gap-2 text-slate-400 font-bold text-[14px] hover:text-red-400 transition-colors">
          <LogOut size={16} />
          로그아웃
        </button>
      </main>
    </div>
  );
}