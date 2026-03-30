import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, UserPlus, Sparkles, ShieldCheck } from "lucide-react";
import BackButton from "../components/common/Backbutton";
import SubHeader from "../components/common/SubHeader";

export default function LoginView() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("로그인 시도:", formData);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col max-w-[600px] mx-auto">
      {/* 1. 상단 헤더 */}
      <SubHeader 
        title="로그인"
      />

      <main className="flex-1 px-8 pt-8 pb-12">
        <div className="mb-14">
          <h1 className="text-[36px] font-black text-slate-900 leading-[1.1] tracking-tighter">
            기다리고 있었어요!<br />
            추억을 기록해볼까요?
          </h1>
          <div className="mt-4 flex items-center gap-2 text-slate-400 font-bold text-[15px]">
            <ShieldCheck size={18} className="text-blue-400" />
            <span>앱을 이용하려면 로그인이 필요해요</span>
          </div>
        </div>

        {/* 로그인 폼 */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="group relative">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 group-focus-within:scale-110 transition-all duration-300">
              <Mail size={22} />
            </div>
            <input
              type="email"
              placeholder="이메일 주소"
              className="w-full bg-slate-50 border border-slate-100 rounded-[2.5rem] py-6 pl-16 pr-8 outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 focus:bg-white transition-all font-bold text-slate-800 text-[16px] placeholder:text-slate-300 shadow-sm"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="group relative">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 group-focus-within:scale-110 transition-all duration-300">
              <Lock size={22} />
            </div>
            <input
              type="password"
              placeholder="비밀번호"
              className="w-full bg-slate-50 border border-slate-100 rounded-[2.5rem] py-6 pl-16 pr-8 outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 focus:bg-white transition-all font-bold text-slate-800 text-[16px] placeholder:text-slate-300 shadow-sm"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 text-white rounded-[2.5rem] py-6 font-black text-[18px] shadow-xl shadow-slate-200 active:scale-[0.97] transition-all flex items-center justify-center gap-3 mt-4 hover:bg-blue-600 hover:shadow-blue-100"
          >
            로그인 시작하기 <ArrowRight size={22} />
          </button>
        </form>

        <div className="relative my-12 flex items-center justify-center">
          <div className="w-full h-[1px] bg-slate-100"></div>
          <span className="absolute bg-white px-6 text-[12px] font-black text-slate-300 tracking-[0.2em] uppercase">
            또는 소셜 로그인
          </span>
        </div>

        {/* 소셜 로그인 */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => console.log("카카오 로그인")}
            className="w-full bg-[#FEE500] text-[#191919] rounded-[2.5rem] py-5 font-black text-[16px] shadow-sm active:scale-[0.97] transition-all flex items-center justify-center gap-4 group"
          >
            <div className="w-8 h-8 bg-[#3C1E1E] rounded-xl flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform">
              <span className="text-[#FEE500] text-[12px] font-black italic">K</span>
            </div>
            카카오톡으로 빠른 시작
          </button>
        </div>

        {/* 가입 버튼 */}
        <div className="mt-12 flex flex-col items-center gap-8">
          <div className="flex items-center gap-6 text-[14px] font-bold text-slate-400 px-4 py-2 border border-slate-50 rounded-full">
            <button onClick={() => navigate("/find")} className="hover:text-blue-600 transition-colors">아이디 찾기</button>
            <div className="w-[1px] h-3 bg-slate-200" />
            <button onClick={() => navigate("/find")} className="hover:text-blue-600 transition-colors">비밀번호 찾기</button>
          </div>

          <button
            onClick={() => navigate("/signup")}
            className="group flex items-center gap-3 text-slate-900 font-black text-[15px] bg-white border-2 border-slate-900 px-8 py-4 rounded-[2rem] hover:bg-slate-900 hover:text-white transition-all active:scale-[0.95]"
          >
            <UserPlus size={20} /> 아직 회원이 아니신가요?
          </button>
        </div>
      </main>
    </div>
  );
}