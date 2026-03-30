import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCw, User } from 'lucide-react';

export default function NicknameField({ onNicknameChange }) {
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 백엔드 API 호출
  const fetchNickname = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/auth/nickname');
      setNickname(response.data);
      onNicknameChange(response.data); // 부모 폼 데이터 업데이트
    } catch (error) {
      console.error("닉네임 생성 실패:", error);
      setNickname("기본_드라이버_123"); // 실패 대비용
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNickname();
  }, []);

  return (
    <div className="relative group">
      <User className="absolute left-5 top-5.5 text-slate-300 group-focus-within:text-[#3182CE]" size={20} />
      <input
        type="text"
        value={nickname}
        onChange={(e) => {
          setNickname(e.target.value);
          onNicknameChange(e.target.value);
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
      
      <p className="ml-5 mt-2 text-[11px] text-[#3182CE] font-bold">
        {isLoading ? "서버에서 닉네임 조합 중..." : "* 마음에 드는 닉네임이 나올 때까지 눌러보세요!"}
      </p>
    </div>
  );
}