import { Wifi, Zap, Fuel, Sparkles, Bell } from "lucide-react";
import useDetailInfo from "../../hook/useDetailInfo";
import InfoSection from "./InfoSection";
import EventRow from "./EventRow";
import DiningItem from "./DiningItem";

export default function DetailInfoSection({ data }) {
  console.log("DetailInfo에 전달된 data:", data);

  const { info, food, events } = data || {};

  const { menuVisible, showMore, sortedEvents, fuelData } = useDetailInfo({
    info,
    events,
  });

  return (
    <main className="flex-1 bg-[#F8FAFC] pt-12 pb-36 relative z-30 font-sans rounded-t-[3rem] -mt-12 shadow-[0_-30px_60px_rgba(0,0,0,0.5)]">
      {/* AI 리뷰 분석 */}
      {info?.aiSummary ? (
        <InfoSection
          title="AI 리뷰 분석"
          icon={
            <Sparkles size={20} className="text-purple-500 fill-purple-500" />
          }
        >
          <div className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-7 rounded-[2.5rem] border border-indigo-100 shadow-inner">
            {/* 태그 영역: 문자열을 쉼표로 쪼개서 해시태그 형태로 출력 */}
            <div className="flex flex-wrap gap-2 mb-6">
              {info?.aiTags && Array.isArray(info.aiTags) ? (
                info.aiTags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl text-[13px] font-black text-indigo-600 border border-indigo-100 shadow-sm"
                  >
                    #{tag}
                  </span>
                ))
              ) : (
                /* 데이터가 없을 때의 방어 코드 */
                <span className="text-slate-300 text-[12px]">
                  태그 분석 중...
                </span>
              )}
            </div>

            {/* 요약 문구 영역 */}
            <p className="text-[18px] text-slate-600 font-bold leading-relaxed">
              <span className="text-purple-500 mr-2"></span>"{info.aiSummary}"
            </p>

            {/* 감정 분석 결과 표시 */}
            {info.aiScore && (
              <div className="mt-4 text-[12px] text-slate-400 font-medium">
                이 데이터는 AI가 최근 리뷰들을 분석한 결과입니다. (
                {info.aiScore === "POSITIVE"
                  ? "🥰 만족도 높음"
                  : info.aiScore === "NEGATIVE"
                    ? "🤔 주의 필요"
                    : "😐 보통"}
                )
              </div>
            )}
          </div>
        </InfoSection>
      ) : (
        /* AI 데이터가 없을 때만 보여주는 안내문 */
        <p className="text-center text-slate-400 text-[13px] font-bold py-10">
          리뷰가 더 쌓이면 AI 분석이 시작됩니다! 🥔
        </p>
      )}

      {/* 이벤트 */}
      <InfoSection
        title="이벤트"
        subTitle="현재 진행중인 이벤트"
        icon={<Bell size={24} className="text-blue-500" />}
      >
        {!sortedEvents || sortedEvents.length === 0 ? (
          <div className="flex items-center justify-center py-10 bg-white rounded-[2rem] border border-slate-100">
            <p className="text-[13px] font-bold text-slate-300">
              이벤트 정보가 없습니다.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
            {sortedEvents.slice(0, 3).map((item, index) => (
              <EventRow key={item.id || index} item={item} index={index + 1} />
            ))}
          </div>
        )}
      </InfoSection>

      {/* 주유 정보 */}
      {/* 에너지 스테이션 */}
      <InfoSection title="에너지 스테이션" subTitle="오늘의 유가 정보">
        <div className="bg-white rounded-[2.5rem] p-2 shadow-sm border border-slate-100 overflow-hidden">
          {fuelData.map((fuel, i) => (
            <FuelCard
              key={fuel.type}
              {...fuel}
              grade={info?.oilCompany}
              isLast={i === fuelData.length - 1}
            />
          ))}
        </div>
      </InfoSection>

      {/* 메뉴 */}
      <InfoSection
        title="메뉴"
        subTitle="베스트 & 추천 메뉴"
        hasMore={food?.length > menuVisible}
        onShowMore={showMore}
      >
        {!food || food.length === 0 ? (
          <div className="flex items-center justify-center py-10 bg-white rounded-[2rem] border border-slate-100">
            <p className="text-[13px] font-bold text-slate-300">
              메뉴 정보가 없습니다.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {food.slice(0, menuVisible).map((item, i) => (
              <DiningItem key={item.id || i} item={item} />
            ))}
          </div>
        )}
      </InfoSection>
    </main>
  );
}

/* --- 서브 컴포넌트들 --- */

function ServiceTag({ icon, label, sub }) {
  return (
    <div className="flex flex-col items-center text-center gap-2 p-5 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-[13px] font-black text-slate-800 tracking-tight">
          {label}
        </p>
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
          {sub}
        </p>
      </div>
    </div>
  );
}

function FuelCard({ type, price, grade, color, isLast }) {
  return (
    <div
      className={`flex items-center gap-4 p-5 transition-all ${!isLast ? "border-b border-slate-50" : ""}`}
    >
      <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
        <Fuel size={22} strokeWidth={2.5} />
      </div>
      <div className="flex-1 flex justify-between items-center">
        <div>
          <span className="font-black text-slate-900 text-[17px]">{type}</span>
          <p className="text-[11px] font-bold text-slate-300 uppercase leading-none mt-1">
            {grade || "알뜰주유소"}
          </p>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`text-[26px] font-black tracking-tighter ${color}`}>
            {price}
          </span>
          <span className="text-[13px] font-bold text-slate-300 uppercase">
            원
          </span>
        </div>
      </div>
    </div>
  );
}
