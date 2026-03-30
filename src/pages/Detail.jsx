import React from "react";

// import { useParams } from 'react-router-dom';

import DetailHero from "../components/detail/DetailHero";
import DetailInfo from "../components/detail/DetailInfo";
import { MOCK_REST_AREA } from "../data/DetailMock";
import Flotingwrite from "../components/common/Flotingwrite";

export default function Detail() {

  // const { id } = useParams();

  // 데이터 받아오기
  // const data = allData.find(item => item.stdRestCd === id);
  const data = MOCK_REST_AREA;

  if (!data)
    return (
      <div className="p-10 text-center">요청하신 정보를 찾을 수 없습니다.</div>
    );

  return (
    <div className="flex-1 min-h-screen w-full mx-auto bg-gray-50 flex flex-col font-sans relative overflow-x-hidden animate-in fade-in slide-in-from-right-4 duration-500">
      {/* 상단 지도 & 제목 영역 */}
      <DetailHero data={data.info} design={data.design} />

      {/* 하단 상세 정보 영역 */}
      <DetailInfo data={data} />

      {/* 플로팅 글쓰기 버튼 */}
      <Flotingwrite />
    </div>
  );
}