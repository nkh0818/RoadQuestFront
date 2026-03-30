import React, { useState } from "react";
import { Tag, X, Sparkles, Plus } from "lucide-react";

export default function TagSystem({ tags, onAdd, onRemove, dynamicTags }) {
  const [input, setInput] = useState("");

  const handleKeyDown = (e) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter") {
      e.preventDefault();
      if (input.trim()) {
        onAdd(input.trim());
        setInput("");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. 입력창: 더 깊은 깊이감과 포커스 효과 */}
      <div className="group bg-white rounded-[2rem] px-6 py-5 border border-slate-100 flex items-center gap-3 transition-all focus-within:border-blue-400 focus-within:shadow-[0_10px_30px_-10px_rgba(49,130,206,0.2)]">
        <Tag size={18} className="text-blue-500 group-focus-within:rotate-12 transition-transform" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="태그를 직접 입력하기"
          className="flex-1 border-none focus:ring-0 text-[15px] font-bold text-slate-700 bg-transparent placeholder:text-slate-300"
        />
        {input.trim() && (
          <button 
            type="button"
            onClick={() => { onAdd(input.trim()); setInput(""); }}
            className="p-2 bg-blue-600 rounded-xl text-white animate-in zoom-in"
          >
            <Plus size={16} strokeWidth={3} />
          </button>
        )}
      </div>

      {/* 2. 스마트 추천 영역: AI 어시스턴트 느낌 강조 */}
      {dynamicTags.length > 0 && (
        <div className="space-y-3 px-2">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-black text-blue-600 flex items-center gap-1.5 uppercase tracking-widest">
              <Sparkles size={14} className="fill-blue-600 animate-pulse" /> AI 추천 태그
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {dynamicTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onAdd(tag)}
                className="group flex items-center gap-1 px-4 py-2 rounded-2xl text-[12px] font-black bg-white border border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm active:scale-90 animate-in fade-in slide-in-from-left-2"
              >
                <Plus size={12} className="group-hover:rotate-90 transition-transform" />
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. 선택된 태그 리스트: 쫀득한 칩 디자인 */}
      <div className="flex flex-wrap gap-2 px-1">
        {tags.map((tag, i) => (
          <div
            key={i}
            className="flex items-center gap-2 bg-slate-900 text-white pl-4 pr-2 py-2.5 rounded-[1.2rem] text-[13px] font-black shadow-lg shadow-slate-200 animate-in zoom-in duration-300"
          >
            <span>#{tag}</span>
            <button
              type="button"
              onClick={() => onRemove(tag)}
              className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X size={14} strokeWidth={3} />
            </button>
          </div>
        ))}
      </div>
      
      {/* 팁 메세지: 태그가 없을 때만 살짝 등장 */}
      {tags.length === 0 && (
        <p className="text-[14px] font-bold text-slate-300 text-center">
          내용을 작성하시면 AI가 태그를 추천해드려요!
        </p>
      )}
    </div>
  );
}