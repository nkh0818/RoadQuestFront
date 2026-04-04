# Project: [ROADQUEST]

## Overview
- React + Vite 기반 웹 애플리케이션
- 고속도로 휴게소의 에너지 정보(유가), 맛집 메뉴, 편의 시설을 시각적으로 탐색하고, AI 기반의 스마트 태그 시스템을 통해 여행의 추억을 기록하는 서비스입니다.

## Tech Stack
- Language: JavaScript (React)
- Styling: Tailwind CSS (볼드 & 모던 UI)
- State Management: Zustand (store/ 폴더 기반)
- Icons: Lucide-React
- Animation: Tailwind-animate,
- etc: react-dropzone, toast
- API: axios

## project color (tailwindCSS)
- 메인 컬러 : **-blue-600


## Project Structure
```
src/
├── assets/images    # 이미지 및 정적 자원
├── components/      # UI 컴포넌트 (Atomic Design)
│   ├── common/      # 공통 사용 컴포넌트 (SubHeader, Footer 등)
│   ├── detail/      # 상세 페이지용 섹션 (Menu, Event, Fuel)
│   ├── home/        # 홈/지도 관련 컴포넌트
│   ├── home/        # 홈/지도 관련 컴포넌트
│   ├── my/          # 마이페이지 관련 컴포넌트
│   ├── ranking/     # 랭킹 관련 컴포넌트
│   ├── review/      # 리뷰 작성 관련 (StarRating, TagSystem, PhotoUploader)
│   └── search/      # 검색 필터 및 결과 리스트
├── hook/            # 커스텀 훅 (useDetailInfo, useReviewForm 등)
├── pages/           # 라우트 단위 페이지 (Detail, MyReview, ReviewForm 등)
├── store/           # Zustand 상태 관리 (useUserStore, useSavedStore 등)
├── App.jsx          # 메인 라우팅 및 레이아웃 설정
└── main.jsx         # 엔트리 포인트
```

## Code Style Rules
- [ ] 컴포넌트는 함수형으로 작성
- [ ] Props는 interface로 정의
- [ ] 커스텀 훅은 use 접두사 사용
- [ ] 상태 관리는 최소화
- [ ] Formatting: Tailwind CSS 클래스 순서 준수 (Layout -> Flex/Grid -> Spacing -> Border -> Effects 순)
- [ ] Components: 함수형 컴포넌트(Functional Components) 사용, export default 권장
- [ ] Design System: - 메인 컬러: #3182CE (Blue) / 강조 컬러: #FFD93D (Star), #F97316 (Best Menu) / 곡률: rounded-[2rem]의 곡률 사용
- [ ] Icons: 모든 아이콘은 lucide-react를 기본으로 하며, strokeWidth={2.5} 이상으로 볼드한 느낌 유지

## Naming Conventions
- 컴포넌트: PascalCase (Button.jsx)
- 훅: camelCase with use prefix (useAuth.jsx)
- 유틸: camelCase (formatDate.jsx)

## Commands
- `npm run dev` - 개발 서버 (localhost:5173)
- `npm run build` - 프로덕션 빌드
- `npm run lint` - ESLint 코드 스타일 점검

## Important Notes
- Layout: 앱의 전체 가로 너비는 max-w-[600px]로 제한하며, 모바일 퍼스트 디자인을 유지함.
- UX: 사진 업로드 시 자동 스크롤, 별점 클릭 시 텍스트 피드백 등 마이크로 인터랙션을 반드시 포함.
- State: API 통신 전에는 data/ 폴더의 Mock 데이터를 활용하여 UI 우선 개발을 진행함.
- Performance: 이미지 프리뷰 생성 시 URL.revokeObjectURL을 사용하여 메모리 누수를 방지함.
- .env 파일은 업로드 금지
- 최신 기술을 사용하지만, 방향을 정할 때 반드시 물어볼 것.
- 만약 나한테 무언가 설명해야 한다면, 신입 사원을 가르치는 팀장의 마음으로 알기 쉽게 설명.
- 추가 라이브러리가 필요하다면 왜 필요한지 설명해줄 것. 최선은 쓰지 않고 기존의 라이브러리만으로 구현.