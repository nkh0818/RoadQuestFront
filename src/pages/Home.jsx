import React, { useState } from 'react';

import QuickMenuSection from '../components/Home/QuickMenuSection';
import FoodSection from '../components/Home/FoodSection';
import PassSection from '../components/Home/PassSection';
import HeroSection from '../components/Home/HeroSection';
import { useNavigate } from 'react-router-dom';
import FadeIn from '../components/common/FadeIn';

import { useInquiryStore } from '../store/useInquiryStore';
import toast from 'react-hot-toast';
import TrendSection from '../components/Home/TrendSection';

export default function Home() {

  const navigate = useNavigate();

  const openInquiry = useInquiryStore((state) => state.openInquiry);

  const [routeInfo, setRouteInfo] = useState({
    start: '',
    end: ''
  });

  const handleSearch = () => {
    if (!routeInfo.start || !routeInfo.end) {
      toast.error("출발지와 목적지를 모두 입력해주세요!");
      return;
    }
    // 결과 페이지로 데이터를 가져감
    navigate('/route', { state: routeInfo });
  };

  return (
    <div className="bg-[#F8FAFC] pb-10 min-h-screen animate-in fade-in slide-in-from-bottom-2 duration-700">

      {/* 히어로 섹션 */}
      <HeroSection
        routeInfo={routeInfo}
        setRouteInfo={setRouteInfo}
        onSearch={handleSearch}
      />

      <div className="mt-6 z-10">
        <FadeIn delay={100}>
          <TrendSection />
        </FadeIn>
      </div>
      

      {/* 패스 */}
      <div className="mt-6">
        <FadeIn delay={100}>
          <PassSection />
        </FadeIn>
      </div>

      <div className="mt-6">
        <FadeIn delay={150}>
          <QuickMenuSection onInquiryClick={openInquiry} />
        </FadeIn>
      </div>

      {/* 음식 */}
      <div className="mt-6">
        <FadeIn delay={200}>
          <FoodSection />
        </FadeIn>
      </div>

    </div>
  );
}