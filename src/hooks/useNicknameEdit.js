import { useState } from "react";
import { updateNickname } from "../api/auth";
import { useUserStore } from "../store/useUserStore";

// 닉네임 편집 플로우(편집 모드 토글, 임시값 관리, 저장/롤백)를 담당하는 훅
export default function useNicknameEdit(user) {
  const { updateNicknameInStore } = useUserStore();

  // 편집 모드 활성화 여부
  const [isEditing, setIsEditing] = useState(false);

  // 저장 전 임시 닉네임 — 편집 취소 시 원래 값으로 되돌림
  const [tempNickname, setTempNickname] = useState(user?.nickname || "");

  // 닉네임 저장 — API 호출 후 스토어 반영, 실패 시 원래 값으로 롤백
  const handleSave = async () => {
    if (!tempNickname.trim()) {
      alert("닉네임을 입력하세요.");
      return;
    }
    // 현재 닉네임과 동일하면 API 호출 없이 편집 모드만 종료
    if (tempNickname === user?.nickname) {
      setIsEditing(false);
      return;
    }
    try {
      const updatedUserData = await updateNickname(tempNickname);
      updateNicknameInStore(updatedUserData.nickname);
      setIsEditing(false);
    } catch (e) {
      console.error("닉네임을 수정하지 못했습니다:", e);
      // 이미 사용 중인 닉네임이거나 서버 검증 실패 시 사용자에게 알림
      alert("이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해주세요.");
      setTempNickname(user?.nickname || "");
    }
  };

  // 편집 취소 — 임시값 초기화 후 편집 모드 종료
  const handleCancel = () => {
    setTempNickname(user?.nickname || "");
    setIsEditing(false);
  };

  return {
    isEditing,
    setIsEditing,
    tempNickname,
    setTempNickname,
    handleSave,
    handleCancel,
  };
}
