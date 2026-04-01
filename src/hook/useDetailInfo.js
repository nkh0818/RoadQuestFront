// useDetailInfo.js — 유가 정보, 이벤트 정렬, 메뉴 가시성 로직을 담당하는 훅
import { useState, useMemo } from "react";

export default function useDetailInfo({ info, events }) {

  // 메뉴 더보기 가시성 상태
  const [menuVisible, setMenuVisible] = useState(5);

  const showMore = () => setMenuVisible((prev) => prev + 5);

  // 이벤트 날짜 기준 내림차순 정렬
  const sortedEvents = useMemo(() => {
    return events
      ? [...events].sort((a, b) => {
          const dateA = a.stime || "";
          const dateB = b.stime || "";
          return dateB.localeCompare(dateA);
        })
      : [];
  }, [events]);

  // 3. 유가 정보 가져오기 (필드명이 다를 경우를 대비해 || 로 모두 체크)
  // info.gasolinePrice 혹은 info.gasoline_price 둘 다 확인
  const getGasoline = () => {
    const val = info?.gasolinePrice || info?.gasoline_price || 0;
    const num = Number(val);
    return num > 0 ? num.toLocaleString() : "정보없음";
  };

  const getDiesel = () => {
    const val = info?.diselPrice || info?.disel_price || 0;
    const num = Number(val);
    return num > 0 ? num.toLocaleString() : "정보없음";
  };

  const getLpg = () => {
    const val = info?.lpgPrice || info?.lpg_price || 0;
    const num = Number(val);
    return num > 0 ? num.toLocaleString() : "정보없음";
  };

  const fuelData = [
    { type: "휘발유", price: getGasoline(), color: "text-blue-600" },
    { type: "경유", price: getDiesel(), color: "text-slate-800" },
    { type: "LPG", price: getLpg(), color: "text-emerald-500" },
  ];

  return { menuVisible, showMore, sortedEvents, fuelData };
}
