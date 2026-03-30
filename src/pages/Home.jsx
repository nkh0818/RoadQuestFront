import React, { useState } from 'react';

import QuickMenuSection from '../components/Home/QuickMenuSection';
import FoodSection from '../components/Home/FoodSection';
import PassSection from '../components/Home/PassSection';
import HeroSection from '../components/Home/HeroSection';
import { useNavigate } from 'react-router-dom';
import FadeIn from '../components/common/FadeIn';
import InquiryModal from '../components/common/InquiryModal';

export default function Home() {

  const navigate = useNavigate();

  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  const [routeInfo, setRouteInfo] = useState({
    start: '',
    end: ''
  });

  const handleSearch = () => {
    if (!routeInfo.start || !routeInfo.end) {
      alert("출발지와 목적지를 모두 입력해주세요!");
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

      {/* 패스 */}
      <div className="-mt-16 relative z-10">
        <FadeIn delay={500}>
          <PassSection />
        </FadeIn>
      </div>

      <div className="mt-6">
        <FadeIn delay={600}>
          <QuickMenuSection onInquiryClick={() => setIsInquiryOpen(true)} />
        </FadeIn>
      </div>

      <InquiryModal 
        isOpen={isInquiryOpen} 
        onClose={() => setIsInquiryOpen(false)} 
      />

      {/* 음식 */}
      <div className="mt-5">
        <FadeIn delay={700}>
          <FoodSection />
        </FadeIn>
      </div>

    </div>
  );
}