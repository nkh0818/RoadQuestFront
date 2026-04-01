import React, { useState } from 'react';
import { MapPin, MoreHorizontal, Edit2, Trash2, AlertCircle, UserMinus } from 'lucide-react';
import { useInquiryStore } from '../../store/useInquiryStore';

export default function CommunityPostCard({ post, currentUserId }) {
  const openInquiry = useInquiryStore((state) => state.openInquiry);
  const [showMenu, setShowMenu] = useState(false);
  const isMine = post.userId === currentUserId;

  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100/60 relative animate-in fade-in duration-500 pb-6">

      {/* 상단: 유저 정보 및 메뉴 버튼 */}
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-slate-100 rounded-full border-2 border-white shadow-sm overflow-hidden">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user}`} alt="avatar" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-black text-slate-800 text-[15px]">{post.user}</h4>
              {isMine && (
                <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded-md font-black">나</span>
              )}
            </div>
            <div className="flex items-center gap-1 text-blue-500 text-[12px] font-black">
              <MapPin size={12} fill="currentColor" /> {post.restArea}
            </div>
          </div>
        </div>

        {/* 메뉴 버튼 */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-slate-300 hover:text-slate-600 transition-colors"
          >
            <MoreHorizontal size={22} />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-2xl border border-slate-100 p-1.5 z-30 animate-in zoom-in-95 duration-200">
                {isMine ? (
                  <>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-black text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                      <Edit2 size={14} className="text-blue-500" /> 수정하기
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-black text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                      <Trash2 size={14} /> 삭제하기
                    </button>
                  </>
                ) : (
                  <>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-black text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                      <UserMinus size={14} /> 차단하기
                    </button>
                    <button
                      onClick={openInquiry}
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

      {/* 본문 */}
      <div className="px-6 pb-4">
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map((t) => (
            <span key={t} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[11px] font-black">{t}</span>
          ))}
        </div>
        <p className="text-slate-600 text-[14.5px] font-bold leading-relaxed break-keep">
          {post.content}
        </p>
      </div>

      {/* 이미지 */}
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
