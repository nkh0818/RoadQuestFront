import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, ChevronRight, Sparkles } from 'lucide-react';
import SubHeader from '../components/common/SubHeader';
import FadeIn from '../components/common/FadeIn';
import axios from 'axios';

export default function RouteResultPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { start, end, filterData } = location.state || { start: "", end: "" };

  // 상태값 관리
  const [routeResults, setRouteResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // API 호출
  useEffect(() => {
    const fetchRestAreas = async () => {
      if (!start || !end) return;
      
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:8080/api/restareas/search', {
          params: { start, end }
        });

        // 3. 백엔드 데이터를 프론트엔드 UI에 맞게 매핑
        // 백엔드의 findBestMatch 덕분에 이름은 "문경(창원방향)휴게소" 형태의 DB 진짜 데이터로 넘어옴
        const mappedData = response.data.map((item, index) => ({
        id: item['휴게소코드'] || index,
        name: item['휴게소명'],
        distance: "경로상",
        // 휘발유와 경유 값을 각각 매핑 (0원일 경우 '정보없음'으로 표시)
        gasoline: item.gasolinePrice > 0 ? `${item.gasolinePrice.toLocaleString()}원` : "정보없음",
        diesel: item.dieselPrice > 0 ? `${item.dieselPrice.toLocaleString()}원` : "정보없음",
        brand: item['휴게소종류'] || "휴게소", 
        tag: "추천"
      }));

        setRouteResults(mappedData);
      } catch (error) {
        console.error("휴게소 데이터를 가져오는데 실패했습니다.", error);
        alert("경로 탐색 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestAreas();
  }, [start, end]); // 출발지/도착지가 바뀔때마다 실행

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10 flex flex-col">
      {/* 상단 헤더 */}
      <SubHeader
        title={
          <div className="flex items-center gap-4 py-1">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Start</span>
              <span className="text-[18px] font-black text-slate-400 tracking-tighter">{start || "출발지"}</span>
            </div>
            <div className="flex items-center gap-2 pt-3">
              <div className="w-8 h-[1.5px] bg-slate-300 rounded-full" />
              <ArrowRight size={18} className="text-blue-500" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">End</span>
              <span className="text-[24px] font-black text-slate-900 tracking-tighter">{end || "도착지"}</span>
            </div>
          </div>
        }
      />

      <main className="flex-1 px-6 py-8">
        {filterData && (
          <div className="mb-4 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-full shadow-lg shadow-blue-100 animate-bounce">
            <Sparkles size={18} />
            <span className="text-[12px] font-black">AI 맞춤 추천 경로</span>
          </div>
        )}

        <div className="mb-10 relative">
          <div className="absolute -left-6 top-0 w-1 h-12 bg-blue-600 rounded-r-full" />
          <p className="text-[#3182CE] font-black text-[12px] uppercase tracking-[0.2em] mb-1">
            {isLoading ? "경로 탐색 중..." : (filterData ? "AI 최적화 완료" : "휴게소 발견")}
          </p>
          <h3 className="text-[26px] font-black text-slate-900 tracking-tighter leading-tight">
            {isLoading ? (
               <>경로를 분석중입니다.</>
            ) : (
               <>경로상 <span className="text-[#3182CE]">{routeResults.length}개</span>의<br/>휴게소를 찾았습니다.</>
            )}
          </h3>
        </div>

        {/* 로딩 중이 아닐 때만 리스트 렌더링 */}
        {!isLoading && (
          <div className="space-y-0 relative">
            {routeResults.map((item, index) => (
              <FadeIn key={item.id} delay={index * 150}>
                <div className="relative pl-10 pb-10 group">
                  
                  {index !== routeResults.length - 1 && (
                    <div className="absolute left-[13px] top-8 w-[2px] h-full bg-gradient-to-b from-blue-200 to-slate-100" />
                  )}
                  
                  <div className="absolute left-0 top-1 w-7 h-7 rounded-xl bg-white border-2 border-blue-600 flex items-center justify-center z-10 shadow-lg shadow-blue-100 group-hover:bg-blue-600 transition-colors">
                    <span className="text-[11px] font-black text-blue-600 group-hover:text-white">{index + 1}</span>
                  </div>

                  <div 
                    onClick={() => navigate(`/detail/${item.id}`)}
                    className="bg-white p-6 rounded-[2.2rem] shadow-[0_15px_40px_-10px_rgba(0,0,0,0.05)] border border-slate-100 active:scale-[0.97] transition-all hover:border-blue-200 cursor-pointer relative overflow-hidden"
                  >
                    {filterData && (
                      <div className="absolute -right-2 -top-1 bg-emerald-50 text-emerald-600 px-4 py-1 rounded-bl-2xl text-[10px] font-black border-l border-b border-emerald-100">
                        {item.tag} 추천
                      </div>
                    )}

                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-black text-[19px] text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-1 mt-1 text-slate-400">
                          <MapPin size={18} />
                          <span className="text-[12px] font-bold">{item.distance}</span>
                        </div>
                      </div>
                      <ChevronRight className="text-slate-300 group-hover:translate-x-1 transition-all" />
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-black text-[10px]">
                        {item.brand}
                      </div>
                      
                      {/* 휘발유 */}
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">휘발유</span>
                        <span className="text-[14px] font-black text-slate-800">{item.gasoline}</span>
                      </div>
                      
                      {/* 경유 (ml-3 추가해서 간격 띄움) */}
                      <div className="flex flex-col ml-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">경유sssss</span>
                        <span className="text-[14px] font-black text-slate-800">{item.diesel}</span>
                      </div>
                    </div>
                      
                      <button className="bg-slate-900 text-white text-[12px] font-black px-4 py-2 rounded-xl shadow-lg shadow-slate-200">
                        상세보기
                      </button>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}