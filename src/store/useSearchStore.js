import { create } from "zustand";
import axios from "axios";

const useSearchStore = create((set, get) => ({
  // 1. 상태 정의 (통일성 있게!)
  searchTerm: "",
  sortBy: "distance",
  searchResults: [], // 모든 리스트 데이터는 여기 담습니다
  isLoading: false,
  page: 0,
  hasMore: true,

  // 2. 초기 데이터 및 추가 데이터 로드 (무한 스크롤용)
  fetchInitialData: async (pageNum = 0) => {
    if (get().isLoading) return;
    
    // 로딩 시작 (페이지 번호는 인자로 받은걸 그대로 유지)
    set({ isLoading: true });

    try {
      const res = await axios.get(`/api/restareas/random?page=${pageNum}&size=5`);
      const fetchedData = res.data.content || [];
      const isLast = res.data.last;

      set((state) => ({
        // 🚩 중요: items가 아니라 searchResults에 저장!
        // pageNum이 0이면 새로 교체, 아니면 기존 리스트 뒤에 합치기
        searchResults: pageNum === 0 ? fetchedData : [...state.searchResults, ...fetchedData],
        page: pageNum,
        hasMore: !isLast,
      }));
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  // 3. 검색 함수
  setSearchTerm: async (term) => {
    // 검색어 상태 업데이트 및 페이지 리셋
    set({ searchTerm: term, page: 0 });

    // 검색어가 없으면 다시 랜덤 리스트로 초기화
    if (!term || term.trim() === "") {
      get().fetchInitialData(0);
      return;
    }

    set({ isLoading: true });
    try {
      // 🚩 [Redis 기록] 다희님 컨트롤러 주소 /api/ranking/record 에 맞춰 호출
      // 쿼리 스트링으로 keyword를 넘깁니다.
      await axios.post(`/api/ranking/record`, null, {
        params: { keyword: term }
      });

      // 🚩 [실제 검색] 검색어에 맞는 휴게소 리스트 가져오기
      const res = await axios.get(
        `/api/restareas/search-name?keyword=${encodeURIComponent(term)}&page=0&size=10`
      );
      
      const data = res.data.content || [];
      const isLast = res.data.last;

      set({ 
        searchResults: data, // 검색은 새로운 결과로 교체
        hasMore: !isLast,
        page: 0 
      });
    } catch (error) {
      console.error("검색/기록 에러:", error);
      set({ searchResults: [], hasMore: false });
    } finally {
      set({ isLoading: false });
    }
  },

  setSortBy: (sort) => set({ sortBy: sort }),

  resetSearch: () => set({ 
    searchTerm: "", 
    sortBy: "distance", 
    searchResults: [], 
    page: 0, 
    hasMore: true 
  }),

  // 4. 필터 및 정렬 데이터 반환
 getFilteredItems: () => {
    const { searchResults, sortBy } = get();
    if (!Array.isArray(searchResults) || searchResults.length === 0) return [];

    return [...searchResults].sort((a, b) => {
      if (sortBy === "price") {
        return (a.gasolinePrice || Infinity) - (b.gasolinePrice || Infinity);
      } else {
        // 기본 정렬: 이름순 (혹은 필요시 거리순 로직 추가)
        return (a.dbName || "").localeCompare(b.dbName || "");
      }
    });
  },
}));

export default useSearchStore;