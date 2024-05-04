"use client";
import React from "react";
import { AddIcon } from "@/icons/AddIcon";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "@/redux toolkit/cartSlice";
import { CheckIcon } from "@/icons/CheckIcon";

const NailSalonServiceCard = ({ service }: { service: NailSalonService }) => {
  const {
    id,
    serviceType,
    serviceName,
    estimatedTime,
    servicePrice,
    serviceDescription,
  } = service;
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart.items);

  const isServiceInCart: boolean | null = cartItems?.some(
    (item: any) => item.id === id
  );

  const handleClickAdd = () => {
    dispatch(
      addToCart({
        serviceType: serviceType,
        id: id,
        serviceDescription: serviceDescription,
        estimatedTime: estimatedTime,
        servicePrice: servicePrice,
        quantity: 1,
      })
    );
  };

  const handleClickRemove = () => {
    dispatch(
      removeFromCart({
        serviceType: serviceType,
        estimatedTime: estimatedTime,
        servicePrice: servicePrice,
      })
    );
  };
  return (
    <div className="bg-transparent rounded-lg shadow-md p-4  mx-auto flex items-center justify-between my-2">
      <div>
        <h2 className="text-lg font-semibold mb-2">{serviceName}</h2>
        <p className="text-gray-600 mb-4">
          Estimated time: {estimatedTime} min
        </p>
        <p className="text-green-600 font-bold text-xl">${servicePrice}</p>
      </div>
      <div className="mr-7">
        {!isServiceInCart ? (
          <AddIcon onClick={handleClickAdd} />
        ) : (
          <CheckIcon onClick={handleClickRemove} />
        )}
      </div>
    </div>
  );
};

export default NailSalonServiceCard;
