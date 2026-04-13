import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Star, Utensils, Camera, PartyPopper, Navigation, Fuel } from 'lucide-react';
import SubHeader from '../components/common/SubHeader';
import toast from 'react-hot-toast';

export default function AiGuideResultView() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { recommendations, selection } = location.state || { recommendations: [], selection: {} };
  console.log("AI 추천 리스트 원본 데이터:", recommendations);

  const filteredList = recommendations?.filter(area => !area.dbName.includes('주유소')) || [];

  const getAiMessage = () => {
    const messages = {
      food: "금강산도 식후경!\n맛 평가가 가장 좋은 곳 위주로 찾아왔어요.",
      scenery: "운전 중 힐링 타임!\n뷰가 환상적인 휴게소를 찾아왔어요.",
      event: "지루할 틈 없는 여행!\n특별한 테마가 있는 곳들을 찾아왔어요."
    };
    return messages[selection.priority] || "-- 취향을 완벽 분석한\n최적의 경로입니다!";
  };

  const handleCardClick = () => {
    toast.error("이 휴게소는 준비 중인 가짜 데이터입니다.");
    return;
};

  return (
    <div className="min-h-screen bg-slate-50 font-['Pretendard']">
      <SubHeader title="AI 추천 결과" />

      {/* 1. 상단 요약 섹션 */}
      <div className="bg-white px-6 py-8 rounded-b-[3rem] shadow-sm border-b border-slate-100 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full mb-4">
          <PartyPopper size={14} />
          <span className="text-[12px] font-black uppercase tracking-wider">AI 분석 완료</span>
        </div>
        <h2 className="text-[22px] font-black text-slate-900 leading-tight mb-3 whitespace-pre-line">
          {getAiMessage()}
        </h2>
        <p className="text-[14px] font-bold text-slate-400">
          선택하신 <span className="text-blue-600">#{selection.companion === 'solo' ? '나홀로여행' : '가족동행'}</span> 키워드를 기반으로 매칭했습니다.
        </p>
      </div>

      {/* 2. 추천 리스트 섹션 */}
      <div className="px-6 space-y-6 pb-24">
        <h3 className="text-[16px] font-black text-slate-800 flex items-center gap-2 mb-2">
          AI가 선정한 추천 휴게소
        </h3>

        {filteredList.length > 0 ? (
          <>
            {filteredList.map((area, index) => (
              <div 
                key={area.stdRestCd || index}
                onClick={() => handleCardClick(area)}
                className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 active:scale-[0.98] transition-all relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 bg-blue-600 text-white px-5 py-2 rounded-br-2xl font-black text-[13px] z-10">
                  BEST {index + 1}
                </div>

                <div className="mt-4 flex justify-between items-start">
                  <div>
                    <h4 className="text-[20px] font-black text-slate-900 mb-1">{area.dbName}</h4>
                    <div className="flex items-center gap-3 text-slate-400">
                      <div className="flex items-center gap-1">
                        <Star size={15} className="fill-amber-400 text-amber-400" />
                        <span className="text-[14px] font-bold text-slate-700">{area.rating || '4.5'}</span>
                      </div>
                      <div className="w-[1px] h-3 bg-slate-200" />
                      <span className="text-[14px] font-bold">{area.routeName}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <p className="text-[13px] font-bold text-blue-800 leading-relaxed italic">
                    "{area.aiSummary || "해당 노선에서 리뷰 점수가 가장 높고 테마가 확실한 휴게소입니다."}"
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {area.aiTags && (Array.isArray(area.aiTags) ? area.aiTags : area.aiTags.split(',')).map((tag, idx) => (
                    <span key={idx} className="text-[11px] font-black text-blue-500 bg-white border border-blue-100 px-3 py-1.5 rounded-xl shadow-sm">
                      #{tag.trim()}
                    </span>
                  ))}
                  {!area.aiTags && ['추천스팟', '깔끔시설'].map((tag, idx) => (
                    <span key={idx} className="text-[11px] font-black text-slate-400 bg-slate-100 px-3 py-1.5 rounded-xl">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                <MapPin size={32} />
            </div>
            <p className="text-slate-400 font-bold">해당 지역에 추천할만한<br/>휴게소를 찾지 못했습니다.</p>
            <button 
              onClick={() => navigate(-1)} 
              className="mt-6 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 font-black text-[14px]"
            >
              다시 선택하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}