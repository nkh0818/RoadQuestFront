/* Zustand Store - 찜 목록 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSavedStore = create(
  persist(
    (set, get) => ({
      savedRestAreas: [],
      
      // 찜 토글 액션
      toggleSave: (restArea) => {
        const { savedRestAreas } = get();
        const isExist = savedRestAreas.some((item) => item.stdRestCd === restArea.stdRestCd);
        
        if (isExist) {
          set({
            savedRestAreas: savedRestAreas.filter((item) => item.stdRestCd !== restArea.stdRestCd),
          });
        } else {
          set({ savedRestAreas: [...savedRestAreas, restArea] });
        }
      },

      // 특정 휴게소가 찜 되어있는지 확인하는 함수
      isSaved: (stdRestCd) => get().savedRestAreas.some((item) => item.stdRestCd === stdRestCd),
    }),
    {
      name: 'saved-rest-areas', // 로컬스토리지 키 이름
    }
  )
);