import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

export const StoreMap: React.FC<any> = ({ storeConfig }) => {
  const storeAddress = storeConfig?.storeAddress;
  const [directionUrl, setDirectionUrl] = useState<string>("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${encodeURIComponent(storeAddress)}`;
        setDirectionUrl(url);
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [storeAddress]);

  const router = useRouter();
  const getDirection = () => {
    router.push(directionUrl);
  };

  return (
    <div className="p-6 cursor-pointer mx-auto" onClick={getDirection}>
      <img src="/map.png" alt="map" className="mb-5 mx-auto" />
      <h1 >{storeConfig?.storeAddress}</h1>
      <h3 className="font-bold text-blue-950">Get directions</h3>
    </div>
  );
};
