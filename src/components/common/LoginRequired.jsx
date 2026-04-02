import React from "react";
import { useNavigate } from "react-router-dom";

// 로그인이 필요한 페이지에서 공통으로 사용하는 안내 컴포넌트
export default function LoginRequired() {
  const navigate = useNavigate();

  return (
    <div className="p-20 text-center space-y-4">
      <p className="font-bold text-slate-600">로그인이 필요한 서비스입니다.</p>
      <button
        onClick={() => navigate("/login")}
        className="px-6 py-2 bg-blue-600 text-white rounded-xl"
      >
        로그인하러 가기
      </button>
    </div>
  );
}
