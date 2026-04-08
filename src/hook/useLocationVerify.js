import { useState, useEffect } from "react";

// restArea: { name, latitude, longitude } | null
// null이면 GPS 검사를 하지 않고 "idle" 반환
export function useLocationVerify(restArea) {
  const [verifyStatus, setVerifyStatus] = useState(
    restArea ? "loading" : "idle"
  );

  useEffect(() => {
    if (!restArea) {
      setVerifyStatus("idle");
      return;
    }

    setVerifyStatus("loading");

    const { latitude: targetLat, longitude: targetLon } = restArea;

    if (!("geolocation" in navigator)) {
      setVerifyStatus("normal");
      return;
    }

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
  }, [restArea?.latitude, restArea?.longitude]);

  return { verifyStatus };
}
