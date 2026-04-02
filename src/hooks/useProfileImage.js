import { useState, useEffect, useRef } from "react";

// 프로필 이미지 미리보기 URL 생성 및 메모리 정리를 담당하는 훅
export default function useProfileImage() {
  const [profilePreviews, setProfilePreviews] = useState([]);

  // 생성된 Object URL을 추적해 언마운트 시 메모리 누수 방지
  const objectUrlsRef = useRef([]);

  // 드롭된 파일로 미리보기 URL 생성 — 이전 URL은 즉시 해제
  const handleProfileDrop = (files) => {
    const newUrl = URL.createObjectURL(files[0]);

    // 기존에 만들어진 URL 해제
    objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrlsRef.current = [newUrl];

    setProfilePreviews([newUrl]);
  };

  // 컴포넌트 언마운트 시 남아있는 Object URL 전체 해제
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  return { profilePreviews, handleProfileDrop };
}
