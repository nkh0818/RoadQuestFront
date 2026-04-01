# 🚀 프로젝트명 (RoadQuest)
> 고속도로 휴게소의 에너지 정보(유가), 맛집 메뉴, 편의 시설을 시각적으로 탐색하고, AI 기반의 스마트 태그 시스템을 통해 여행의 추억을 기록하는 서비스입니다.

---

## 🛠 Tech Stack
- **Framework:** React 18
- **State Management:** Zustand
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Animation:** Custom FadeIn
- **Routing:** React Router Dom
- **FileUpload:** React Dropzone

## 📌 Key Features
- **리뷰 관리:** 여행지/휴게소 리뷰 작성, 수정, 삭제 및 목록 조회
- **상호작용:** 좋아요 기능 및 실시간 댓글(CRUD) 시스템
- **장소 인증:** 지도 API를 연동한 방문 장소 인증 및 태그 시스템
- **반응형 디자인:** 모바일/태블릿 퍼스트 기반의 깔끔한 카드 UI

## 📂 Project Structure
```text
src/
 ┣ 📂 assets          # 이미지, 아이콘, 폰트 등 정적 파일
 ┣ 📂 components      # 재사용 가능한 공용 컴포넌트
 ┃ ┣ 📂 common        # Header, Footer, LoadingSpinner, FadeIn 등
 ┃ ┗ 📂 review        # ReviewItem, CommentList 등 컴포넌트
 ┃ ┗ 📂 home          # 메인페이지에 사용된 컴포넌트
 ┃ ┗ 📂 detail        # 휴게소 상세 페이지에 사용된 컴포넌트
 ┃ ┗ 📂 ranking       # 주간랭킹 페이지에 사용된 컴포넌트
 ┃ ┗ 📂 search        # 찾기 페이지에 사용된 컴포넌트
 ┣ 📂 pages           # 라우트별 페이지 컴포넌트 (MyReviewListView 등)
 ┣ 📂 store           # 상태 관리 (Zustand 스토어)
 ┣ App.js             # 메인 라우팅 및 앱 설정
 ┗ index.js           # 엔트리 포인트
```

## 🚀 Getting Started
### Installation
Bash
npm install
### Development
Bash
npm start

## 💡 Implementation Details (핵심 구현 내용)
- Zustand를 이용한 중앙 집중식 상태 관리: 전역 상태로 리뷰 데이터를 관리하여 컴포넌트 간 데이터 동기화 최적화

- 컴포넌트 모듈화: 비대해진 뷰 컴포넌트를 ReviewItem 등으로 분리하여 유지보수성 향상

- 사용자 경험(UX): 데이터 로딩 시 스켈레톤/스피너 적용 및 인터랙션 애니메이션 구현

* **Troubleshooting:** 
- 개발하면서 겪었던 가장 큰 문제