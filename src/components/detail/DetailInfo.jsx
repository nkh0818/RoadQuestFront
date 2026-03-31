import React, { useState } from "react";
import { Star, Wifi, Zap, Fuel, ChevronRight, ChevronDown, Sparkles, Utensils, Bell } from "lucide-react";

export default function DetailInfo({ data }) {
  // 1. 데이터가 잘 들어오는지 확인 (브라우저 F12 콘솔 확인용)
  console.log("DetailInfo에 전달된 data:", data);

  const { info, food, events } = data || {};
  const [menuVisible, setMenuVisible] = useState(5);

  // 2. 이벤트 정렬
  const sortedEvents = events
    ? [...events].sort((a, b) => {
        const dateA = a.stime || "";
        const dateB = b.stime || "";
        return dateB.localeCompare(dateA);
      })
    : [];

  // 3. 유가 정보 가져오기 (필드명이 다를 경우를 대비해 || 로 모두 체크)
  // info.gasolinePrice 혹은 info.gasoline_price 둘 다 확인
  const getGasoline = () => {
    const val = info?.gasolinePrice || info?.gasoline_price || 0;
    const num = Number(val);
    return num > 0 ? num.toLocaleString() : "정보없음";
  };

  const getDiesel = () => {
    const val = info?.diselPrice || info?.disel_price || 0;
    const num = Number(val);
    return num > 0 ? num.toLocaleString() : "정보없음";
  };

  const getLpg = () => {
    const val = info?.lpgPrice || info?.lpg_price || 0;
    const num = Number(val);
    return num > 0 ? num.toLocaleString() : "정보없음";
  };

  const fuelData = [
    { type: "휘발유", price: getGasoline(), color: "text-blue-600" },
    { type: "경유", price: getDiesel(), color: "text-slate-800" },
    { type: "LPG", price: getLpg(), color: "text-emerald-500" },
  ];

  return (
    <main className="flex-1 bg-[#F8FAFC] pt-12 pb-36 relative z-30 font-sans rounded-t-[3rem] -mt-12 shadow-[0_-30px_60px_rgba(0,0,0,0.5)]">
      
      {/* 서비스 태그 */}
      <section className="px-6 grid grid-cols-2 gap-4 mb-12">
        <ServiceTag icon={ <Wifi size={ 24 } /> } label="초고속 와이파이" sub="Free Wi-Fi" />
        <ServiceTag icon={ <Zap size={ 24 } /> } label="전기차 충전소" sub="EV Charging" />
      </section>

      {/* 이벤트 */}
      <InfoSection title="이벤트" subTitle="현재 진행중인 이벤트" icon={ <Bell size={ 24 } className="text-blue-500" /> }>
        { !sortedEvents || sortedEvents.length === 0 ? (
          <div className="flex items-center justify-center py-10 bg-white rounded-[2rem] border border-slate-100">
            <p className="text-[13px] font-bold text-slate-300">이벤트 정보가 없습니다.</p>
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
            { sortedEvents.slice(0, 3).map((item, index) => (
              <EventRow key={ item.id || index } item={ item } index={ index + 1 } />
            )) }
          </div>
        ) }
      </InfoSection>

      {/* 에너지 스테이션 */}
      <InfoSection title="에너지 스테이션" subTitle="오늘의 유가 정보">
        <div className="bg-white rounded-[2.5rem] p-2 shadow-sm border border-slate-100 overflow-hidden">
          { fuelData.map((fuel, i) => (
            <FuelCard key={ fuel.type } { ...fuel } grade={ info?.oilCompany } isLast={ i === fuelData.length - 1 } />
          )) }
        </div>
      </InfoSection>

      {/* 메뉴 */}
      <InfoSection title="메뉴" subTitle="베스트 & 추천 메뉴" hasMore={ food?.length > menuVisible } onShowMore={ () => setMenuVisible(prev => prev + 5) }>
        { !food || food.length === 0 ? (
          <div className="flex items-center justify-center py-10 bg-white rounded-[2rem] border border-slate-100">
            <p className="text-[13px] font-bold text-slate-300">메뉴 정보가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-3">
            { food.slice(0, menuVisible).map((item, i) => (
              <DiningItem key={ item.id || i } item={ item } />
            )) }
          </div>
        ) }
      </InfoSection>
    </main>
  );
}

// --- 하위 컴포넌트들 (기존과 동일하게 유지) ---

function InfoSection({ title, subTitle, icon, children, onShowMore, hasMore }) {
  return (
    <section className="px-6 mb-12">
      <div className="flex justify-between items-end mb-5 px-2">
        <div>
          { subTitle && <p className="text-[11px] font-black text-blue-500 uppercase tracking-widest mb-1">{ subTitle }</p> }
          <div className="flex items-center gap-2">
            { icon }
            <h3 className="text-[24px] font-black text-slate-900 tracking-tighter">{ title }</h3>
          </div>
        </div>
      </div>
      { children }
      { onShowMore && hasMore && (
        <button onClick={ onShowMore } className="mt-4 w-full flex items-center justify-center gap-2 py-4 rounded-[2rem] bg-blue-50 border border-blue-100 text-blue-600 font-black text-[14px] hover:bg-blue-600 hover:text-white transition-all active:scale-[0.98]">
          더보기 <ChevronDown size={ 18 } strokeWidth={ 2.5 } />
        </button>
      ) }
    </section>
  );
}

function EventRow({ item, index }) {
  const [isOpen, setIsOpen] = useState(false);
  const period = `${ item.stime || '' } ~ ${ item.etime || '' }`;
  return (
    <div>
      <button onClick={ () => setIsOpen(!isOpen) } className="w-full flex items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-slate-50 active:bg-blue-50">
        <span className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-50 text-[11px] font-black text-blue-500">{ index }</span>
        <span className="flex-1 min-w-0 text-[14px] font-bold text-slate-800 line-clamp-2">{ item.eventNm }</span>
        <span className="shrink-0 text-[11px] font-bold text-slate-400 whitespace-nowrap">{ period !== " ~ " ? period : "" }</span>
        <ChevronDown size={ 16 } strokeWidth={ 2.5 } className={ `shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-blue-500" : ""}` } />
      </button>
      { isOpen && (
        <div className="px-5 pb-5 pt-1 border-t border-slate-50 bg-blue-50/40">
          <p className="text-[13px] font-bold text-slate-500 leading-relaxed whitespace-pre-wrap">{ item.eventDetail || "상세 내용이 없습니다." }</p>
        </div>
      ) }
    </div>
  );
}

function ServiceTag({ icon, label, sub }) {
  return (
    <div className="flex flex-col items-center text-center gap-2 p-5 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">{ icon }</div>
      <div>
        <p className="text-[13px] font-black text-slate-800 tracking-tight">{ label }</p>
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">{ sub }</p>
      </div>
    </div>
  );
}

function FuelCard({ type, price, grade, color, isLast }) {
  const isNoData = price === "정보없음";
  return (
    <div className={ `flex items-center gap-4 p-5 transition-all ${!isLast ? 'border-b border-slate-50' : ''}` }>
      <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200"><Fuel size={ 24 } strokeWidth={ 2.5 } /></div>
      <div className="flex-1 flex justify-between items-center">
        <div>
          <span className="font-black text-slate-900 text-[17px]">{ type }</span>
          <p className="text-[11px] font-bold text-slate-300 uppercase leading-none mt-1">{ grade || "주유소" }</p>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={ `text-[24px] font-black tracking-tighter ${isNoData ? 'text-slate-400 text-[16px]' : color}` }>{ price }</span>
          { !isNoData && <span className="text-[13px] font-bold text-slate-300 uppercase">원</span> }
        </div>
      </div>
    </div>
  );
}

function DiningItem({ item }) {
  return (
    <div className="group flex items-start gap-4 p-4 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-blue-200 transition-all active:scale-[0.98]">
      <div className="w-14 h-14 bg-orange-50 rounded-[1.5rem] flex items-center justify-center text-[24px] group-hover:bg-orange-100 transition-colors shrink-0">
        { item.foodName?.includes("가스") || item.foodName?.includes("가츠") || item.foodName?.includes("까스") ? "🍱" : item.foodName?.includes("면") ? "🍜" : "🍲" }
      </div>
      <div className="flex-1 min-w-0 flex justify-between items-start gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-black text-[17px] text-slate-900 tracking-tight line-clamp-2 max-w-[180px]">{ item.foodName }</h4>
            { item.isBest === 1 && <span className="bg-orange-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shrink-0">BEST</span> }
          </div>
          <span className="text-[12px] font-bold text-slate-400">{ item.category }</span>
        </div>
        <div className="text-right shrink-0 pt-0.5">
          <span className="text-[18px] font-black text-slate-900 tracking-tighter">{ Number(item.price).toLocaleString() }</span>
          <span className="text-[12px] font-bold text-slate-300 ml-0.5">원</span>
        </div>
      </div>
    </div>
  );
}