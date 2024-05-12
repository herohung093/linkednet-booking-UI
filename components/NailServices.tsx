import React, { useState } from "react";
import NailSalonServiceCard from "./NailSalonServiceCard";
import { TriangleDown } from "@/icons/TriangleDown";
import { TriangleUp } from "@/icons/TriangleUp";
import { Horizon } from "@/icons/Horizon";
import Cart from "./Cart";

export const NailServices: React.FC<{
  data: NailSalonService[];
  index: number;
}> = ({ data, index }) => {
  const [showMap, setShowMap] = useState(true);

  return (
    <div>
      <div className="flex items-center justify-between mx-5 min-w-[300px]">
        <h1 className="p-3 font-bold text-2xl">{data[0].serviceType.type}</h1>
        <button
          onClick={() => setShowMap((prevShowMap) => !prevShowMap)}
          className="text-blue-500 hover:text-blue-700 focus:outline-none"
        >
          {showMap ? <TriangleUp /> : <TriangleDown />}
        </button>
      </div>
      {showMap && (
        <div>
          {data?.map((service) => (
            <NailSalonServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
      {!showMap ? <Horizon /> : ""}
    </div>
  );
};
