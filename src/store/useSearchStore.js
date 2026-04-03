import { create } from 'zustand';
import { SEARCH_MOCK_DATA } from '../data/SearchMock';
import axios from 'axios';

const useSearchStore = create((set, get) => ({
  // 상태
  searchTerm: '',
  sortBy: 'distance', // 'distance' | 'price'


  setSearchTerm: async (term) => {
    set({ searchTerm: term });

    if (term.trim() !== '') {
      try {
      const res = await axios.get(`/api/rest-area/search?keyword=${encodeURIComponent(term)}&_t=${new Date().getTime()}`);
      console.log("✅ 응답 성공:", res.data);
      } catch (error) {
        console.error("❌ 백엔드 통신 에러:", error);
      }
    }
  },

  setSortBy: (sort) => set({ sortBy: sort }),
  
  resetSearch: () => set({ searchTerm: '', sortBy: 'distance' }),

  getFilteredItems: () => {
    const { searchTerm, sortBy } = get();

    let result = SEARCH_MOCK_DATA.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return [...result].sort((a, b) => {
      if (sortBy === 'price') {
        // 가격순: "1,500" -> 1500
        const priceA = parseInt(a.gasPrice.replace(/,/g, ''));
        const priceB = parseInt(b.gasPrice.replace(/,/g, ''));
        return priceA - priceB;
      } else {
        // 거리순: "2.4km" -> 2.4
        const distA = parseFloat(a.distance);
        const distB = parseFloat(b.distance);
        return distA - distB;
      }
    });
  },
}));

export default useSearchStore;