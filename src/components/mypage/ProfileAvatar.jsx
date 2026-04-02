import React from "react";
import { User } from "lucide-react";
import PhotoUploader from "../common/PhotoUploader";

// 프로필 이미지와 편집 모드 시 사진 업로드 오버레이를 렌더링하는 컴포넌트
export default function ProfileAvatar({ profilePreviews, isEditing, onDrop }) {
  return (
    <div className="relative group">
      {/* 프로필 이미지 영역 — 편집 모드에 따라 테두리 스타일 변경 */}
      <div
        className={`w-32 h-32 rounded-[2.8rem] overflow-hidden border-4 ${
          isEditing
            ? "border-blue-100 ring-4 ring-blue-50"
            : "border-white shadow-md"
        } transition-all duration-500`}
      >
        {profilePreviews.length > 0 ? (
          // 업로드된 사진이 있으면 미리보기 표시
          <img
            src={profilePreviews[0]}
            alt="profile"
            className="w-full h-full object-cover"
          />
        ) : (
          // 사진이 없으면 기본 아이콘 표시
          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
            <User size={40} strokeWidth={1.5} />
          </div>
        )}
      </div>

      {/* 편집 모드일 때만 사진 업로드 오버레이 표시 */}
      {isEditing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-[2.8rem] backdrop-blur-[2px] animate-in fade-in">
          <PhotoUploader
            type="profile"
            previews={profilePreviews}
            onDrop={(files) => onDrop(files)}
          />
        </div>
      )}
    </div>
  );
}
