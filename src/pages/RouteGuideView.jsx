import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, User, MapPin, Compass, Navigation, Utensils, Camera, PartyPopper, Sparkles, ChevronRight, Loader2 } from 'lucide-react';
import SubHeader from '../components/common/SubHeader';

export default function RouteGuideView() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1~3단계 진행
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 유저 선택 데이터 저장 상태
  const [selection, setSelection] = useState({
    companion: '', // 혼자, 여럿이서
    destinationType: '', // 확실한 지역, 목적지1, 목적지 없음
    priority: '' // 풍경, 먹거리, 이벤트
  });

  // 다음 단계로 이동 혹은 완료
  const handleNext = (field, value) => {
    const newSelection = { ...selection, [field]: value };
    setSelection(newSelection);

    if (step < 3) {
      setStep(step + 1);
    } else {
      finishAnalysis(newSelection);
    }
  };

  // 분석 애니메이션 후 결과 페이지 이동
  const finishAnalysis = (finalData) => {
    setIsAnalyzing(true);

    setTimeout(() => {
      setIsAnalyzing(false);
      // [백엔드 연결 포인트] 
      // 실제로는 여기서 axios.get('/api/recommend', { params: finalData }) 를 호출하여 
      // 결과값을 받은 뒤 navigate 할 때 state로 넘겨줌
      navigate('/route-result', { state: { filterData: finalData } });
    }, 2000);
  };

  if (isAnalyzing) return <AnalysisLoading />;

  return (
    <div className="min-h-screen bg-white font-['Pretendard']">
      <SubHeader title="AI 맞춤 경로 가이드" />
      
      {/* 상단 프로그레스 바 */}
      <div className="px-6 pt-4">
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
        <p className="text-[12px] font-black text-blue-600 mt-2">STEP 0{step}</p>
      </div>

      <main className="p-6 pt-10">
        {/* 단계별 질문 섹션 */}
        {step === 1 && (
          <QuestionStep
            title="누구와 함께 하시나요?"
            description="동행자에 따라 최적의 휴게소를 추천해드려요."
            options={[
              { id: 'solo', label: '혼자 가요', icon: <User />, sub: '나만의 여유로운 드라이브' },
              { id: 'group', label: '여럿이서 가요', icon: <Users />, sub: '가족, 친구와 함께 북적북적' }
            ]}
            onSelect={(id) => handleNext('companion', id)}
          />
        )}

        {step === 2 && (
          <QuestionStep
            title="어느 방향으로 가시나요?"
            description="목적지에 맞는 경로상의 휴게소를 탐색합니다."
            options={[
              { id: 'exact', label: '확실한 목적지', icon: <MapPin />, sub: '특정 지역으로 이동 중' },
              { id: 'route1', label: '추천 경로 1', icon: <Navigation />, sub: '주요 고속도로 노선' },
              { id: 'none', label: '목적지 없어요', icon: <Compass />, sub: '어디든 발길 닿는 대로' }
            ]}
            onSelect={(id) => handleNext('destinationType', id)}
          />
        )}

        {step === 3 && (
          <QuestionStep
            title="여행에서 가장 중요한 가치는?"
            description="가장 중요하게 생각하는 포인트 하나를 골라주세요."
            options={[
              { id: 'scenery', label: '풍경, 드라이브', icon: <Camera />, sub: '멋진 뷰와 힐링이 필요해' },
              { id: 'food', label: '금강산도 식후경', icon: <Utensils />, sub: '휴게소 맛집 탐방이 목적' },
              { id: 'event', label: '특별한 이벤트', icon: <PartyPopper />, sub: '체험과 즐길 거리가 가득한 곳' }
            ]}
            onSelect={(id) => handleNext('priority', id)}
          />
        )}
      </main>
    </div>
  );
}

// 질문 단계 컴포넌트
function QuestionStep({ title, description, options, onSelect }) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-[24px] font-black text-slate-900 leading-tight mb-2 whitespace-pre-line">{title}</h2>
      <p className="text-[14px] font-bold text-slate-400 mb-10">{description}</p>
      
      <div className="space-y-4">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className="w-full flex items-center justify-between p-6 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group active:scale-[0.98]"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:shadow-md transition-all">
                {opt.icon}
              </div>
              <div className="text-left">
                <p className="text-[16px] font-black text-slate-800">{opt.label}</p>
                <p className="text-[12px] font-bold text-slate-400">{opt.sub}</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}

// 분석 중 로딩 컴포넌트
function AnalysisLoading() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-10">
        <div className="w-24 h-24 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-400 animate-pulse" size={32} />
      </div>
      <h2 className="text-2xl font-black text-white mb-3">AI가 최적의 휴게소를<br />찾고 있습니다</h2>
      <p className="text-slate-400 font-bold text-[14px]">당신의 취향에 딱 맞는 경로를 매칭 중이에요...</p>
      
      {/* 하단에 분석 중인 척 하는 텍스트 애니메이션 (선택사항) */}
      <div className="mt-12 space-y-2 opacity-50">
        <p className="text-[11px] text-blue-400 font-mono animate-pulse"># 데이터베이스 필터링 중...</p>
        <p className="text-[11px] text-blue-400 font-mono animate-pulse delay-75"># 유저 선호도 가중치 적용 중...</p>
        <p className="text-[11px] text-blue-400 font-mono animate-pulse delay-150"># 최단 경로 및 테마 매칭 완료</p>
      </div>
    </div>
  );
}