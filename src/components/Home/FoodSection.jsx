import React, { useState, useEffect } from 'react'; // 1. useState, useEffect 추가
import axios from 'axios'; // 2. axios 추가
import DiningItem from './DiningItem';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChefHat } from 'lucide-react';

export default function FoodSection() {
  const navigate = useNavigate();

  // 3. mockData 대신 서버 데이터를 담을 상태(State) 선언
  const [bestFoods, setBestFoods] = useState([]); 

  // 4. 컴포넌트가 켜질 때 서버에서 데이터를 가져옴
  useEffect(() => {
    const fetchBestFoods = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/main/best-food');
        setBestFoods(response.data); // 서버에서 온 데이터(3개) 저장
      } catch (error) {
        console.error("베스트 푸드 로딩 실패:", error);
      }
    };
    fetchBestFoods();
  }, []);

  const handleItemClick = (restAreaId) => {
    // App.jsx 설정에 맞춰 /detail/615 형태로 이동
    navigate(`/detail/${restAreaId}`);
  };

  return (
    <section className="max-w-[480px] mx-auto bg-transparent py-8 px-6">
      
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
        <button className="flex items-center gap-1 text-[16px] font-black text-[#3182CE]">
          전체보기
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="flex flex-col gap-5">
        {bestFoods.map((item, index) => (
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

      {/* 하단 배너 (기존과 동일) */}
      <div className="mt-10 bg-slate-900 rounded-[2rem] p-6 relative overflow-hidden group">
        <div className="relative z-10">
          <p className="text-blue-400 font-black text-[12px] mb-1">TIP</p>
          <h4 className="text-white font-bold text-[15px] leading-snug">
            실시간 고속도로 맛집 정보는<br/>
            매일 오전 서버 데이터로 업데이트됩니다.
          </h4>
        </div>
        <ChefHat size={80} className="absolute -right-4 -bottom-4 text-white/10 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
      </div>

    </section>
  );
}