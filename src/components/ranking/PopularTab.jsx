import React, { useRef, useState } from 'react';
import { Flame, Star, ChevronLeft, ChevronRight, ChevronRight as ArrowRight } from 'lucide-react';

export default function PopularTab() {
  const scrollRef = useRef(null);
  const [showLeftBtn, setShowLeftBtn] = useState(false);

  // 버튼 클릭 시 부드럽게 스크롤하는 함수
  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8; // 화면 너비의 80%만큼 이동
      
      const targetScroll = direction === 'left' 
        ? scrollLeft - scrollAmount 
        : scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  // 스크롤 위치에 따라 왼쪽 버튼 노출 여부 결정
  const onScroll = () => {
    if (scrollRef.current) {
      setShowLeftBtn(scrollRef.current.scrollLeft > 10);
    }
  };

  const topRestAreas = [
    { id: 1, name: "덕평자연휴게소", tag: "영동고속도로", rating: 4.8, img: "https://images.unsplash.com/photo-1545143333-6382b1e58f7a?auto=format&fit=crop&w=800&q=80" },
    { id: 2, name: "시흥하늘휴게소", tag: "수도권제1순환", rating: 4.6, img: "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?auto=format&fit=crop&w=800&q=80" },
    { id: 3, name: "안성휴게소", tag: "경부고속도로", rating: 4.5, img: "https://images.unsplash.com/photo-1582041236132-de88d82d7383?auto=format&fit=crop&w=800&q=80" },
    { id: 4, name: "가평휴게소", tag: "서울양양고속도로", rating: 4.7, img: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80" },
  ];

  return (
    <div className="py-6 space-y-10">
      {/* 1. 휴게소 랭킹 캐러셀 */}
      <section className="relative group"> {/* group 설정으로 버튼 제어 */}
        <div className="px-6 mb-4 flex items-center justify-between">
          <h3 className="text-[20px] font-black text-slate-900 tracking-tighter flex items-center gap-2">
            <Flame className="text-orange-500 fill-orange-500" size={20} /> 실시간 인기 휴게소
          </h3>
        </div>

        {/* 좌우 화살표 버튼 (PC에서만 보이고 모바일에서는 숨김 처리 권장) */}
        {showLeftBtn && (
          <button 
            onClick={() => handleScroll('left')}
            className="absolute left-4 top-[55%] -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl border border-slate-100 text-slate-800 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        
        <button 
          onClick={() => handleScroll('right')}
          className="absolute right-4 top-[55%] -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl border border-slate-100 text-slate-800 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110"
        >
          <ChevronRight size={24} />
        </button>

        {/* 가로 스크롤 영역 */}
        <div 
          ref={scrollRef}
          onScroll={onScroll}
          className="flex gap-4 overflow-x-auto px-6 pb-4 no-scrollbar scroll-smooth scrollbar-hide"
        >
          {topRestAreas.map((item, idx) => (
            <div key={item.id} className="min-w-[280px] relative active:scale-95 transition-all ">
              <div className="absolute top-4 left-4 z-10 bg-blue-600 text-white px-3 py-1 rounded-full font-black text-[12px] shadow-lg">
                {idx + 1}위
              </div>
              
              <div className="h-[360px] rounded-[2.5rem] overflow-hidden relative shadow-xl shadow-slate-200">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                
                <div className="absolute bottom-8 left-6 right-6 text-white">
                  <p className="text-blue-300 text-[12px] font-black mb-1 uppercase tracking-widest">{item.tag}</p>
                  <h4 className="text-[22px] font-black leading-tight mb-2">{item.name}</h4>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star size={14} fill="currentColor" />
                    <span className="text-[14px] font-bold text-white/90">{item.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. 인기 메뉴 랭킹 (슬림 리스트) */}
      <section className="px-6">
        <h3 className="text-[20px] font-black text-slate-900 tracking-tighter mb-5">
          지금 가장 많이 찾는 메뉴 🍜
        </h3>
        <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 divide-y divide-slate-50">
          {['소떡소떡', '한우국밥', '호두과자', '수제 돈가스'].map((menu, idx) => (
            <div key={menu} className="py-4 flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-4">
                <span className={`text-[18px] font-black ${idx < 2 ? 'text-blue-600' : 'text-slate-300'}`}>
                  {idx + 1}
                </span>
                <span className="font-black text-slate-700">{menu}</span>
              </div>
              <ArrowRight size={18} className="text-slate-200 group-hover:text-blue-600 transition-colors" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}