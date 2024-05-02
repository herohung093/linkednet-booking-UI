"use client";
import React from "react";
import { AddIcon } from "@/icons/AddIcon";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux toolkit/cartSlice";

const NailSalonServiceCard = ({ service }: { service: NailSalonService }) => {
  const dispatch = useDispatch();

  const {
    serviceType,
    serviceName,
    estimatedTime,
    servicePrice,
    serviceDescription,
  } = service;
  const handleClickAdd = () => {
    dispatch(
      addToCart({    
        serviceType: serviceType,
        serviceName: serviceName,
        serviceDescription: serviceDescription,
        estimatedTime: estimatedTime,
        servicePrice: servicePrice,
        quantity: 1,
      })
    );
  };
  return (
    <div className="bg-transparent rounded-lg shadow-md p-4  mx-auto flex items-center justify-between my-2">
      <div>
        <h2 className="text-lg font-semibold mb-2">{serviceName}</h2>
        <p className="text-gray-600 mb-4">{estimatedTime}</p>
        <p className="text-green-600 font-bold text-xl">{servicePrice}</p>
      </div>
      <div className="mr-7">
        <AddIcon onClick={handleClickAdd} />
      </div>
    </div>
  );
};

export default NailSalonServiceCard;
