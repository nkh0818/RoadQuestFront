import React, { useState } from "react";
import { Pencil, X, Check } from "lucide-react";

export default function CommentItem({ comment, reviewId, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");

  const handleStartEdit = () => {
    setEditText(comment.text);
    setIsEditing(true);
  };

  const handleConfirm = () => {
    if (!editText.trim()) return;
    onEdit(reviewId, comment.id, editText.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleConfirm();
    }
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <li className="flex gap-3 bg-slate-50 rounded-2xl px-4 py-3">
      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-[11px] font-black text-[#3182CE] shrink-0 mt-0.5">
        {comment.author[0]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[12px] font-black text-slate-800">{comment.author}</span>
          <span className="text-[11px] text-slate-400">{comment.date}</span>
        </div>
        {isEditing ? (
          <div className="flex gap-2 items-center">
            <input
              autoFocus
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-white border border-[#3182CE] rounded-xl px-3 py-1.5 text-[13px] outline-none"
            />
            <button
              onClick={handleConfirm}
              disabled={!editText.trim()}
              className="w-7 h-7 rounded-lg bg-[#3182CE] text-white flex items-center justify-center disabled:opacity-40"
            >
              <Check size={14} strokeWidth={3} />
            </button>
            <button
              onClick={handleCancel}
              className="w-7 h-7 rounded-lg bg-slate-200 text-slate-500 flex items-center justify-center"
            >
              <X size={14} strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          <p className="text-[13px] text-slate-700 leading-relaxed">{comment.text}</p>
        )}
      </div>
      {!isEditing && (
        <div className="flex gap-1 shrink-0 self-start mt-0.5">
          <button
            onClick={handleStartEdit}
            className="text-slate-300 hover:text-[#3182CE]"
          >
            <Pencil size={13} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => onDelete(reviewId, comment.id)}
            className="text-slate-300 hover:text-red-500"
          >
            <X size={13} strokeWidth={2.5} />
          </button>
        </div>
      )}
    </li>
  );
}
