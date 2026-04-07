import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SubHeader from '../components/common/SubHeader';
import SearchRanking from '../components/ranking/SearchRanking';
import BestReviewRanking from '../components/ranking/BestReviewRanking';
import UserExplorerRanking from '../components/ranking/UserExplorerRanking';
import LowestGasPriceRanking from '../components/ranking/LowestGasPriceRanking';
import HotPlaceRanking from '../components/ranking/PlaceRangking';

export default function RankingView() {
  const [rankingData, setRankingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. 백엔드 통합 API 호출
  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const res = await axios.get('/api/ranking/totalrank');
        setRankingData(res.data);
      } catch (error) {
        console.error("랭킹 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRankings();
  }, []);

  if (isLoading) return <RankingSkeleton />;

  return (
    <div className="min-h-screen max-w-[600px] mx-auto bg-slate-50 pb-24">
      <SubHeader title="주간 하이라이트" />

      {/* 섹션 1: 실시간 인기 검색어 (Redis) */}
      <SearchRanking data={rankingData?.hotSearchKeywords} />

      <hr className="border-t-8 border-slate-100" />

      {/* 섹션 2: 지금 핫한 휴게소 (급상승) */}
      <HotPlaceRanking data={rankingData?.trendingRestAreaNames}/>

      <hr className="border-t-8 border-slate-100" />

      {/* 섹션 3: 베스트 리뷰 (좋아요순) */}
      <BestReviewRanking data={rankingData?.bestReviews} />

      <hr className="border-t-8 border-slate-100" />

      {/* 섹션 4: 이달의 탐험가 (유저 XP) */}
      <UserExplorerRanking data={rankingData?.topExplorers} />

      <hr className="border-t-8 border-slate-100" />

      {/* 섹션 5: 전국 최저가 주유소 */}
      <LowestGasPriceRanking data={rankingData?.lowestGasPrices} />
    </div>
  );
}

function RankingSkeleton() {
  return (
    <div className="min-h-screen max-w-[600px] mx-auto bg-white pb-24 animate-pulse">
      <div className="h-[60px] bg-slate-100 mb-6" /> {/* 헤더 부분 */}
      
      {[1, 2, 3].map((i) => (
        <div key={i} className="px-5 py-8 space-y-4">
          <div className="h-6 bg-slate-100 rounded-md w-1/3 mb-6" /> {/* 제목 부분 */}
          <div className="space-y-3">
            <div className="h-20 bg-slate-50 rounded-[2rem]" />
            <div className="h-20 bg-slate-50 rounded-[2rem]" />
            <div className="h-20 bg-slate-50 rounded-[2rem]" />
          </div>
          <div className="h-4 bg-slate-100/50 my-8" /> {/* 구분선 */}
        </div>
      ))}
    </div>
  );
}