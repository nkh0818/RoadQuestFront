import { create } from 'zustand';
import { SEARCH_MOCK_DATA } from '../data/SearchMock';

const useSearchStore = create((set, get) => ({
  // 상태
  searchTerm: '',
  sortBy: 'distance', // 'distance' | 'price'


  setSearchTerm: (term) => set({ searchTerm: term }),
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