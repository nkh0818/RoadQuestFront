import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 공통 레이아웃 컴포넌트
import Header from './components/common/Header';
import FooterNavbar from './components/common/FooterNavbar';

// 페이지별 컴포넌트
import Home from './pages/Home';
import Search from './pages/Search';
import Detail from './pages/Detail';
import Place from './pages/place';
import HistoryView from './components/detail/HistoryView';
import ReviewFormView from './pages/ReviewForm';
import MyPageView from './pages/Mypage';
import MyReviewListView from './pages/MyReview';
import SignUpView from './pages/SignUpView';
import FindAccountView from './pages/FindAccountView';
import LoginView from './pages/LoginView';
import RouteResultPage from './pages/RouteResult';
import RankingView from './pages/Rankingview';
import CommunityView from './pages/communityview';
import RouteGuideView from './pages/RouteGuideView';
import InquiryModal from './components/common/InquiryModal';

import { useInquiryStore } from './store/useInquiryStore';
import { useUserStore } from './store/useUserStore';
import { Toaster } from 'react-hot-toast';
import BlockedUser from './pages/BlockedUser';

function App() {

  const fetchUser = useUserStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const { isInquiryOpen, closeInquiry } = useInquiryStore();

  return (
    <Router>
      <div className="min-h-screen max-w-[600px] mx-auto bg-white shadow-md flex flex-col relative overflow-hidden font-sans">
        <Toaster position="top-center" reverseOrder={false} />
        {/* 헤더 */}
        <Header />

        {/* 가변영역 */}
        <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
          <Routes>
            {/* home */}
            <Route path="/" element={<Home />} />
            
          
            {/* login */}
            <Route path="/login" element={<LoginView />} />
            <Route path="/signup" element={<SignUpView />} />
            <Route path="/find" element={<FindAccountView />} />
            
            {/* quickmenu */}
            {/* search */}
            <Route path="/route" element={<RouteResultPage />}/>
            <Route path="ai-guide" element={<RouteGuideView />} />
            <Route path="/search" element={<Search />} />
            <Route path="/detail/:id" element={<Detail />} />

            {/* ranking */}
            <Route path="/ranking" element={<RankingView />} />

            {/* place */}
            <Route path="/place" element={<Place />} />

            {/* reviews */}
            <Route path="/my-reviews" element={<MyReviewListView />} />
            <Route path="/review/write/:id" element={<ReviewFormView />} />
            <Route path="/review/edit/:id" element={<ReviewFormView />} />

            {/* community */}
            <Route path="/community" element={<CommunityView />} />

            <Route path="/history" element={<HistoryView/>} />

            {/* MyPage */}
            <Route path="/my" element={<MyPageView />} />
            <Route path="/blocked-users" element={<BlockedUser />} />

            {/* 잘못된 주소로 들어왔을 때 처리 */}
            <Route path="*" element={<div className="p-10 text-center font-bold">404 - 페이지를 찾을 수 없습니다.</div>} />
          </Routes>
        </main>

        <InquiryModal
        isOpen={isInquiryOpen} 
        onClose={closeInquiry} 
      />


        {/* 하단 메뉴 */}
        <FooterNavbar />

      </div>
    </Router>
  );
}

export default App;