import React, { useState } from "react";
import NailSalonServiceCard from "./NailSalonServiceCard";
import { TriangleDown } from "@/icons/TriangleDown";
import { TriangleUp } from "@/icons/TriangleUp";
import { Horizon } from "@/icons/Horizon";

const Skeleton = () => (
  <div className="animate-pulse mx-5  mb-6">
    <div className="flex items-center justify-between mb-4">
      <div className="h-6 bg-gray-300 rounded w-1/2"></div>
      <div className="h-6 bg-gray-300 rounded w-6"></div>
    </div>
    <div className="space-y-4">
      <div className="h-20 bg-gray-300 rounded w-full"></div>
      <div className="h-20 bg-gray-300 rounded w-full"></div>
      <div className="h-20 bg-gray-300 rounded w-full"></div>
      <div className="h-20 bg-gray-300 rounded w-full"></div>
    </div>
  </div>
);

export const NailServices: React.FC<{
  data: NailSalonService[];
  index: number;
}> = ({ data }) => {
  const [showMap, setShowMap] = useState(true);

  return (
    <div>
      {data ? (
        <>
          <div className="flex items-center justify-between mx-5">
            <h1 className="p-3 font-bold text-2xl w-full ">
              {data[0].serviceType.type}
            </h1>
            <button
              onClick={() => setShowMap((prevShowMap) => !prevShowMap)}
              className="text-blue-500 hover:text-blue-700 focus:outline-none"
            >
              {!showMap ? <TriangleUp /> : <TriangleDown />}
            </button>
          </div>
          {!showMap && (
            <div>
              {data?.map((service) => (
                <NailSalonServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
          {!showMap && <Horizon />}
        </>
      ) : (
        <Skeleton />
      )}
    </div>
  );
};
