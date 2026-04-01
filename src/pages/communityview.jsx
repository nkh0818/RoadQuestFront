import React, { useState, useMemo } from 'react';
import { SearchX } from 'lucide-react';
import SubHeader from '../components/common/SubHeader';
import Flotingwrite from '../components/common/Flotingwrite';
import TagFilterBar from '../components/community/TagFilterBar';
import CommunityPostCard from '../components/community/CommunityPostCard';
import { COMMUNITY_TAGS, COMMUNITY_MOCK_REVIEWS } from '../data/CommunityMock';

export default function CommunityView() {
  const currentUserId = "user_123";
  const [activeTag, setActiveTag] = useState('전체');

  const filteredReviews = useMemo(() => {
    if (activeTag === '전체') return COMMUNITY_MOCK_REVIEWS;
    return COMMUNITY_MOCK_REVIEWS.filter((review) => review.tags.includes(activeTag));
  }, [activeTag]);

  return (
    <div className="min-h-screen bg-slate-50 pb-28 max-w-[600px] mx-auto relative">
      <SubHeader title="커뮤니티" />

      <TagFilterBar
        tags={COMMUNITY_TAGS}
        activeTag={activeTag}
        onTagChange={setActiveTag}
      />

      <main className="p-4 space-y-5">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((post) => (
            <CommunityPostCard key={post.id} post={post} currentUserId={currentUserId} />
          ))
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-slate-300">
            <SearchX size={60} className="mb-4 opacity-20" />
            <p className="font-black text-[15px]">해당 태그의 리뷰가 아직 없어요</p>
          </div>
        )}
      </main>

      <Flotingwrite />
    </div>
  );
}
