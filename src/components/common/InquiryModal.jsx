import React, { useState } from "react";
import { X, Send, MessageSquare, AlertCircle } from "lucide-react";

export default function InquiryModal({ isOpen, onClose }) {
  const [inquiry, setInquiry] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 모달이 닫혀있으면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inquiry.trim().length < 5) return alert("최소 5자 이상 입력해주세요!");

    setIsSubmitting(true);
    
    // [백엔드 연결 시점] axios.post('/api/inquiries', { content: inquiry })
    setTimeout(() => {
      alert("문의가 접수되었습니다. 빠른 시일 내에 답변 드릴게요!");
      setInquiry("");
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-0 sm:p-6">
      {/* 배경 흐리게 (클릭 시 닫힘) */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      />

      {/* 모달 본체 */}
      <div className="relative bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[3rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-500">
        
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
              <MessageSquare size={20} />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">문의하기</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 안내 문구 */}
        <div className="bg-blue-50/50 p-4 rounded-2xl mb-6 flex gap-3 items-start">
          <AlertCircle size={18} className="text-blue-500 mt-0.5" />
          <p className="text-[13px] font-bold text-blue-700 leading-relaxed">
            서비스 이용 중 불편한 점이나 오류 수정 등 제안하고 싶은 내용을 자유롭게 남겨주세요.
          </p>
        </div>

        {/* 입력 폼 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <textarea
              value={inquiry}
              onChange={(e) => setInquiry(e.target.value)}
              className="w-full h-44 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] p-5 text-[15px] font-medium text-slate-700 placeholder:text-slate-300 focus:border-blue-500 focus:bg-white focus:ring-0 transition-all resize-none"
              placeholder="여기에 내용을 입력하세요..."
            />
            <span className="absolute bottom-4 right-5 text-[12px] font-bold text-slate-300">
              {inquiry.length} / 500
            </span>
          </div>

          {/* 전송 버튼 */}
          <button
            disabled={isSubmitting}
            className={`w-full py-5 rounded-[1.5rem] font-black text-white shadow-xl flex items-center justify-center gap-2 transition-all ${
              isSubmitting ? "bg-slate-400" : "bg-slate-900 hover:bg-blue-600 hover:shadow-blue-200"
            }`}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send size={18} />
                <span>문의 보내기</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}