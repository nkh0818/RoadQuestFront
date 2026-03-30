import React, { useState } from 'react';
import SubHeader from '../components/common/SubHeader';
import PopularTab from '../components/Ranking/PopularTab';
import ThemeTab from '../components/Ranking/ThemeTab';

export default function RankingView() {
  const [activeTab, setActiveTab] = useState('popular');

  // 현재 활성화된 탭에 따라 컴포넌트를 렌더링하는 함수
  const renderContent = () => {
    switch (activeTab) {
      case 'popular': return <PopularTab />;
      case 'theme': return <ThemeTab />;
      case 'review': return <ReviewTab />;
      default: return <PopularTab />;
    }
  };

  return (
    <div className="min-h-screen max-[600px]:mx-auto max-w-[600px] pb-24">
      <SubHeader title="주간 랭킹" />

      {/* 탭 */}
      <div className="flex bg-white px-6 border-b border-slate-100 sticky top-[60px] z-10">
        <TabBtn 
          label="실시간" 
          active={activeTab === 'popular'} 
          onClick={() => setActiveTab('popular')} 
        />
        <TabBtn 
          label="테마별" 
          active={activeTab === 'theme'} 
          onClick={() => setActiveTab('theme')} 
        />
      </div>

      {/* 탭 내용 */}
      <main className="animate-in fade-in duration-500">
        {renderContent()}
      </main>
    </div>
  );
}

// 내부 탭 버튼 컴포넌트
function TabBtn({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-4 text-[15px] font-black transition-all relative ${
        active ? 'text-blue-600' : 'text-slate-400'
      }`}
    >
      {label}
      {active && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-full" />
      )}
    </button>
  );
}