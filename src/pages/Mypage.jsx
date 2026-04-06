import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Check, X } from "lucide-react";
import toast from "react-hot-toast";
// import { uploadImageToS3 } from "../api/review";

import SubHeader from "../components/common/SubHeader";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ProfileAvatar from "../components/my/ProfileAvatar";
import ProfileInfo from "../components/my/ProfileInfo";
import StatsDashboard from "../components/my/StatsDashboard";
import MenuList from "../components/my/MenuList";

import { useUserStore } from "../store/useUserStore";

export default function MyPageView() {
  const [profilePreviews, setProfilePreviews] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [tempNickname, setTempNickname] = useState("");

  const navigate = useNavigate();
  const { user, fetchUser, isLoading, logout, changeNickname, getXpPercentage } =
    useUserStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
console.log("현재 로그인한 유저 데이터:", user);
  // 프로필 업데이트 핸들러 (ProfileAvatar에서 호출)
  const handleProfileUpdate = async (newImageUrl) => {
    try {
      // S3 업로드 성공 후 받은 URL을 프리뷰 상태에 저장하여 화면에 즉시 반영
      setProfilePreviews([newImageUrl]);
      toast.success("프로필 사진이 준비되었습니다. 저장 버튼을 눌러주세요!");
    } catch (error) {
      console.error("이미지 반영 실패:", error);
      toast.error("이미지 반영 중 오류가 발생했습니다.");
    }
  };

  if (isLoading) return <LoadingSpinner message="로딩 중..." />;
  if (!user)
    return (
      <div className="p-20 text-center space-y-4">
        <p className="font-bold text-slate-600">로그인이 필요한 서비스입니다.</p>
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl"
        >
          로그인하러 가기
        </button>
      </div>
    );

  const handleSave = async () => {
    if (!tempNickname.trim()) {
      toast.error("닉네임을 입력하세요.");
      return;
    }
    try {
      // 변경된 사진이 있으면 새 주소를, 없으면 기존 유저 사진 주소를 사용
      const finalProfileImage = profilePreviews.length > 0 ? profilePreviews[0] : user.profileImage;
      
      // 닉네임과 함께 이미지 주소도 같이 변경 (스토어 함수가 지원해야 함)
      await changeNickname(tempNickname, finalProfileImage); 
      
      setIsEditing(false);
      setProfilePreviews([]); // 저장 후 프리뷰 초기화
      toast.success("정보가 변경되었습니다.");
      fetchUser(); // 데이터 최신화
    } catch {
      setTempNickname(user.nickname);
      toast.error("이미 사용 중인 닉네임이거나 오류가 발생했습니다.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setTempNickname(user.nickname);
    setProfilePreviews([]);
  };

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      logout();
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <SubHeader
        title={
          <span className="text-[18px] font-black text-slate-900">마이페이지</span>
        }
        rightElement={
          <div className="flex gap-2">
            {isEditing ? (
              <div className="flex gap-1.5">
                <button
                  onClick={handleCancelEdit}
                  className="p-2.5 text-slate-400 bg-slate-100 rounded-xl active:scale-90 transition-all"
                >
                  <X size={20} />
                </button>
                <button
                  onClick={handleSave}
                  className="p-2.5 text-white bg-blue-600 rounded-xl shadow-lg shadow-blue-200 active:scale-90 transition-all"
                >
                  <Check size={20} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setTempNickname(user.nickname); setIsEditing(true); }}
                className="p-2.5 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Settings size={22} />
              </button>
            )}
          </div>
        }
      />

      <section className="relative px-6 pt-6 pb-12 overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-60" />
        <div className="relative flex flex-col items-center">
<ProfileAvatar
  previewUrl={
    profilePreviews[0] || 
    user?.profileImage || 
    user?.profileImageUrl || 
    user?.image 
  }
  isEditing={isEditing}
  onUpdate={handleProfileUpdate} 
/>
          <div className="mt-6 text-center">
            <ProfileInfo
              user={user}
              isEditing={isEditing}
              tempNickname={tempNickname}
              onNicknameChange={setTempNickname}
            />
          </div>
        </div>

        <StatsDashboard
          rewardPoint={user.rewardPoint ?? 0}
          xp={user.xp ?? 0}
          xpPercent={getXpPercentage()}
          reviewCount={user.reviewCount ?? 0}
        />
      </section>

      <MenuList
        reviewCount={user.reviewCount}
        isEditing={isEditing}
        onLogout={handleLogout}
      />
    </div>
  );
}