import { useSavedStore } from "../store/useSavedStore";
import { MapPin, ChevronRight, Ghost } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SubHeader from "../components/common/SubHeader";
import { useEffect } from "react";

export default function Place() {
  const { fetchFavorites, savedRestAreas } = useSavedStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (savedRestAreas.length === 0) {
      fetchFavorites();
    }
  }, []);

  return (
    <div className="min-h-screen pb-32 font-sans bg-gray-50/30">
      <SubHeader
        title={
          <div className="flex flex-col -space-y-1">
            <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest ml-0.5 mb-2">
              My Favorites
            </p>
            <h2 className="text-[18px] font-black text-gray-900 tracking-tighter">
              찜 목록
            </h2>
          </div>
        }
        // 우측 슬롯에 '총 개수' 정보 전달
        rightElement={
          <span className="text-[14px] font-bold text-gray-400 self-end mb-1">
            총 <span className="text-blue-600">{savedRestAreas.length}</span>곳
          </span>
        }
      />

      <div className="px-6 space-y-4">
        {savedRestAreas.length > 0 ? (
          savedRestAreas.map((restArea) => (
            <div
              key={restArea.stdRestCd}
              onClick={() => navigate(`/detail/${restArea.stdRestCd}`)}
              className="
                group relative bg-white p-6 border-b border-gray-200 
                flex items-center justify-between transition-all duration-300
                hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#64CCC5]/10 hover:border-[#64CCC5]/20
                active:scale-[0.97] cursor-pointer
              "
            >
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-[#64CCC5]/5 rounded-[1.5rem] flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                  <MapPin
                    size={28}
                    fill="currentColor"
                    fillOpacity={0.2}
                    className="group-hover:fill-white/30"
                  />
                </div>

                <div className="space-y-1">
                  <h4 className="font-black text-gray-900 text-[20px] tracking-tight group-hover:text-blue-600 transition-colors">
                    {restArea.dbName}
                  </h4>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block w-1 h-1 rounded-full bg-gray-300 group-hover:bg-[#64CCC5]/40 transition-colors" />
                    <p className="text-[13px] text-gray-400 font-bold group-hover:text-gray-500 transition-colors">
                      {restArea.routeName}
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-[#64CCC5]/5 transition-all">
                <ChevronRight className="text-gray-200 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))
        ) : (
          /* 빈 상태 (Ghost) */
          <div className="py-40 flex flex-col items-center text-gray-300 animate-in fade-in zoom-in-95 duration-700">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Ghost
                size={60}
                strokeWidth={1}
                className="opacity-80 animate-bounce"
              />
            </div>
            <p className="font-black text-lg text-gray-400">
              찜한 휴게소가 없습니다.
            </p>
            <p className="text-[13px] font-bold text-gray-300 mt-1 uppercase tracking-tight">
              새로운 휴게소를 찾아 떠나볼까요?
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
