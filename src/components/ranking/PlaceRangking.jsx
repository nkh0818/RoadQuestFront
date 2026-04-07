import React, { useState, useRef } from 'react';
import { Heart, ChevronRight, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HotPlaceRanking({ data }) {
  const [scrollIndex, setScrollIndex] = useState(0);
  const scrollRef = useRef(null);
  const [isDrag, setIsDrag] = useState(false);
  const [startX, setStartX] = useState(0);
  const [moved, setMoved] = useState(false);

  const navigate = useNavigate();

  if (!data || data.length === 0) return null;
  const top10 = data.slice(0, 10);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const index = Math.round(scrollLeft / (260 + 16));
      if (index !== scrollIndex) setScrollIndex(index);
    }
  };

  const onDragStart = (e) => {
    setIsDrag(true);
    setMoved(false); // 시작할 땐 움직이지 않음
    setStartX(e.pageX + scrollRef.current.scrollLeft);
  };

  const onDragMove = (e) => {
    if (!isDrag) return;
    e.preventDefault();
    setMoved(true); // 마우스가 움직이면 드래그로 간주
    scrollRef.current.scrollLeft = startX - e.pageX;
  };

  const onDragEnd = () => setIsDrag(false);

  // 🚩 클릭 시 이동 함수
  const handleItemClick = (id) => {
    if (moved) return; // 드래그 중이었다면 이동 안 함
    if (!id) return;
    navigate(`/detail/${id}`);
  };

  return (
    <section className="py-16 bg-white overflow-hidden">

      <div className="flex justify-between items-end px-8 mb-10">
        <div className="text-left">
          <p className="text-blue-600 font-black text-[12px] tracking-[0.25em] mb-2 uppercase">Trending Now</p>
          <h3 className="text-[28px] font-black text-slate-950 tracking-tighter leading-tight">
            지금 <span className="text-blue-600 underline underline-offset-8 decoration-blue-100">가장 인기 많은</span> 휴게소
          </h3>
        </div>
        <button className="flex items-center gap-1 text-slate-400 text-[14px] font-bold hover:text-blue-600 transition-colors">
          전체보기 <ChevronRight size={16} />
        </button>
      </div>

      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        onMouseDown={onDragStart}
        onMouseMove={onDragMove}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
        className={`flex gap-6 overflow-x-auto px-8 pb-10 snap-x snap-mandatory scrollbar-hide shrink-0 transition-all ${
          isDrag ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{ 
          scrollBehavior: isDrag ? 'auto' : 'smooth',
          userSelect: 'none',
        }}
      >
        {top10.map((place, i) => (
          <div
          onClick={() => handleItemClick(place.stdRestCd || place.id)} 
          key={i} className="min-w-[260px] max-w-[260px] snap-center shrink-0 group">

            <div className="relative w-full aspect-[4/5] rounded-[3rem] overflow-hidden mb-5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] border border-slate-100 transition-transform duration-500 group-hover:-translate-y-2">
              <img 
                src={place.imageUrl || 'https://via.placeholder.com/400x500'} 
                alt={place.dbName}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 pointer-events-none"
              />
              
              <div className="absolute top-6 left-6 w-12 h-12 bg-white/80 backdrop-blur-md rounded-[1.25rem] flex items-center justify-center shadow-lg border border-white/20">
                <span className="text-blue-600 font-black italic text-xl leading-none">{i + 1}</span>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="px-3 pointer-events-none text-left">
              <div className="flex items-center gap-1.5 mb-1">
                <MapPin size={12} className="text-blue-500 fill-blue-500/20" />
                <span className="text-[12px] font-bold text-slate-400 tracking-tight">전국 노선</span>
              </div>
              <h4 className="text-[20px] font-black text-slate-950 tracking-tight truncate">
                {place.dbName}
              </h4>
            </div>
          </div>
        ))}
        <div className="min-w-[20px] shrink-0" />
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {top10.map((_, i) => (
          <div 
            key={i} 
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === scrollIndex ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200'
            }`} 
          />
        ))}
      </div>
    </section>
  );
}