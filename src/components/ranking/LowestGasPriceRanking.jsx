import React from 'react';
import { Fuel, Navigation, Zap, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LowestGasPriceRanking({ data }) {
  const navigate = useNavigate();

  if (!data || data.length === 0) return null;
  const top5 = data.slice(0, 5);

  const handleDetailMove = (id) => {
    if (!id) return;
    navigate(`/detail/${id}`);
  };

  return (
    <section className="bg-slate-50/50 py-16 px-5 overflow-hidden">
      <div className="flex justify-between items-end mb-10 max-w-4xl mx-auto">
        <div className="text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 rounded-xl mb-3 shadow-lg shadow-blue-600/20">
            <Zap className="text-white fill-white" size={12} />
            <span className="text-[11px] font-black text-white uppercase tracking-widest">Lowest Price1</span>
          </div>
          <h2 className="text-[28px] font-black text-slate-950 tracking-tighter leading-none">
            오늘의 <span className="text-blue-600 underline underline-offset-8 decoration-blue-100">최저가</span> 주유소
          </h2>
        </div>
      </div>

      <div className="space-y-5 max-w-4xl mx-auto">
        {top5.map((gas, index) => (
          <div
            key={gas.id || gas.stdRestCd || index}
            onClick={() => handleDetailMove(gas.stdRestCd || gas.id)}
            className="group relative overflow-hidden bg-white border border-slate-100 rounded-[2.5rem] p-7 transition-all hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:border-blue-100 cursor-pointer active:scale-[0.99]"
          >
            <span className="absolute -right-3 -bottom-5 text-[100px] font-black text-slate-50 group-hover:text-blue-50/50 transition-colors select-none leading-none z-0 italic">
              {index + 1}
            </span>

            <div className="relative z-10 flex flex-wrap items-center gap-x-8 gap-y-6">
              <div className="flex items-center gap-4 flex-grow min-w-[220px]">
                <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center font-black text-[22px] shadow-sm shrink-0 transition-transform group-hover:rotate-6 ${
                  index === 0 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {index + 1}
                </div>
                <div className="flex flex-col gap-1.5 min-w-0">
                  <span className="font-black text-[20px] text-slate-900 tracking-tight truncate">
                    {gas.dbName || gas.name}
                  </span>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-100 rounded-xl self-start">
                    <Navigation size={12} className="text-slate-400" />
                    <span className="text-[12px] font-bold text-slate-500 truncate max-w-[140px]">{gas.routeName}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 shrink-0 ml-auto w-full md:w-auto">
                <div className="flex-1 md:w-[160px] flex flex-col items-center bg-blue-600 px-6 py-4 rounded-[1.5rem] shadow-xl shadow-blue-900/20 border border-blue-600 group-hover:scale-105 transition-transform duration-300">
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-[0.15em] mb-1.5">Gasoline</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[26px] font-black text-white leading-none tracking-tighter">
                      {gas.gasolinePrice?.toLocaleString()}
                    </span>
                    <span className="text-[14px] font-black text-amber-300">원</span>
                  </div>
                </div>

                <div className="flex-1 md:w-[140px] flex flex-col items-center bg-slate-50 px-5 py-4 rounded-[1.5rem] border border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1.5">Diesel</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[20px] font-black text-slate-700 leading-none tracking-tighter">
                      {gas.dieselPrice?.toLocaleString()}
                    </span>
                    <span className="text-[12px] font-bold text-slate-400">원</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12 max-w-lg mx-auto p-5 bg-white rounded-3xl border border-slate-100 shadow-sm">
        <p className="text-[14px] text-slate-800 font-bold tracking-tight mb-1">
          💡 실시간 데이터 기반 <span className="text-blue-600">최저가 랭킹</span>입니다.
        </p>
        <p className="text-[11px] text-slate-400 font-semibold">
          가격은 현장 상황에 따라 소폭 변동될 수 있습니다.
        </p>
      </div>
    </section>
  );
}