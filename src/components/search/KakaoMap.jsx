import React, { useEffect, useRef } from 'react';

export default function KakaoMapSection({ center, locations }) {
  const mapRef = useRef(null);

  useEffect(() => {
    // 1. kakao 객체 자체가 없으면 중단 (로드 대기)
    if (!window.kakao) return;

    const { kakao } = window;

    kakao.maps.load(() => {
      if (!mapRef.current) return;

      const container = mapRef.current;
      const options = {
        center: new kakao.maps.LatLng(center.lat, center.lng),
        level: 5,
      };

      // 지도 생성
      const map = new kakao.maps.Map(container, options);

      // 마커 표시 로직
      locations.forEach((loc) => {
        const markerPosition = new kakao.maps.LatLng(loc.lat, loc.lng);
        const marker = new kakao.maps.Marker({
          position: markerPosition,
          title: loc.name,
        });
        marker.setMap(map);
      });
    });
  }, [center, locations]); // 좌표나 데이터 변경 시 재실행

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full min-h-[300px]" 
      style={{ backgroundColor: '#f8f9fa' }} 
    />
  );
}