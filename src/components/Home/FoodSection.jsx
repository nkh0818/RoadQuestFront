import React from 'react';
import DiningItem from './DiningItem';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChefHat } from 'lucide-react';

export default function FoodSection() {

  const navigate = useNavigate();

  // 더미데이터
  const mockData = [
    { 
      id: 1, 
      restAreaId: "A001", // 상세페이지 이동을 위한 ID
      name: "말죽거리 소고기 국밥", 
      restArea: "천안 휴게소", 
      type: "FOOD", 
      price: 9500, 
      rating: 5.0, 
      reviews: 1240,
      image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=200" 
    },
    { 
      id: 2, 
      restAreaId: "A002",
      name: "한우 떡더덕 스테이크", 
      restArea: "죽전 휴게소", 
      type: "FOOD", 
      price: 11000, 
      rating: 4.8, 
      reviews: 425,
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200"
    },
    { 
      id: 4, 
      restAreaId: "A003",
      name: "수제 등심 돈가스", 
      restArea: "망향 휴게소", 
      type: "FOOD", 
      price: 13500, 
      rating: 4.7, 
      reviews: 215,
      image: "https://images.unsplash.com/photo-1594971475674-6a97f8fe8c2b?w=200"
    }
  ];

  const handleItemClick = (restAreaId) => {
    navigate(`/detail/${restAreaId}`);
  };

  return (
    <section className="max-w-[480px] mx-auto bg-transparent py-8 px-6">
      
      {/* 1. 섹션 헤더 디자인 강화 */}
      <div className="flex justify-between items-end mb-8 px-1">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 w-1.5 h-1.5 rounded-full animate-pulse" />
            <p className="text-[#3182CE] font-black text-[12px] uppercase tracking-[0.2em]">Hot Menus</p>
          </div>
          <h3 className="text-[26px] font-black text-slate-900 tracking-tighter leading-none">
            지금 <span className="text-[#3182CE]">인기있는</span> 메뉴
          </h3>
        </div>
        <button className="flex items-center gap-1 text-[16px] font-black text-[#3182CE]  transition-colors">
          전체보기
          <ArrowRight size={14} />
        </button>
      </div>

      {/* 리스트 */}
      <div className="flex flex-col gap-5">
        {mockData.map((item, index) => (
          <div 
            key={item.id} 
            onClick={() => handleItemClick(item.restAreaId)}
            className="group relative cursor-pointer"
          >
            {/* 랭킹 뱃지 */}
            <div className="absolute -left-2 -top-2 z-20 w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-[14px] shadow-lg group-hover:bg-[#3182CE] transition-colors">
              {index + 1}
            </div>

            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_15px_40px_-10px_rgba(0,0,0,0.06)] border border-slate-100 hover:shadow-[0_25px_50px_-12px_rgba(49,130,206,0.15)] transition-all duration-300">
               <DiningItem item={item} />
            </div>
          </div>
        ))}
      </div>

      {/* 하단 배너 */}
      <div className="mt-10 bg-slate-900 rounded-[2rem] p-6 relative overflow-hidden group">
        <div className="relative z-10">
          <p className="text-blue-400 font-black text-[12px] mb-1">TIP</p>
          <h4 className="text-white font-bold text-[15px] leading-snug">
            실시간 고속도로 맛집 정보는<br/>
            매일 오전 ---에 업데이트됩니다.
          </h4>
        </div>
        <ChefHat size={80} className="absolute -right-4 -bottom-4 text-white/10 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
      </div>

    </section>
  );
}