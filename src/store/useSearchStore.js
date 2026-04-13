import { create } from "zustand";
import api from "../api/axios";
import toast from "react-hot-toast";

const useSearchStore = create((set, get) => ({
  // 상태 정의
  searchTerm: "",
  sortBy: "distance",
  searchResults: null,
  isLoading: false,
  page: 0,
  hasMore: true,

  fetchInitialData: async (pageNum = 0) => {
    if (get().isLoading) return;

    set({ isLoading: true });

    try {
      const res = await api.get(`/restareas/random?page=${pageNum}&size=10`);
      const fetchedData = Array.isArray(res.data)
        ? res.data
        : res.data.content || [];

      set({
        searchResults:
          pageNum === 0
            ? fetchedData
            : [...get().searchResults, ...fetchedData],
        page: pageNum,
        hasMore: fetchedData.length === 10,
      });
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  // 검색어 설정 및 검색 실행
  setSearchTerm: async (term) => {
    const trimmedTerm = term?.trim() || "";

    // 검색어가 비어있을 때 처리
    if (!trimmedTerm) {
      set({ searchTerm: "", page: 0, isLoading: true });
      get().fetchInitialData(0);
      return;
    }

    // 2글자 이하일 때
    if (trimmedTerm.length < 2) {
      toast.error("검색어는 2글자 이상 입력해주세요!");
      set({ searchTerm: trimmedTerm });
      return;
    }

    set({ searchTerm: trimmedTerm, page: 0, isLoading: true });

    try {
      api
        .post(`/ranking/record?keyword=${encodeURIComponent(trimmedTerm)}`)
        .catch(() => {});

      const res = await api.get(
        `/restareas/search-name?keyword=${encodeURIComponent(trimmedTerm)}&page=0&size=10`,
      );

      const data = res.data.content || [];
      const isLast =
        res.data.last !== undefined ? res.data.last : data.length < 10;

      set({
        searchResults: data,
        hasMore: !isLast,
        page: 0,
      });
    } catch (error) {
      console.error("검색 에러:", error);
      set({ searchResults: [], hasMore: false });
    } finally {
      set({ isLoading: false });
    }
  },

  setSortBy: (sort) => set({ sortBy: sort }),

  resetSearch: () =>
    set({
      searchTerm: "",
      sortBy: "distance",
      searchResults: [],
      page: 0,
      hasMore: true,
    }),

  // 필터 및 정렬 데이터 반환
  getFilteredItems: () => {
    const { searchResults, sortBy } = get();
    if (!Array.isArray(searchResults) || searchResults.length === 0) return [];

    return [...searchResults].sort((a, b) => {
      if (sortBy === "price") {
        return (a.gasolinePrice || Infinity) - (b.gasolinePrice || Infinity);
      } else if (sortBy === "distance") {
        // distance 필드가 있으면 거리순, 없으면 원래 순서 유지
        if (a.distance != null && b.distance != null) {
          return a.distance - b.distance;
        }
        return 0;
      } else {
        return (a.dbName || "").localeCompare(b.dbName || "");
      }
    });
  },
}));

export default useSearchStore;
