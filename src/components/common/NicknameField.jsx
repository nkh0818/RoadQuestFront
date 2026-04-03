import React, { useState, useEffect } from "react";
import { fetchRandomNickname } from "../../api/auth";
import { RefreshCw, User, Check, AlertCircle } from "lucide-react";
import axios from "axios";

export default function NicknameField({
  onNicknameChange,
  onValidationChange,
}) {
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const checkDuplicate = async (value) => {
    if (!value || value.trim().length < 2) {
      setStatus(null);
      onValidationChange?.(false);
      return;
    }

    if (value.includes(" ")) {
      setStatus("duplicate");
      return;
    }

    setStatus("loading");
    try {
      const res = await axios.get(
        `/api/user/check-nickname?nickname=${encodeURIComponent(value)}`,
      );
      const isDuplicate = res.data;

      if (isDuplicate) {
        setStatus("duplicate");
        onValidationChange?.(false);
      } else {
        setStatus("available");
        onValidationChange?.(true);
      }
    } catch (error) {
      console.error("중복 체크 실패:", error);
      setStatus(null);
    }
  };

  const fetchNickname = async () => {
    setIsLoading(true);
    setStatus("loading");
    try {
      const newNickname = await fetchRandomNickname();

      // 1. 일단 닉네임을 먼저 세팅하고 부모에게 알림
      setNickname(newNickname);
      onNicknameChange(newNickname);

      // 2. 랜덤으로 생성된 닉네임은 사실 "서버가 만들어준 것"이므로
      //    이미 사용 가능할 확률이 높지만, 그래도 체크하고 싶다면
      //    newNickname이 유효할 때만 실행하도록 확실히 제어
      if (newNickname && newNickname.length >= 2) {
        await checkDuplicate(newNickname); // 앞에 await를 붙여주세요!
      }
    } catch (e) {
      console.error("닉네임 생성 실패:", e);
      // 에러 시 대체 닉네임 설정
      const fallback = "기본_드라이버_" + Math.floor(Math.random() * 1000);
      setNickname(fallback);
      onNicknameChange(fallback);
      setStatus(null); // 에러 메시지 대신 초기 상태로
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNickname();
  }, []);

  return (
    <div className="relative group">
      <User
        className="absolute left-5 top-5.5 text-slate-300 group-focus-within:text-[#3182CE]"
        size={20}
      />
      <input
        type="text"
        value={nickname || ""}
        onChange={(e) => {
          const newValue = e.target.value;
          setNickname(newValue);
          onNicknameChange(newValue);
          checkDuplicate(newValue);
        }}
        className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] py-5 pl-14 pr-16 outline-none focus:ring-2 focus:ring-[#3182CE]/20 focus:border-[#3182CE] focus:bg-white transition-all font-bold text-slate-800"
      />

      {/* 닉네임 다시 생성 버튼 */}
      <button
        type="button"
        onClick={fetchNickname}
        disabled={isLoading}
        className="absolute right-4 top-4 p-2 bg-white rounded-full shadow-sm border border-slate-100 text-[#3182CE] hover:shadow-md active:scale-90 transition-all"
      >
        <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
      </button>

      {/* 상태 메시지 UI */}
      <div className="ml-5 mt-2 flex items-center gap-1.5 font-bold text-[11px]">
        {status === "loading" && (
          <span className="text-slate-400">중복 확인 중...</span>
        )}
        {status === "duplicate" && (
          <span className="text-red-500 flex items-center gap-1">
            <AlertCircle size={12} /> 사용할 수 없는 닉네임입니다.
          </span>
        )}
        {status === "available" && (
          <span className="text-green-600 flex items-center gap-1">
            <Check size={12} /> 사용 가능한 멋진 닉네임입니다.
          </span>
        )}
        {!status && !isLoading && (
          <span className="text-[#3182CE]">
            마음에 드는 닉네임이 나올 때까지 버튼을 눌러보세요!
          </span>
        )}
      </div>
    </div>
  );
}
