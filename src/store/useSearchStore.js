import { create } from "zustand";
import axios from "axios";

const useSearchStore = create((set, get) => ({
  // 상태 정의
  searchTerm: "",
  sortBy: "distance",
  searchResults: [],
  isLoading: false,
  page: 0,
  hasMore: true,

  fetchInitialData: async (pageNum) => {
    if (get().isLoading) return;
    
    set({ isLoading: true });

    try {
      const res = await axios.get(`/api/restareas/random?size=10`); 
      
      const fetchedData = Array.isArray(res.data) ? res.data : []; 

      const isLast = fetchedData.length < 10; 

      set((state) => ({
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

  setSearchTerm: async (term) => {
    // 검색어 상태 업데이트 및 페이지 리셋
    set({ searchTerm: term, page: 0 });
    if (!term || term.trim() === "") {
      get().fetchInitialData(0);
      return;
    }

    set({ isLoading: true });
    try {
      await axios.post(`/api/ranking/record`, null, {
        params: { keyword: term }
      });

      const res = await axios.get(
        `/api/restareas/search-name?keyword=${encodeURIComponent(term)}&page=0&size=10`
      );
      
      const data = res.data.content || [];
      const isLast = res.data.last;

      set({ 
        searchResults: data,
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

  // 필터 및 정렬 데이터 반환
 getFilteredItems: () => {
    const { searchResults, sortBy } = get();
    if (!Array.isArray(searchResults) || searchResults.length === 0) return [];

    return [...searchResults].sort((a, b) => {
      if (sortBy === "price") {
        return (a.gasolinePrice || Infinity) - (b.gasolinePrice || Infinity);
      } else {
        return (a.dbName || "").localeCompare(b.dbName || "");
      }
    });
  },
}));

export default useSearchStore;