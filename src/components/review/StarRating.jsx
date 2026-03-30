import React from "react";
import { Star } from "lucide-react";

export default function StarRating({ rating, setRating }) {

  return (
    <div className="py-10 px-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm text-center space-y-6">
      {/* 가이드 텍스트 */}
      <div className="space-y-1">
        <h4 className="text-[18px] font-black text-slate-900 tracking-tighter">
          오늘의 방문은 어떠셨나요?
        </h4>
        <p className="text-[13px] font-bold text-slate-400">
          별점을 탭하여 만족도를 알려주세요
        </p>
      </div>

      {/* 별점 아이콘 영역 */}
      <div className="flex justify-center gap-3">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => setRating(num)}
            className={`relative transition-all duration-300 active:scale-150 ${
              num <= rating ? "scale-110" : "scale-100 opacity-30"
            }`}
          >

            <Star
              size={42}
              fill={num <= rating ? "#FFD93D" : "none"}
              stroke={num <= rating ? "#FFD93D" : "#CBD5E1"}
              strokeWidth={num <= rating ? 0 : 2}
              className={`relative z-10 transition-colors duration-300 ${
                num <= rating ? "drop-shadow-[0_4px_4px_rgba(255,217,61,0.5)]" : ""
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}