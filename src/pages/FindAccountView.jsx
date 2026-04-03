import React, { useState } from "react";
import { Mail, ArrowRight, Sparkles, HelpCircle } from "lucide-react";
import SubHeader from "../components/common/SubHeader";
import LoadingSpinner from "../components/common/LoadingSpinner";
import toast from "react-hot-toast";

export default function FindAccountView() {
  const [tab, setTab] = useState("id"); // 'id' 또는 'pw'
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // 계정 찾기 액션 함수
  const handleAction = async () => {
    if (!email) {
      toast.error("이메일을 입력해주세요!");
      return;
    }

    setLoading(true);
    try {
      // API 호출 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success(
        tab === "id"
          ? "입력하신 이메일로 아이디 정보를 보냈습니다!"
          : "임시 비밀번호가 발송되었습니다. 메일함을 확인해주세요!",
        {
          duration: 4000, // 4초 동안 보여주기
          style: {
            borderRadius: "15px",
            background: "#333",
            color: "#fff",
          },
        },
      );
    } catch (error) {
      console.error("계정 찾기 오류:", error);
      const errorMessage =
        error.response?.data?.message ||
        "등록된 정보가 없습니다. 다시 확인해주세요.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col max-w-[600px] mx-auto relative">
      {loading && (
        <LoadingSpinner
          fullScreen={true}
          message="정보를 조회하고 있어요"
          subMessage="Searching for your account..."
        />
      )}

      <SubHeader
        title="계정 찾기"
        rightElement={<HelpCircle className="text-slate-300" size={22} />}
      />

      <main className="flex-1 px-8 pt-8 pb-12">
        <div className="flex bg-slate-100 p-1.5 rounded-[2rem] mb-12 shadow-inner">
          <button
            onClick={() => setTab("id")}
            className={`flex-1 py-4 rounded-[1.8rem] text-[15px] font-black transition-all duration-300 ${
              tab === "id"
                ? "bg-white text-blue-600 shadow-md transform scale-[1.02]"
                : "text-slate-400 hover:text-slate-500"
            }`}
          >
            아이디 찾기
          </button>
          <button
            onClick={() => setTab("pw")}
            className={`flex-1 py-4 rounded-[1.8rem] text-[15px] font-black transition-all duration-300 ${
              tab === "pw"
                ? "bg-white text-blue-600 shadow-md transform scale-[1.02]"
                : "text-slate-400 hover:text-slate-500"
            }`}
          >
            비밀번호 찾기
          </button>
        </div>

        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={20} className="text-blue-500" />
          </div>
          <h1 className="text-[24px] font-black text-slate-900 leading-[1.2] tracking-tighter whitespace-pre-line">
            {tab === "id"
              ? "가입하신 이메일로\n아이디를 확인하세요"
              : "비밀번호 재설정을 위해\n이메일을 인증해주세요"}
          </h1>
        </div>

        {/* 입력 필드 */}
        <div className="space-y-6">
          <div className="group relative">
            <Mail
              className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-all"
              size={22}
            />
            <input
              type="email"
              placeholder="가입 시 등록한 이메일 주소"
              className="w-full bg-slate-50 border border-slate-100 rounded-[2.5rem] py-6 pl-16 pr-8 outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 focus:bg-white transition-all font-bold text-slate-800 shadow-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            onClick={handleAction}
            className="w-full bg-slate-900 text-white rounded-[2.5rem] py-6 font-black text-[18px] shadow-xl shadow-slate-200 active:scale-[0.97] transition-all flex items-center justify-center gap-3 mt-4 hover:bg-blue-600 hover:shadow-blue-100"
          >
            {tab === "id" ? "아이디 정보 받기" : "임시 비밀번호 발송"}
            <ArrowRight size={22} />
          </button>
        </div>
      </main>
    </div>
  );
}
