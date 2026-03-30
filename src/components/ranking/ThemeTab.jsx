import React, { useRef, useState } from 'react';
import { Star, ArrowRight, MapPin, Heart, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ThemeTab() {
  const sections = [
    {
      title: "📸 찍으면 인생샷! 전망대 휴게소",
      subTitle: "고속도로 위에서 만나는 환상적인 뷰포인트",
      items: [
        { name: "금강휴게소", desc: "강변 조망 테라스 & 수상스키 뷰", score: "4.9", img: "https://images.unsplash.com/photo-1500382017468-9049fee74a62?auto=format&fit=crop&w=600&q=80" },
        { name: "동해휴게소", desc: "동해 바다가 한눈에 들어오는 절경", score: "4.8", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80" },
        { name: "옥계휴게소", desc: "해안선이 보이는 모던한 건축미", score: "4.7", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80" },
        { name: "시흥하늘", desc: "브릿지 위에서 즐기는 도심 뷰", score: "4.6", img: "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?auto=format&fit=crop&w=800&q=80" }
      ]
    },
    {
      title: "🐶 댕댕이가 더 좋아하는 놀이터",
      subTitle: "반려견과 함께 쉬어가는 힐링 스팟",
      items: [
        { name: "덕평 달려라 코코", desc: "국내 최대 규모 애견 파크", score: "5.0", img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80" },
        { name: "죽암휴게소", desc: "천연 잔디 산책로와 쉼터", score: "4.7", img: "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=600&q=80" },
        { name: "진영휴게소", desc: "조용하게 산책하기 좋은 숲길", score: "4.6", img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=600&q=80" }
      ]
    }
  ];

  return (
    <div className="py-8 pb-20 bg-white">
      {sections.map((section, idx) => (
        <ThemeSection key={idx} section={section} isGray={idx % 2 === 1} />
      ))}
    </div>
  );
}

// 개별 섹션 컴포넌트 (버튼 로직 포함)
function ThemeSection({ section, isGray }) {
  const scrollRef = useRef(null);
  const [showLeftBtn, setShowLeftBtn] = useState(false);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.7;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className={`mb-14 relative group ${isGray ? 'bg-slate-50/50 py-10' : ''}`}>
      <div className="px-6 mb-6 flex items-end justify-between">
        <div>
          <h3 className="text-[22px] font-black text-slate-900 tracking-tighter mb-1">{section.title}</h3>
          <p className="text-[14px] font-bold text-slate-400">{section.subTitle}</p>
        </div>
      </div>

      {/* 화살표 내비게이션 버튼 */}
      {showLeftBtn && (
        <button 
          onClick={() => handleScroll('left')}
          className="absolute left-4 top-[60%] -translate-y-1/2 z-20 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-slate-100 text-slate-800 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
        >
          <ChevronLeft size={20} />
        </button>
      )}
      <button 
        onClick={() => handleScroll('right')}
        className="absolute right-4 top-[60%] -translate-y-1/2 z-20 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-slate-100 text-slate-800 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
      >
        <ChevronRight size={20} />
      </button>

      {/* 가로 스크롤 카드 영역 */}
      <div 
        ref={scrollRef}
        onScroll={(e) => setShowLeftBtn(e.target.scrollLeft > 10)}
        className="flex gap-5 overflow-x-auto px-6 scrollbar-hide scroll-smooth"
      >
        {section.items.map((item, i) => (
          <div key={i} className="min-w-[280px] group/card cursor-pointer">
            <div className="relative aspect-[4/3] rounded-[2.2rem] overflow-hidden mb-4 shadow-xl shadow-slate-200/50">
              <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700" />
              <button className="absolute top-5 right-5 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-rose-500 transition-all">
                <Heart size={20} fill="currentColor" strokeWidth={0} />
              </button>
              <div className="absolute bottom-5 left-5 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-2xl flex items-center gap-1 text-[13px] font-black">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                {item.score}
              </div>
            </div>
            <div className="px-1">
              <div className="flex items-center gap-2 mb-1">
                <MapPin size={14} className="text-blue-500" />
                <h4 className="font-black text-[18px] text-slate-800 tracking-tight">{item.name}</h4>
              </div>
              <p className="text-[14px] font-bold text-slate-500 leading-snug break-keep">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}