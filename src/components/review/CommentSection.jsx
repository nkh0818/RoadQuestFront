import React, { useState } from "react";
import { Send } from "lucide-react";
import CommentItem from "./CommentItem";

export default function CommentSection({
  reviewId,
  comments,
  onAddComment,
  onEditComment,
  onDeleteComment,
}) {
  const [inputText, setInputText] = useState("");

  const handleSubmit = () => {
    if (!inputText.trim()) return;
    onAddComment(reviewId, inputText.trim());
    setInputText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const safeComments = comments ?? [];

  return (
    <div className="mt-4 space-y-3">
      {safeComments.length > 0 ? (
        <ul className="space-y-2">
          {safeComments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              reviewId={reviewId}
              onEdit={onEditComment}
              onDelete={onDeleteComment}
            />
          ))}
        </ul>
      ) : (
        <p className="text-center text-[13px] text-slate-400 py-3">
          첫 번째 댓글을 남겨보세요!
        </p>
      )}
      <div className="flex gap-2 pt-1">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="댓글을 입력하세요..."
          className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2.5 text-[13px] outline-none focus:border-[#3182CE] transition-all"
        />
        <button
          onClick={handleSubmit}
          disabled={!inputText.trim()}
          className="w-10 h-10 rounded-2xl bg-[#3182CE] text-white flex items-center justify-center disabled:opacity-40"
        >
          <Send size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
