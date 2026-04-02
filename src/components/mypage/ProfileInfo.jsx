import React from "react";
import { Award } from "lucide-react";

// 닉네임, 레벨, 칭호, 이메일 정보를 표시하는 컴포넌트
// 편집 모드일 때는 닉네임 인풋 필드로 전환됨
export default function ProfileInfo({ user, isEditing, tempNickname, onNicknameChange }) {
  return (
    <div className="mt-6 text-center space-y-2">
      {isEditing ? (
        // 편집 모드: 닉네임 직접 입력 인풋
        <input
          autoFocus
          className="bg-white border-2 border-blue-100 rounded-2xl px-4 py-2 text-center text-xl font-black text-slate-800 outline-none focus:border-blue-500 transition-all shadow-sm"
          value={tempNickname}
          onChange={(e) => onNicknameChange(e.target.value)}
        />
      ) : (
        // 일반 모드: 레벨 뱃지 + 닉네임 + 칭호 표시
        <div className="space-y-1">
          {/* 레벨 뱃지 */}
          <div className="flex items-center justify-center gap-1.5 text-blue-600">
            <Award size={14} fill="currentColor" fillOpacity={0.2} />
            <span className="text-[12px] font-black uppercase tracking-wider">
              LV.{user.level || 1} TRAVELER
            </span>
          </div>

          {/* 닉네임 */}
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {user.nickname}
          </h2>

          {/* 현재 칭호가 있을 경우에만 표시 */}
          {user.currentTitle && (
            <div className="mt-1">
              <span className="text-[12px] font-extrabold text-yellow-500 bg-yellow-50 px-3 py-1 rounded-lg">
                {user.currentTitle.titleName}
              </span>
            </div>
          )}
        </div>
      )}

      {/* 이메일 — 편집 모드와 무관하게 항상 표시 */}
      <p className="text-[13px] font-bold text-slate-400">{user.email}</p>
    </div>
  );
}
