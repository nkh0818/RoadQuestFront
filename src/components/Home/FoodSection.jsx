import React, { useState, useEffect } from "react";
import { fetchBestFoodsApi } from "../../api/main";
import DiningItem from "./DiningItem";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChefHat, RotateCw } from "lucide-react";
import toast from "react-hot-toast";

export default function FoodSection() {
  const navigate = useNavigate();
  const [bestFoods, setBestFoods] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchBestFoods = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetchBestFoodsApi();
      setBestFoods(response);
    } catch (error) {
      console.error("베스트 푸드 로딩 실패:", error);
      toast.error("데이터를 가져오지 못했어요.");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBestFoods();
  }, []);

  const handleItemClick = (restAreaId) => {
    navigate(`/detail/${restAreaId}`);
  };

  return (
    <section className="mx-auto bg-transparent py-8 px-6">
      <div className="flex justify-between items-end mb-8 px-1">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 w-1.5 h-1.5 rounded-full animate-pulse" />
            <p className="text-blue-600 font-black text-[12px] uppercase tracking-[0.2em]">
              RANDOM CHOICE
            </p>
          </div>
          <h3 className="text-[26px] font-black text-slate-900 tracking-tighter leading-none">
            이런 <span className="text-blue-600">음식</span> 어때요?
          </h3>
        </div>
        <button 
          onClick={fetchBestFoods}
          disabled={isRefreshing}
          className={`flex items-center gap-1 text-[16px] font-black text-blue-600 active:scale-95 transition-all ${isRefreshing ? 'opacity-50' : ''}`}
        >
          <RotateCw size={18} className={isRefreshing ? "animate-spin" : ""} />
          {isRefreshing ? "업데이트 중..." : "새로고침"}
        </button>
      </div>

      <div className="flex flex-col gap-5">
        {bestFoods?.map((item, index) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item.restAreaId)}
            className="group relative cursor-pointer"
          >
            {/* 랭킹 뱃지 */}
            <div className="absolute -left-2 -top-2 z-20 w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-[14px] shadow-lg transition-colors">
              {index + 1}
            </div>

            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_15px_40px_-10px_rgba(0,0,0,0.06)] border border-slate-100 hover:shadow-[0_50px_px_12px_rgba(49,130,206,0.15)] transition-all duration-300">
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
            실시간 고속도로 맛집 정보는
            <br />
            매일 오전 서버 데이터로 업데이트됩니다.
          </h4>
        </div>
        <ChefHat
          size={80}
          className="absolute -right-4 -bottom-4 text-white/10 -rotate-12 group-hover:rotate-0 transition-transform duration-700"
        />
      </div>
    </section>
  );
}
