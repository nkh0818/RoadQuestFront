import React, { useState, useMemo } from 'react';
import { 
  MapPin, SearchX, MoreHorizontal, Edit2, Trash2, AlertCircle, UserMinus 
} from 'lucide-react';
import SubHeader from '../components/common/SubHeader';
import Flotingwrite from '../components/common/Flotingwrite';
import InquiryModal from '../components/common/InquiryModal';
import { useInquiryStore } from '../store/useInquiryStore';

export default function CommunityView() {
  
  // 1. 현재 로그인한 유저의 ID (실제로는 Auth Context 등에서 가져옴)
  const currentUserId = "user_123"; 

  const [activeTag, setActiveTag] = useState('전체');
  const keywords = ['전체', '#돈가스', '#경치맛집', '#화장실깨끗', '#실시간정체'];

  // 2. 통합 리뷰 데이터 (userId 포함)
  const allReviews = [
    {
      id: 1,
      userId: "user_123", // 내 글
      user: "운전왕김철수",
      restArea: "시흥하늘휴게소",
      tags: ["#돈가스", "#경치맛집"],
      content: "와, 여기 돈가스 진짜 전문점 급이네. 뷰 보면서 먹으니까 더 꿀맛!",
      time: "방금 전",
      image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
      likes: 12,
      comments: 4
    },
    {
      id: 2,
      userId: "user_999", // 남의 글
      user: "여행가영",
      restArea: "덕평자연휴게소",
      tags: ["#실시간정체"],
      content: "덕평 지금 사람 너무 많아요! 정체가 심하니 서두르세요.",
      time: "15분 전",
      image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80",
      likes: 45,
      comments: 8
    }
  ];

  const filteredReviews = useMemo(() => {
    if (activeTag === '전체') return allReviews;
    return allReviews.filter(review => review.tags.includes(activeTag));
  }, [activeTag]);

  return (
    <div className="min-h-screen bg-slate-50 pb-28 max-w-[600px] mx-auto relative">
      <SubHeader title="커뮤니티" />

      {/* 태그 필터링 섹션 */}
      <section className="bg-white py-4 border-b border-slate-100 flex gap-2.5 px-5 overflow-x-auto scrollbar-hide sticky top-[60px] z-10">
        {keywords.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`flex-shrink-0 px-5 py-2.5 rounded-full text-[13px] font-black transition-all ${
              activeTag === tag
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {tag}
          </button>
        ))}
      </section>

      {/* 피드 리스트 */}
      <main className="p-4 space-y-5">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((post) => (
            <ReviewCard key={post.id} post={post} currentUserId={currentUserId} />
          ))
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-slate-300">
            <SearchX size={60} className="mb-4 opacity-20" />
            <p className="font-black text-[15px]">해당 태그의 리뷰가 아직 없어요</p>
          </div>
        )}
      </main>

      {/* 글쓰기 */}
      <Flotingwrite />
    </div>
  );
}

// --- 개별 리뷰 카드 컴포넌트 ---
function ReviewCard({ post, currentUserId }) {
  const openInquiry = useInquiryStore((state) => state.openInquiry);

  const [showMenu, setShowMenu] = useState(false);
  const isMine = post.userId === currentUserId; // 1. 권한 분리 로직 유지

  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100/60 relative animate-in fade-in duration-500 pb-6">
      
      {/* [상단] 헤더: 유저 정보 및 메뉴 버튼 */}
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-slate-100 rounded-full border-2 border-white shadow-sm overflow-hidden">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user}`} alt="avatar" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-black text-slate-800 text-[15px]">{post.user}</h4>
              {/* 내 글일 때 '나' 배지 표시 유지 */}
              {isMine && <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded-md font-black">나</span>}
            </div>
            <div className="flex items-center gap-1 text-blue-500 text-[12px] font-black">
              <MapPin size={12} fill="currentColor" /> {post.restArea}
            </div>
          </div>
        </div>

        {/* [메뉴] */}
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-slate-300 hover:text-slate-600 transition-colors"
          >
            <MoreHorizontal size={22} />
          </button>

          {showMenu && (
            <>
              {/* 바깥 클릭 시 닫기 */}
              <div className="fixed inset-0 z-20" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-2xl border border-slate-100 p-1.5 z-30 animate-in zoom-in-95 duration-200">
                {isMine ? (
                  // 내 글일 때 메뉴
                  <>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-black text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                      <Edit2 size={14} className="text-blue-500" /> 수정하기
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-black text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                      <Trash2 size={14} /> 삭제하기
                    </button>
                  </>
                ) : (
                  // 남의 글일 때 메뉴
                  <>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-black text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                      <UserMinus size={14} /> 차단하기
                    </button>
                    <button 
                    onClick={openInquiry}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-black text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                      <AlertCircle size={14} /> 신고하기
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* [중간] 본문 */}
      <div className="px-6 pb-4">
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map(t => (
            <span key={t} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[11px] font-black">{t}</span>
          ))}
        </div>
        <p className="text-slate-600 text-[14.5px] font-bold leading-relaxed break-keep">
          {post.content}
        </p>
      </div>

      {/* [하단] 이미지 */}
      <div className="px-5">
        <div className="aspect-[4/3] rounded-[2rem] overflow-hidden bg-slate-100 border border-slate-50 shadow-inner">
          <img 
            src={post.image} 
            alt="post" 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
          />
        </div>
      </div>
    </div>
  );
}