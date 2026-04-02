import api from "./axios";

// 어떤 Auth 소속 api를 받아올 건지 정의

// 카카오 로그인 (@PostMapping("/kakao"))
export const loginWithKakao = async (accessToken) => {
  const response = await api.post("/auth/kakao", { 
    accessToken: accessToken 
  });
  return response.data;
};

// 일반 로그인 (@PostMapping("/login"))
export const loginWithLocal = async (email, password) => {
  const response = await api.post("/auth/login", { 
    email: email,
    password: password
  });
  return response.data;
};

// 닉네임 랜덤 생성 (@GetMapping("/nickname"))
export const fetchRandomNickname = async () => {
  const response = await api.get("/auth/nickname");
  return response.data;
};

// 회원가입 (@PostMapping("/signup"))
export const requestSignUp = async (signUpData) => {
  const response = await api.post("/auth/signup", signUpData);
  return response.data;
};

// 내 정보 조회 (@GetMapping("/me"))
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
export const updateNickname = async (newNickname) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("저장된 토큰이 없습니다.");
  }

  const response = await api.patch("/auth/nickname", 
    { nickname: newNickname },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data; // 백엔드가 주는 AuthResponseDTO
};