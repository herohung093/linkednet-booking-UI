import React from "react";
import NailSalonServiceCard from "./NailSalonServiceCard";

export const NailServices: React.FC<{ data: Category }> = ({ data }) => {
  return (
    <div className="mb-10">
      <h1 className="p-3 font-bold text-2xl">{data.category}</h1>
      {data.services.map((service) => (
        <NailSalonServiceCard key={service.serviceType.id} service={service} />
      ))}
    </div>
  );
};
