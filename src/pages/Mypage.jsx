import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Check, X } from "lucide-react";

import SubHeader from "../components/common/SubHeader";
import LoginRequired from "../components/common/LoginRequired";
import ProfileAvatar from "../components/mypage/ProfileAvatar";
import ProfileInfo from "../components/mypage/ProfileInfo";
import StatsDashboard from "../components/mypage/StatsDashboard";
import MenuList from "../components/mypage/MenuList";

import { useUserStore } from "../store/useUserStore";
import useNicknameEdit from "../hooks/useNicknameEdit";
import useProfileImage from "../hooks/useProfileImage";

export default function MyPageView() {
  const navigate = useNavigate();

  // Zustand 스토어에서 유저 데이터와 관련 함수 가져오기
  const { user, fetchUser, isLoading, logout } = useUserStore();

  // 닉네임 편집 플로우 (편집 모드 토글, 임시값, 저장/취소)
  const { isEditing, setIsEditing, tempNickname, setTempNickname, handleSave, handleCancel } =
    useNicknameEdit(user);

  // 프로필 이미지 미리보기 (Object URL 생성 + 메모리 정리)
  const { profilePreviews, handleProfileDrop } = useProfileImage();

  // 컴포넌트 마운트 시 유저 정보 서버에서 불러오기
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // 로그아웃 확인 후 스토어 초기화 및 메인 페이지로 이동
  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      logout();
      navigate("/");
    }
  };

  if (isLoading) return <div className="p-20 text-center">로딩 중...</div>;
  if (!user) return <LoginRequired />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* 상단 헤더 — 편집 모드에 따라 우측 버튼 변경 */}
      <SubHeader
        title={
          <span className="text-[18px] font-black text-slate-900">마이페이지</span>
        }
        rightElement={
          <div className="flex gap-2">
            {isEditing ? (
              <div className="flex gap-1.5">
                {/* 편집 취소 버튼 */}
                <button
                  onClick={handleCancel}
                  className="p-2.5 text-slate-400 bg-slate-100 rounded-xl active:scale-90 transition-all"
                >
                  <X size={20} />
                </button>
                {/* 편집 저장 버튼 */}
                <button
                  onClick={handleSave}
                  className="p-2.5 text-white bg-blue-600 rounded-xl shadow-lg shadow-blue-200 active:scale-90 transition-all"
                >
                  <Check size={20} />
                </button>
              </div>
            ) : (
              // 편집 시작 버튼
              <button
                onClick={() => setIsEditing(true)}
                className="p-2.5 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Settings size={22} />
              </button>
            )}
          </div>
        }
      />

      {/* 프로필 상단 섹션 */}
      <section className="relative px-6 pt-6 pb-12 overflow-hidden">
        {/* 배경 블러 장식 */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-60" />

        <div className="relative flex flex-col items-center">
          {/* 프로필 아바타 */}
          <ProfileAvatar
            profilePreviews={profilePreviews}
            isEditing={isEditing}
            onDrop={handleProfileDrop}
          />

          {/* 닉네임 / 레벨 / 칭호 / 이메일 */}
          <ProfileInfo
            user={user}
            isEditing={isEditing}
            tempNickname={tempNickname}
            onNicknameChange={setTempNickname}
          />
        </div>

        {/* XP / 리뷰 통계 대시보드 */}
        <StatsDashboard user={user} />
      </section>

      {/* 메뉴 리스트 + 로그아웃 */}
      <MenuList user={user} isEditing={isEditing} onLogout={handleLogout} />
    </div>
  );
}
