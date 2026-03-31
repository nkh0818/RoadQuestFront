import { useState, useEffect } from "react";

export function useLocationVerify(id, initialRestArea) {
  const [verifyStatus, setVerifyStatus] = useState("loading");
  const [restAreaInfo, setRestAreaInfo] = useState(initialRestArea || null);

  useEffect(() => {
    const checkLocationMatch = async () => {
      try {
        let targetLat, targetLon;

        if (!initialRestArea) {
          // TODO: 백엔드 연결 시 await axios.get(`/api/restareas/${id}`) 로 교체
          targetLat = 37.235;
          targetLon = 127.105;
          setRestAreaInfo({ name: "용인 휴게소", latitude: targetLat, longitude: targetLon });
        } else {
          targetLat = initialRestArea.latitude;
          targetLon = initialRestArea.longitude;
        }

        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              const isNear =
                Math.abs(latitude - targetLat) < 0.005 &&
                Math.abs(longitude - targetLon) < 0.005;
              setVerifyStatus(isNear ? "verified" : "normal");
            },
            () => setVerifyStatus("normal"),
            { enableHighAccuracy: true, timeout: 5000 }
          );
        } else {
          setVerifyStatus("normal");
        }
      } catch (error) {
        setVerifyStatus("normal");
        console.log("위치 인증 오류:", error);
      }
    };

    checkLocationMatch();
  }, [id]); // initialRestArea를 deps에서 제외 — 상태 설정 루프 방지

  return { verifyStatus, restAreaInfo };
}
