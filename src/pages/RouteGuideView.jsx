import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, User, MapPin, Compass, Navigation, Utensils, 
  Camera, PartyPopper, Sparkles, ChevronRight, Coffee, Mountain 
} from 'lucide-react';
import SubHeader from '../components/common/SubHeader';
import axios from 'axios';
import toast from 'react-hot-toast';

// STEP 02용 지역 데이터
const regionOptions = [
  { id: '서울', label: '서울' }, { id: '인천', label: '인천' }, { id: '경기', label: '경기' },
  { id: '강원', label: '강원' }, { id: '세종', label: '세종' }, { id: '대전', label: '대전' },
  { id: '충남', label: '충남' }, { id: '충북', label: '충북' }, { id: '부산', label: '부산' },
  { id: '울산', label: '울산' }, { id: '대구', label: '대구' }, { id: '경남', label: '경남' },
  { id: '경북', label: '경북' }, { id: '광주', label: '광주' }, { id: '전남', label: '전남' },
  { id: '전북', label: '전북' }, { id: '제주', label: '제주' }
];

export default function RouteGuideView() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 유저 선택 데이터
  const [selection, setSelection] = useState({
    companion: '',     // 동행자
    destination: '',   // 지역명
    priority: ''       // 테마/우선순위
  });

  // 다음 단계 이동 및 최종 제출
  const handleNext = (field, value) => {
    const newSelection = { ...selection, [field]: value };
    setSelection(newSelection);
    window.scrollTo(0, 0);

    if (step < 3) {
      setStep(step + 1);
    } else {
      finishAnalysis(newSelection);
    }
  };

  // 분석 애니메이션 및 API 통신
  const finishAnalysis = async (finalData) => {
    setIsAnalyzing(true);
    const minWait = new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const [response] = await Promise.all([
        axios.get('/api/recommend', {
          params: {
            companion: finalData.companion,
            priority: finalData.priority,
            region: finalData.destination // 선택한 지역 정보
          }
        }),
        minWait
      ]);

      // 결과 페이지로 이동 (방금 만든 결과 뷰 경로 확인 필수!)
      navigate('/ai-guide-result', { 
        state: { 
          recommendations: response.data,
          selection: finalData
        } 
      });

    } catch (error) {
      console.error("분석 오류:", error);
      toast.error("데이터를 가져오는 중 오류가 발생했습니다.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isAnalyzing) return <AnalysisLoading />;

  return (
    <div className="min-h-screen bg-white font-['Pretendard'] pb-10">
      <SubHeader title="AI 맞춤 경로 가이드" />
      
      {/* 프로그레스 바 */}
      <div className="px-6 pt-4">
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-700 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-[12px] font-black text-blue-600 uppercase tracking-wider">Step 0{step}</p>
          <p className="text-[12px] font-bold text-slate-300">{step} / 3</p>
        </div>
      </div>

      <main className="p-6 pt-8">
        {/* STEP 01: 동행자 선택 */}
        {step === 1 && (
          <QuestionContainer 
            title={"누구와 함께 떠나시나요?"}
            description="인원수에 맞춘 최고의 경험을 선물하려 합니다"
            step={1}
          >
            <div className="space-y-4">
              <BigOptionButton 
                opt={{ id: 'solo', label: '혼자 가요', icon: <User />, sub: '혼자만의 여유로운 드라이브' }}
                onSelect={() => handleNext('companion', 'solo')}
              />
              <BigOptionButton 
                opt={{ id: 'group', label: '가족/친구와 함께', icon: <Users />, sub: '누군가와 함께하는 즐거운 여행' }}
                onSelect={() => handleNext('companion', 'group')}
              />
            </div>
          </QuestionContainer>
        )}

        {/* STEP 02: 지역 선택 (그리드) */}
        {step === 2 && (
          <QuestionContainer 
            title={"어느 지역으로\n향하고 계신가요?"}
            description="목적지 방향의 휴게소를 탐색합니다."
            step={2}
          >
            <div className="grid grid-cols-3 gap-3">
              {regionOptions.map((region) => (
                <button
                  key={region.id}
                  onClick={() => handleNext('destination', region.id)}
                  className="h-16 flex items-center justify-center rounded-[1.2rem] bg-slate-50 border border-slate-100 text-[15px] font-black text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-lg hover:shadow-blue-100 transition-all active:scale-[0.95]"
                >
                  {region.label}
                </button>
              ))}
              <button
                onClick={() => handleNext('destination', 'none')}
                className="col-span-3 h-14 mt-2 rounded-[1.2rem] bg-slate-100 text-slate-500 font-bold text-[14px] active:scale-[0.98] transition-all"
              >
                목적지 없이 드라이브 중이에요
              </button>
            </div>
          </QuestionContainer>
        )}

        {/* STEP 03: 취향 선택 */}
        {step === 3 && (
          <QuestionContainer 
            title={"어떤 테마의 휴게소를 찾아볼까요?"}
            description="가장 기다려지는 휴게소 경험을 선택해 주세요."
            step={3}
          >
            <div className="space-y-4">
              <BigOptionButton 
                opt={{ id: 'food', label: '맛집 탐방', icon: <Utensils />, sub: '실패 없는 지역 대표 별미를 먹어보고 싶어요' }}
                onSelect={() => handleNext('priority', 'food')}
              />
              <BigOptionButton 
                opt={{ id: 'scenery', label: '조용하고 경치 좋은 곳에서 커피 한 잔', icon: <Coffee />, sub: '여유를 즐기고 싶어요' }}
                onSelect={() => handleNext('priority', 'scenery')}
              />
              <BigOptionButton 
                opt={{ id: 'event', label: '다양한 테마 시설', icon: <Sparkles />, sub: '이것저것 볼거리가 있었으면 좋겠어요' }}
                onSelect={() => handleNext('priority', 'event')}
              />
            </div>
          </QuestionContainer>
        )}
      </main>
    </div>
  );
}

// 질문 레이아웃 컨테이너
function QuestionContainer({ title, description, children, step }) {
  return (
    <div key={step} className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-[26px] font-black text-slate-900 leading-tight mb-3 whitespace-pre-line">
        {title}
      </h2>
      <p className="text-[15px] font-bold text-slate-400 mb-10">
        {description}
      </p>
      {children}
    </div>
  );
}

// 큰 버튼 스타일
function BigOptionButton({ opt, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className="w-full flex items-center justify-between p-6 rounded-[2.2rem] bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group active:scale-[0.98]"
    >
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 bg-white rounded-[1.2rem] flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:shadow-lg group-hover:shadow-blue-100 transition-all">
          {React.cloneElement(opt.icon, { size: 24 })}
        </div>
        <div className="text-left">
          <p className="text-[18px] font-black text-slate-800">{opt.label}</p>
          <p className="text-[13px] font-bold text-slate-400">{opt.sub}</p>
        </div>
      </div>
      <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
    </button>
  );
}

// 분석 중 로딩 뷰
function AnalysisLoading() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-10">
        <div className="w-24 h-24 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-400 animate-pulse" size={32} />
      </div>
      <h2 className="text-2xl font-black text-white mb-3 tracking-tight">AI가 최적의 휴게소를<br />분석하고 있습니다</h2>
      <p className="text-slate-400 font-bold text-[14px]">잠시만 기다려주세요...</p>
      
      <div className="mt-12 space-y-2 opacity-60">
        {['데이터베이스 정밀 필터링 중...', '사용자 선호 테마 가중치 계산 중...', '최적의 추천 경로 매칭 완료'].map((text, i) => (
          <p key={i} className={`text-[11px] text-blue-400 font-mono animate-pulse delay-${i * 150}`}>
            # {text}
          </p>
        ))}
      </div>
    </div>
  );
}