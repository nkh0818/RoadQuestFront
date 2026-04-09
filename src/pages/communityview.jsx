import React, { useEffect, useMemo, useState, useRef, useCallback } from "react"; // 🚩 useRef, useCallback 추가
import {
  MapPin,
  SearchX,
  MoreHorizontal,
  Edit2,
  Trash2,
  AlertCircle,
  UserMinus,
} from "lucide-react";
import SubHeader from "../components/common/SubHeader";
import Flotingwrite from "../components/common/Flotingwrite";
import { useInquiryStore } from "../store/useInquiryStore";
import useReviewStore from '../store/useReviewStore';
import { useUserStore } from "../store/useUserStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function CommunityView() {
  const [activeTag, setActiveTag] = useState("전체");
  const keywords = ["전체", "#돈가스", "#경치맛집", "#화장실깨끗", "#실시간정체"];

  // 🚩 스토어에서 필요한 함수들 가져오기 (fetchNextPage, hasMore 추가)
  const { reviews, fetchReviews, fetchNextPage, hasMore, isLoading } = useReviewStore();
  const user = useUserStore((state) => state.user);
  const currentUserNickname = user?.nickname;

  // 🚩 관찰 대상(리스트 끝)을 가리킬 Ref
  const observerTarget = useRef(null);

  useEffect(() => {
    fetchReviews(0); // 첫 로딩은 0페이지부터
  }, []);

  // 🚩 스크롤 감지 로직 (Intersection Observer)
  const onIntersect = useCallback(
    ([entry]) => {
      // 1. 화면에 나타났고 2. 더 가져올 데이터가 있고 3. 지금 로딩 중이 아닐 때
      if (entry.isIntersecting && hasMore && !isLoading) {
        fetchNextPage();
      }
    },
    [hasMore, isLoading, fetchNextPage]
  );

  useEffect(() => {
    if (!observerTarget.current) return;

    // 감지기 설정 (타겟이 100% 보일 때 실행)
    const observer = new IntersectionObserver(onIntersect, { threshold: 1.0 });
    observer.observe(observerTarget.current);

    return () => observer.disconnect();
  }, [onIntersect]);

  const filteredReviews = useMemo(() => {
    if (activeTag === "전체") return reviews;
    return reviews.filter((review) => review.tags?.includes(activeTag.replace('#', '')));
  }, [activeTag, reviews]);

  return (
    <div className="min-h-screen bg-slate-50 pb-28 max-w-[600px] mx-auto relative">
      <SubHeader title="커뮤니티" />

      {/* 태그 필터링 섹션 (기존과 동일) */}
      <section className="bg-white py-4 border-b border-slate-100 flex gap-2.5 px-5 overflow-x-auto scrollbar-hide sticky top-[60px] z-10">
        {keywords.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`flex-shrink-0 px-5 py-2.5 rounded-full text-[13px] font-black transition-all ${
              activeTag === tag
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            {tag}
          </button>
        ))}
      </section>

      {/* 피드 리스트 */}
      <main className="p-4 space-y-5">
        {filteredReviews.length > 0 ? (
          <>
            {filteredReviews.map((post) => (
              <ReviewCard
                key={post.reviewId}
                post={post}
                currentUserNickname={currentUserNickname}
              />
            ))}
            
            {/* 🚩 무한 스크롤 감지용 타겟 div */}
            <div ref={observerTarget} className="py-10 flex justify-center items-center">
              {isLoading && hasMore && (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              )}
              {!hasMore && reviews.length > 0 && (
                <p className="text-slate-400 text-sm font-bold">마지막 리뷰입니다 🥔</p>
              )}
            </div>
          </>
        ) : (
          !isLoading && (
            <div className="py-32 flex flex-col items-center justify-center text-slate-300">
              <SearchX size={60} className="mb-4 opacity-20" />
              <p className="font-black text-[15px]">해당 태그의 리뷰가 아직 없어요</p>
            </div>
          )
        )}

        {/* 첫 로딩 중일 때 보여줄 UI */}
        {isLoading && reviews.length === 0 && (
          <div className="flex justify-center py-20 font-black text-slate-400">
            리뷰 로딩 중...
          </div>
        )}
      </main>

      <Flotingwrite />
    </div>
  );
}

// --- 개별 리뷰 카드 컴포넌트 ---
function ReviewCard({ post, currentUserNickname }) {
  const navigate = useNavigate();

  const openInquiry = useInquiryStore((state) => state.openInquiry);
  const deleteReview = useReviewStore((state) => state.deleteReview);
  const blockUser = useReviewStore((state) => state.blockUser);

  const [showMenu, setShowMenu] = useState(false);
  const isMine =
    post.nickname &&
    currentUserNickname &&
    post.nickname === currentUserNickname;

  // 삭제 처리
  const handleDelete = async () => {
    try {
      await deleteReview(post.reviewId);
      toast.success("리뷰가 삭제되었습니다.");
    } catch (error) {
      console.log(error);
      toast.error("삭제에 실패했습니다.");
    } finally {
      setShowMenu(false);
    }
  };

  // 차단 처리
  const handleBlock = async () => {
    try {
      // 서버에 차단 요청 (store의 blockUser 호출)
      await blockUser(post.userId);
      useReviewStore.setState((state) => ({
        reviews: state.reviews.filter((r) => r.userId !== post.userId),
      }));

      toast.success(`${post.nickname}님을 차단했습니다.`);
    } catch (error) {
      console.error("차단 실패:", error);
      toast.error("차단 처리 중 오류가 발생했습니다.");
    } finally {
      setShowMenu(false);
    }
  };

  // 수정 처리
  const handleEdit = () => {
    setShowMenu(false);
    navigate(`/review/edit/${post.reviewId}`, {
      state: { review: post }, // 🚩 post 데이터를 review라는 이름으로 전달
    });
  };

  // 신고 처리
  const handleReport = () => {
    openInquiry(post.reviewId);
    setShowMenu(false);
    toast.success("신고 접수 화면으로 이동합니다.");
  };

  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100/60 relative animate-in fade-in duration-500 pb-6">
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-slate-100 rounded-full border-2 border-white shadow-sm overflow-hidden">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.nickname}`}
              alt="avatar"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-black text-slate-800 text-[15px]">
                {post.nickname}
              </h4>
              {/* 내 글일 때 '나' 배지 */}
              {isMine && (
                <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded-md font-black">
                  나
                </span>
              )}
              <span className="text-slate-300 text-[11px] font-medium">
                {post.timeAgo}
              </span>
            </div>
            <div className="flex items-center gap-1 text-blue-500 text-[12px] font-black">
              <MapPin size={12} fill="currentColor" /> {post.restAreaName}
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
              <div
                className="fixed inset-0 z-20"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-2xl border border-slate-100 p-1.5 z-30 animate-in zoom-in-95 duration-200">
                {isMine ? (
                  // 내 글일 때 메뉴
                  <>
                    <button
                      onClick={handleEdit}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-black text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                      <Edit2 size={14} className="text-blue-500" /> 수정하기
                    </button>
                    <button
                      onClick={handleDelete}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-black text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                    >
                      <Trash2 size={14} /> 삭제하기
                    </button>
                  </>
                ) : (
                  // 남의 글일 때 메뉴
                  <>
                    <button 
                    onClick={handleBlock}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-black text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                      <UserMinus size={14} /> 차단하기
                    </button>
                    <button
                      onClick={handleReport}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-black text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                    >
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
          {post.tags &&
            post.tags.map((t, idx) => (
              <span
                key={idx}
                className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[11px] font-black"
              >
                #{t.trim()}
              </span>
            ))}
        </div>
        <p className="text-slate-600 text-[14.5px] font-bold leading-relaxed break-keep">
          {post.content}
        </p>
      </div>

      {/* [하단] 이미지 */}
      {post.imageUrl && (
        <div className="px-5">
          <div className="aspect-[4/3] rounded-[2rem] overflow-hidden bg-slate-100 border border-slate-50 shadow-inner">
            <img
              src={post.imageUrl}
              alt="review"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      )}
    </div>
  );
}
