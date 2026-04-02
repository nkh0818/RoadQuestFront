import React from "react";

export default function LoadingSpinner({ 
  message = "데이터를 불러오는 중...", // 기본값 설정
  subMessage = "Loading...",
  color = "#3182CE",
  fullScreen = false
}) {
  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${
      fullScreen ? "fixed inset-0 bg-white/60 backdrop-blur-sm z-[9999]" : "py-20 w-full"
    }`}>
      {/* 스피너 */}
      <div className="relative w-12 h-12">
        {/* 배경 */}
        <div 
          className="absolute inset-0 border-4 rounded-full"
          style={{ borderColor: `${color}33` }}
        ></div>
        {/* 돌아가는 원 */}
        <div 
          className="absolute inset-0 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderTopColor: 'transparent', borderLeftColor: color, borderRightColor: color, borderBottomColor: color }}
        ></div>
      </div>

      {/* 텍스트 */}
      <div className="flex flex-col items-center gap-1">
        <p 
          className="font-black italic text-lg tracking-tight animate-pulse"
          style={{ color: color }}
        >
          {message}
        </p>
        {subMessage && (
          <span 
            className="text-[11px] font-bold uppercase tracking-widest opacity-40"
            style={{ color: color }}
          >
            {subMessage}
          </span>
        )}
      </div>
    </div>
  );
}