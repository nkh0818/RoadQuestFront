import React, { useState, useRef } from "react";
import { Heart, ChevronRight, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    setMoved(false);
    setStartX(e.pageX + scrollRef.current.scrollLeft);
  };

  const onDragMove = (e) => {
    if (!isDrag) return;
    e.preventDefault();
    setMoved(true);
    scrollRef.current.scrollLeft = startX - e.pageX;
  };

  const onDragEnd = () => setIsDrag(false);

  const handleItemClick = (id) => {
    if (moved) return;
    if (!id) return;
    navigate(`/detail/${id}`);
  };

  return (
    <section className="py-16 bg-white overflow-hidden">
      {/* 1. 헤더 영역 */}
      <div className="flex justify-between items-end px-8 mb-10">
        <div className="text-left">
          <p className="text-blue-600 font-black text-[12px] tracking-[0.25em] mb-2 uppercase">
            Trending Now
          </p>
          <h3 className="text-[28px] font-black text-slate-950 tracking-tighter leading-tight">
            지금{" "}
            <span className="text-blue-600 underline underline-offset-8 decoration-blue-100">
              가장 인기 많은
            </span>{" "}
            휴게소
          </h3>
        </div>
      </div>

      {/* 2. 카드 리스트 영역 */}
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
          scrollBehavior: isDrag ? "auto" : "smooth",
          userSelect: "none",
        }}
      >
        {top10.map((place, i) => (
          <div
            onClick={() => handleItemClick(place.stdRestCd || place.id)}
            key={i}
            className="min-w-[260px] max-w-[260px] snap-center shrink-0 group cursor-pointer"
          >
            {/* 카드 본체 */}
            <div className="relative w-full aspect-[4/5] rounded-[3rem] overflow-hidden mb-5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] border border-slate-100 transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-blue-200/50">
              <img
                src={
                  place.imageUrl ||
                  `https://picsum.photos/seed/${i + 50}/400/500`
                }
                alt={place.dbName}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 pointer-events-none"
              />

              {/* 순위 배지: 1~3등은 파란색 강조 */}
              <div
                className={`absolute top-6 left-6 w-12 h-12 ${i < 3 ? "bg-blue-600 text-white" : "bg-white/80 text-blue-600"} backdrop-blur-md rounded-[1.25rem] flex items-center justify-center shadow-lg border border-white/20 transition-colors`}
              >
                <span className="font-black italic text-xl leading-none">
                  {i + 1}
                </span>
              </div>

              {/* 하단 그라데이션 (텍스트 가독성 + 분위기) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* 정보 영역 */}
            <div className="px-4 text-left transition-transform duration-500 group-hover:translate-x-1">
              <h4 className="text-[22px] font-black text-slate-950 tracking-tight leading-tight break-keep">
                {place.dbName}
              </h4>
            </div>
          </div>
        ))}
        <div className="min-w-[20px] shrink-0" />
      </div>

      {/* 3. 인디케이터 (Dot) */}
      <div className="flex justify-center gap-2 mt-4">
        {top10.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === scrollIndex ? "w-8 bg-blue-600" : "w-2 bg-slate-200"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
