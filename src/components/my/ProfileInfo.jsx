import { Award } from "lucide-react";

export default function ProfileInfo({ user, isEditing, tempNickname, onNicknameChange }) {
  return (
    <div className="space-y-2">
      {isEditing ? (
        <input
          autoFocus
          className="bg-white border-2 border-blue-100 rounded-2xl px-4 py-2 text-center text-xl font-black text-slate-800 outline-none focus:border-blue-500 transition-all shadow-sm"
          value={tempNickname}
          onChange={(e) => onNicknameChange(e.target.value)}
        />
      ) : (
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-blue-600">
            <Award size={14} fill="currentColor" fillOpacity={0.2} strokeWidth={2.5} />
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
  );
}
