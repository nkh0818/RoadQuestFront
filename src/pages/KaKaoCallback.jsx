import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUserStore } from "../store/useUserStore";

export default function KakaoCallback() {
  const navigate = useNavigate();
  const setUserData = useUserStore((state) => state.setUserData);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (code) {
      axios.post("http://localhost:8080/api/auth/kakao", { 
        accessToken: code
      })
      .then((res) => {
        setUserData(res.data);
        navigate("/");
      })
      .catch((err) => {
        console.error("로그인 처리 실패:", err);
        navigate("/login");
      });
    }
  }, [navigate, setUserData]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      <p className="font-black text-slate-600 text-lg">기다려주세요! 로그인 처리 중... </p>
    </div>
  );
}