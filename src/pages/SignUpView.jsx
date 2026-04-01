import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import SubHeader from "../components/common/SubHeader";
import NicknameField from "../components/common/NicknameField";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { requestSignUp } from "../api/auth";

import { useUserStore } from "../store/useUserStore";

export default function SignUpView() {
  const navigate = useNavigate();

  const { setUserData } = useUserStore();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "", // NicknameField에서 채워줄 값
  });

  // NicknameField에서 보낸 값을 부모 상태에 반영
  const handleNicknameChange = (newNickname) => {
    setFormData((prev) => ({ ...prev, nickname: newNickname }));
  };

  const handleSignUp = async (e) => {
    console.log("handleSignup 실행");
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);

    try {
      console.log("서버로 데이터 전송 중...", formData);

      // 백엔드 API 호출 api/auth.js 내부에 존재
      const authData = await requestSignUp(formData);

      // Zustand 업데이트
      setUserData(authData);

      alert(`${authData.nickname}님, 회원가입을 축하합니다!`);
      navigate("/");
    } catch (error) {
      console.error("가입 에러 발생:", error);
      const errorMsg =
        error.response?.data || "서버 통신 중 오류가 발생했습니다.";
      const finalMsg =
        typeof errorMsg === "string"
          ? errorMsg
          : errorMsg.message || "이미 등록된 정보가 있습니다.";

      alert(finalMsg);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col max-w-[600px] mx-auto relative">
      {loading && (
        <LoadingSpinner
          fullScreen={true}
          message="여정을 준비하고 있어요"
          subMessage="Creating your account..."
        />
      )}

      <SubHeader
        title="회원가입"
        rightElement={
          <div className="w-12 h-1.5 bg-blue-100 rounded-full overflow-hidden">
            <div className="w-2/3 h-full bg-blue-600 rounded-full" />
          </div>
        }
      />

      <main className="flex-1 px-8 pt-6">
        <div className="mb-10 relative">
          <h1 className="text-[28px] font-black text-slate-900 leading-[1.2] tracking-tighter">
            이제 곧 회원가입이 완료됩니다!
          </h1>
        </div>

        <form onSubmit={handleSignUp} className="space-y-8">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <NicknameField onNicknameChange={handleNicknameChange} />
          </div>

          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="group relative">
              <Mail
                className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-all"
                size={20}
              />
              <input
                type="email"
                placeholder="이메일 주소"
                className="w-full bg-slate-50 border border-slate-100 rounded-[2.5rem] py-6 pl-16 pr-8 outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all font-bold text-slate-800 shadow-sm"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="group relative">
              <Lock
                className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-all"
                size={20}
              />
              <input
                type="password"
                placeholder="비밀번호 (8자 이상)"
                className="w-full bg-slate-50 border border-slate-100 rounded-[2.5rem] py-6 pl-16 pr-8 outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all font-bold text-slate-800 shadow-sm"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>

            <div className="group relative">
              <CheckCircle2
                className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-all"
                size={20}
              />
              <input
                type="password"
                placeholder="비밀번호 확인"
                className="w-full bg-slate-50 border border-slate-100 rounded-[2.5rem] py-6 pl-16 pr-8 outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all font-bold text-slate-800 shadow-sm"
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? "bg-slate-300" : "bg-blue-600"} text-white rounded-[2.5rem] py-6 font-black text-[18px] shadow-xl shadow-blue-100 active:scale-[0.97] transition-all flex items-center justify-center gap-3 mt-6`}
          >
            가입 완료하고 출발하기 <ArrowRight size={22} />
          </button>
        </form>

        <p className="mt-8 text-center text-[12px] font-bold text-slate-300 leading-relaxed px-10">
          가입 시 서비스 이용약관 및 개인정보 처리방침에
          <br />
          동의하는 것으로 간주됩니다.
        </p>
      </main>
    </div>
  );
}
