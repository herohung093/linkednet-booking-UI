import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

const Skeleton = () => (
  <div className="animate-pulse p-6 mx-auto">
    <div className="h-40 bg-gray-300 rounded mb-5 mx-auto"></div>
    <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
    <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto"></div>
  </div>
);

export const StoreMap: React.FC<any> = ({ storeConfig }) => {
  const storeAddress = storeConfig?.storeAddress;
  const [directionUrl, setDirectionUrl] = useState<string>("");

  const router = useRouter();
  const getDirection = () => {
    router.push(directionUrl);
  };

  return (
    <div className="p-6 cursor-pointer mx-auto" onClick={getDirection}>
      {storeConfig ? (
        <>
          <img src="/map.png" alt="map" className="mb-5 mx-auto" />
          <h1>{storeConfig?.storeAddress}</h1>
          <h3 className="font-bold text-blue-950">Get directions</h3>
        </>
      ) : (
        <Skeleton />
      )}
    </div>
  );
};
