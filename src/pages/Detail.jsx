import React, { useEffect, useState } from "react";

import { useParams } from 'react-router-dom';

import DetailHero from "../components/detail/DetailHero";
import DetailInfo from "../components/detail/DetailInfo";
import Flotingwrite from "../components/common/Flotingwrite";

import { fetchRestAreaDetail } from "../api/reatArea";
import { useSavedStore } from "../store/useSavedStore";

import toast from "react-hot-toast";

export default function Detail() {

  const { id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useSavedStore((state) => state.fetchFavorites);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchRestAreaDetail(id);
        setData(response);
        fetchFavorites();
      } catch (error) {
        console.error("데이터를 불러오는 중 오류 발생:", error);
        toast.error("정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold">휴게소 정보 불러오는 중...</div>;
  }

  if (!data) {
    return <div className="min-h-screen flex items-center justify-center font-bold">정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="flex-1 min-h-screen w-full mx-auto bg-gray-50 flex flex-col font-sans relative overflow-x-hidden animate-in fade-in slide-in-from-right-4 duration-500">
      {/* 상단 지도 & 제목 영역 */}
      <DetailHero data={data.info} />

      {/* 하단 상세 정보 영역 */}
      <DetailInfo data={data} />

      {/* 플로팅 글쓰기 버튼 */}
      {id && <Flotingwrite restAreaId={id} />}
    </div>
  );
}