import React from 'react';
import { X, Instagram, Link2, MessageCircle, Download, Sparkles } from 'lucide-react';

export default function ShareModal({ isOpen, onClose, log }) {
  if (!isOpen) return null;

  const getTheme = (id) => {
    const themes = {
      1: { gradient: "from-rose-400 to-orange-400", point: "bg-rose-500" },
      2: { gradient: "from-blue-400 to-indigo-500", point: "bg-blue-500" },
      default: { gradient: "from-slate-400 to-slate-600", point: "bg-slate-500" }
    };
    return themes[id] || themes.default;
  };

  const style = getTheme(log.id);

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-6">
      {/* 배경 흐리기 */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-500" 
        onClick={onClose} 
      />

      {/* 팝업 컨텐츠 */}
      <div className="relative w-full max-w-md bg-[#F8FAFC] rounded-t-[3.5rem] sm:rounded-[3.5rem] p-8 pb-12 shadow-[0_-20px_80px_rgba(0,0,0,0.3)] animate-in slide-in-from-bottom duration-500 ease-out border-t border-white/20">
        
        {/* 상단 드래그 핸들 */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 opacity-50 sm:hidden" />

        {/* 닫기 버튼 */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-2.5 bg-white rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm border border-slate-100 transition-all active:scale-90"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles size={18} className="text-blue-500 fill-blue-500" />
            <h3 className="text-[22px] font-black text-slate-900 tracking-tighter">
              기억을 <span className="text-blue-600">선물</span>하세요
            </h3>
          </div>
          <p className="text-[13px] font-bold text-slate-400 tracking-tight">친구들과 함께 오늘의 드라이브를 공유해봐요!</p>
        </div>

        {/* 3. 미니 프리뷰 카드 */}
        <div className="relative group perspective-1000 mb-12">
          <div className={`relative aspect-[9/13] w-52 mx-auto rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.2)] border-[6px] border-white transition-all duration-700 ease-out rotate-[-4deg] group-hover:rotate-0 group-hover:scale-105`}>
            
            <div className={`w-full h-full bg-gradient-to-br ${style.gradient} p-7 flex flex-col justify-between text-white`}>
              {/* 카드 상단 */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 bg-black/10 backdrop-blur-md w-fit px-3 py-1 rounded-full border border-white/10">
                   <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                   <span className="text-[10px] font-black tracking-widest uppercase">Drive Log</span>
                </div>
                <p className="text-[16px] font-black tracking-tighter mt-2 opacity-90">{log.date}</p>
              </div>
              
              {/* 카드 중단 */}
              <div className="flex flex-col gap-1">
                 <h4 className="text-[24px] font-black leading-none tracking-tighter">{log.route}</h4>
                 <p className="text-[12px] font-bold opacity-70 italic">{log.distance} Journey</p>
              </div>

              {/* 하단로고 */}
              <div className="pt-5 border-t border-white/20 text-center">
                 <span className="text-[13px] font-black tracking-[0.3em] uppercase opacity-60">RoadQuest</span>
              </div>
            </div>

            <div className="absolute top-4 right-4 text-2xl drop-shadow-lg">✨</div>
          </div>
        </div>

        {/* 4. 공유 버튼 그리드 */}
        <div className="grid grid-cols-4 gap-4">
          <ShareAction icon={<Instagram size={24} />} label="스토리" color="text-pink-500" bg="bg-pink-50" />
          <ShareAction icon={<MessageCircle size={24} />} label="카톡" color="text-amber-500" bg="bg-amber-50" />
          <ShareAction icon={<Download size={24} />} label="저장" color="text-blue-600" bg="bg-blue-50" />
          <ShareAction icon={<Link2 size={24} />} label="링크" color="text-slate-500" bg="bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

/* --- 서브 컴포넌트: 공유 버튼 --- */
function ShareAction({ icon, label, color, bg }) {
  return (
    <button className="flex flex-col items-center gap-3 group">
      <div className={`w-15 h-15 ${bg} rounded-[1.8rem] flex items-center justify-center ${color} border border-white shadow-sm group-hover:shadow-md group-hover:-translate-y-1 group-active:scale-90 transition-all duration-300`}>
        {React.cloneElement(icon, { strokeWidth: 2.5 })}
      </div>
      <span className="text-[12px] font-black text-slate-500 tracking-tight">{label}</span>
    </button>
  );
}