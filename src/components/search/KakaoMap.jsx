import React, { useEffect, useRef } from "react";

export default function KakaoMap({ center, locations }) {
  const mapRef = useRef(null);

  useEffect(() => {
  // 🚩 [수정] 데이터가 완벽하게 준비되지 않았으면 아예 시작도 안 함
  if (!window.kakao || !center || !center.lat || !center.lng) {
    console.log("📍 좌표 데이터 기다리는 중...");
    return;
  }

  const { kakao } = window;

  kakao.maps.load(() => {
    if (!mapRef.current) return;

    const container = mapRef.current;
    
    // 이제 여기서 center.lat은 무조건 존재함이 보장됨
    const options = {
      center: new kakao.maps.LatLng(center.lat, center.lng),
      level: 4,
    };

    const map = new kakao.maps.Map(container, options);

    // 마커 로직에서도 loc.lat이 있는지 확인
    if (locations && locations.length > 0) {
      locations.forEach((loc) => {
        if (loc && loc.lat && loc.lng) {
          const markerPosition = new kakao.maps.LatLng(loc.lat, loc.lng);
          new kakao.maps.Marker({
            position: markerPosition,
            title: loc.name,
          }).setMap(map);
        }
      });
    }
    
    map.relayout();
  });
}, [center, locations]);// 좌표나 데이터 변경 시 재실행

  return (
    <div
      ref={mapRef}
      className="w-full h-full min-h-[300px]"
      style={{ backgroundColor: "#f8f9fa" }}
    />
  );
}
