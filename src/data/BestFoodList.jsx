import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DiningItem from '../components/Home/DiningItem';;
const MainBestFood = () => {
  const [bestFoods, setBestFoods] = useState([]); // 서버 데이터를 담을 상태
  const navigate = useNavigate();

  useEffect(() => {
    // 백엔드에서 만든 API 호출
    const fetchBestFoods = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/main/best-food');
        setBestFoods(response.data); // 서버에서 온 3개의 데이터를 저장
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      }
    };

    fetchBestFoods();
  }, []);

// MainBestFood.jsx 안의 함수
const handleItemClick = (restAreaId) => {
  navigate(`/detail/${restAreaId}`);
};

  return (
    <div className="flex flex-col gap-5">
      {bestFoods.map((item, index) => (
        <div 
          key={item.id} 
          onClick={() => handleItemClick(item.restAreaId)} 
          className="group relative cursor-pointer"
        >
          {/* 랭킹 뱃지 (1, 2, 3) */}
          <div className="absolute -left-2 -top-2 z-20 w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-[14px] shadow-lg group-hover:bg-[#3182CE] transition-colors">
            {index + 1}
          </div>

          <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_15px_40px_-10px_rgba(0,0,0,0.06)] border border-slate-100 hover:shadow-[0_25px_50px_-12px_rgba(49,130,206,0.15)] transition-all duration-300">
             {/* 기존에 만드신 DiningItem 컴포넌트에 item 전달 */}
             <DiningItem item={item} />
          </div>
        </div>
      ))}
    </div>
  );
};
export default MainBestFood;