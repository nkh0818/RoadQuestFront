import { create } from "zustand";

export const useInquiryStore = create((set) => ({
  isInquiryOpen: false,
  openInquiry: () => set({ isInquiryOpen: true }),  // 열기
  closeInquiry: () => set({ isInquiryOpen: false }), // 닫기
}));