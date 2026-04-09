import React from 'react';
import { Navigation, Zap, Fuel, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LowestGasPriceRanking({ data }) {
const navigate = useNavigate();

  if (!data || data.length === 0) return null;
  
  const filteredData = data
    .filter(item => {
      const name = item.dbName || item.name || "";
      return name.includes("주유소") || name.includes("충전소");
    })
    .reduce((acc, current) => {
      const x = acc.find(item => item.stdRestCd === current.stdRestCd);
      if (!x) return acc.concat([current]);
      else return acc;
    }, []);

  const top5 = filteredData.slice(0, 5);

  const handleDetailMove = (id) => {
    if (!id) return;
    navigate(`/detail/${id}`);
  };

  return (
    <section className="bg-[#F8FAFC] py-20 px-6">
      {/* 헤더 영역 */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-blue-100">
            Best Value
          </span>
        </div>
        <h2 className="text-[32px] font-black text-slate-900 tracking-tighter leading-tight">
          오늘의 <span className="text-blue-600">최저가</span> 주유소
          <br />
        </h2>
      </div>

      {/* 리스트 영역 */}
      <div className="max-w-2xl mx-auto space-y-4">
        {top5.map((gas, index) => (
          <div
            key={gas.id || gas.stdRestCd || index}
            onClick={() => handleDetailMove(gas.stdRestCd || gas.id)}
            className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-6 transition-all hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] hover:border-blue-200 cursor-pointer active:scale-[0.98]"
          >
            {/* 배경 순위 숫자 (은은한 데코) */}
            <span className="absolute right-8 top-1/2 -translate-y-1/2 text-[80px] font-black text-slate-50 group-hover:text-blue-50/50 transition-colors pointer-events-none italic z-0">
              {index + 1}
            </span>

            <div className="relative z-10 flex flex-col gap-6">
              {/* 상단: 휴게소 정보 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-[18px] shadow-sm ${
                    index === 0 ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-[19px] text-slate-900 tracking-tight">
                      {gas.dbName || gas.name}
                    </span>
                    <div className="flex items-center gap-1 text-slate-400">
                      <Navigation size={10} strokeWidth={3} />
                      <span className="text-[12px] font-bold uppercase tracking-tight">{gas.routeName}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
              </div>

              {/* 하단: 가격 정보 (여기가 핵심!) */}
              <div className="grid grid-cols-2 gap-3">
                {/* 휘발유 카드 */}
                <div className="bg-slate-50/80 rounded-3xl p-4 flex flex-col items-center border border-slate-100 group-hover:bg-white group-hover:border-blue-100 transition-all">
                  <span className="text-[15px] font-black text-slate-400 mb-1 uppercase tracking-widest">휘발유</span>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-[24px] font-black text-slate-900 tracking-tighter">
                      {gas.gasolinePrice?.toLocaleString()}
                    </span>
                    <span className="text-[13px] font-bold text-slate-400">원</span>
                  </div>
                </div>

                {/* 경유 카드 */}
                <div className="bg-slate-50/80 rounded-3xl p-4 flex flex-col items-center border border-slate-100 group-hover:bg-white group-hover:border-blue-100 transition-all">
                  <span className="text-[15px] font-black text-slate-400 mb-1 uppercase tracking-widest">경유</span>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-[24px] font-black text-slate-900 tracking-tighter">
                      {gas.dieselPrice?.toLocaleString()}
                    </span>
                    <span className="text-[13px] font-bold text-slate-400">원</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 푸터 안내 */}
      <div className="mt-10 text-center">
        <p className="text-[13px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
          <Zap size={14} className="text-blue-500 fill-blue-500" />
          실시간 가격 정보를 기반으로 산출되었습니다.
        </p>
      </div>
    </section>
  );
}