import { useRouter } from "next/router";
import React from "react";

export const StoreMap: React.FC<any> = ({ storeConfig }) => {
  const router = useRouter();
  const getDirection = () => {
    router.push(
      "https://www.google.com/maps/dir/-37.7240234,144.8401234/33+Nanovich+Ave,+Girrawheen+WA+6064/@-33.9007252,119.7453325,5z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0x2a32ae0e1097fcfb:0x19b1a0dc03d86c2a!2m2!1d115.8354706!2d-31.8433801?entry=ttu"
    );
  };
  return (
    <div className="p-6 cursor-pointer" onClick={getDirection}>
      <img src="/map.png" alt="map" className="mb-5" />
      <h1>{storeConfig?.storeAddress}</h1>
      <h3 className="font-bold text-blue-950">Get directions</h3>
    </div>
  );
};
