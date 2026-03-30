import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Heart,
  MoreHorizontal,
  Edit3,
  Trash2,
  MapPin,
  ChevronUp,
} from "lucide-react";
import FadeIn from "../common/FadeIn";
import CommentSection from "./CommentSection";
import useReviewStore from "../../store/useReviewStore";

export default function MyReviewItem({ review, onDelete, index }) {
  const navigate = useNavigate();
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const { toggleLike, addComment, editComment, deleteComment } = useReviewStore();

  const commentCount = review.comments?.length ?? 0;

  return (
    <FadeIn delay={index * 100}>
      <article className="bg-white p-6 pt-8 pb-10">
        {/* 상단: 장소 정보 */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[#3182CE]">
              <MessageSquare size={20} fill="currentColor" fillOpacity={0.2} />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-[17px] tracking-tight">
                {review.placeName}
              </h4>
              <span className="text-[12px] text-slate-400 font-medium">
                {review.date}
              </span>
            </div>
          </div>
          <button className="text-slate-300">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* 이미지 영역 */}
        {review.thumbnail && (
          <div className="relative w-full aspect-16/10 rounded-[1.8rem] overflow-hidden mb-6 shadow-xl shadow-slate-900/5">
            <img
              src={review.thumbnail}
              alt={review.placeName}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-[11px] font-black text-slate-900 shadow-xl flex items-center gap-1.5 active:scale-95 transition-all">
              <MapPin
                size={14}
                className="text-[#3182CE]"
                fill="#3182CE"
                fillOpacity={0.15}
                strokeWidth={2.5}
              />
              장소 인증
            </div>
          </div>
        )}

        {/* 본문 */}
        <div className="space-y-3">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-lg ${i < review.rating ? "text-amber-400" : "text-slate-200"}`}
              >
                ★
              </span>
            ))}
          </div>
          <p className="text-slate-700 text-[15px] leading-relaxed font-medium">
            {review.content}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {review.tags?.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-black text-[#3182CE] bg-blue-50 px-3 py-1 rounded-lg"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* 하단 액션 바 */}
        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
          <div className="flex gap-5 items-center">
            <button
              onClick={() => toggleLike(review.id)}
              className="flex items-center gap-1.5 active:scale-90 transition-all"
            >
              <Heart
                size={20}
                strokeWidth={2.5}
                className={review.liked ? "text-red-500" : "text-slate-400"}
                fill={review.liked ? "currentColor" : "none"}
              />
              <span
                className={`text-[13px] font-black ${review.liked ? "text-red-500" : "text-slate-400"}`}
              >
                {review.likeCount}
              </span>
            </button>
            <button
              onClick={() => setIsCommentsOpen((prev) => !prev)}
              className="flex items-center gap-1.5 text-slate-400 hover:text-[#3182CE] transition-colors"
            >
              {isCommentsOpen ? (
                <ChevronUp size={20} strokeWidth={2.5} />
              ) : (
                <MessageSquare size={20} strokeWidth={2.5} />
              )}
              <span className="text-[13px] font-black">
                {isCommentsOpen
                  ? "댓글 접기"
                  : `댓글 ${commentCount > 0 ? `(${commentCount})` : ""}`}
              </span>
            </button>
          </div>
          {/* <div className="flex gap-2">
            <button
              onClick={() => navigate(`/review/edit/${review.id}`)}
              className="p-2.5 bg-slate-50 text-slate-500 rounded-xl"
            >
              <Edit3 size={18} />
            </button>
            <button
              onClick={() => onDelete(review.id)}
              className="p-2.5 bg-red-50 text-red-500 rounded-xl"
            >
              <Trash2 size={18} />
            </button>
          </div> */}
        </div>

        {/* 댓글 섹션 */}
        {isCommentsOpen && (
          <CommentSection
            reviewId={review.id}
            comments={review.comments ?? []}
            onAddComment={addComment}
            onEditComment={editComment}
            onDeleteComment={deleteComment}
          />
        )}
      </article>
    </FadeIn>
  );
}
