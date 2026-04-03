import { Map, Trophy, Heart, Star, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function QuickMenuSection({ onInquiryClick }) {
  const navigate = useNavigate();

  return (
    <section className="px-5 py-4 bg-transparent">
      <div className="bg-white rounded-[2.2rem] py-5 px-6 shadow-[0_15px_45px_-12px_rgba(0,0,0,0.06)] border border-slate-100/60 flex items-center justify-around">
        
        <div className="flex items-center gap-5"> 
          <QuickBtn 
            icon={<Map size={22} strokeWidth={2.5} />} 
            label="찾기" 
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
            onClick={() => navigate('/search')}
          />
          <QuickBtn 
            icon={<Trophy size={22} strokeWidth={2.5} />} 
            label="랭킹" 
            bgColor="bg-amber-50"
            iconColor="text-amber-500" 
            onClick={() => navigate('/ranking')}
          />
          <QuickBtn 
            icon={<Heart size={22} strokeWidth={2.5} />} 
            label="장소" 
            bgColor="bg-rose-50"
            iconColor="text-rose-500" 
            onClick={() => navigate('/place')}
          />

          <QuickBtn 
            icon={<Star size={20} strokeWidth={2.5} />} 
            label="리뷰" 
            bgColor="bg-indigo-50"
            iconColor="text-indigo-600"
            onClick={() => navigate('/my-reviews')}
          />
          <QuickBtn 
            icon={<MessageCircle size={20} strokeWidth={2.5} />} 
            label="문의" 
            bgColor="bg-emerald-50"
            iconColor="text-emerald-600"
            onClick={onInquiryClick}
          />
        </div>
      </div>
    </section>
  );
}

function QuickBtn({ icon, label, bgColor, iconColor, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 group transition-all active:scale-90"
    >
      <div className={`w-12 h-12 rounded-[1.1rem] flex items-center justify-center ${bgColor} ${iconColor} transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-0.5`}>
        {icon}
      </div>
      
      <span className="text-[11px] font-black text-slate-500 tracking-tighter break-keep text-center leading-none">
        {label}
      </span>
    </button>
  );
}