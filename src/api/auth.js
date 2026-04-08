import api from "./axios";

// 카카오 로그인
export const loginWithKakao = async (accessToken) => {
  const response = await api.post("/auth/kakao", { 
    accessToken: accessToken 
  });
  return response.data;
};

// 일반 로그인
export const loginWithLocal = async (email, password) => {
  const response = await api.post("/auth/login", { 
    email: email,
    password: password
  });
  return response.data;
};

// 닉네임 랜덤 생성
export const fetchRandomNickname = async () => {
  const response = await api.get("/auth/nickname");
  return response.data;
};

// 회원가입
export const requestSignUp = async (signUpData) => {
  const response = await api.post("/auth/signup", signUpData);
  return response.data;
};

// 내 정보 조회
export const fetchMe = async () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("저장된 토큰이 없습니다.");
  }

  const response = await api.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// 닉네임 수정 (@PatchMapping("/nickname"))
export const updateNickname = async (newNickname, profileImage) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("저장된 토큰이 없습니다.");
  }

  const response = await api.patch("/auth/nickname", 
    { 
      nickname: newNickname, 
      profileImage: profileImage //
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};