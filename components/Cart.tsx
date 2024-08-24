"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart } from "@/redux toolkit/cartSlice";

const Cart: React.FC = () => {
  const cartRedux = useSelector((state: any) => state.cart);
  const dispatch = useDispatch();


  const [cartItems, setCartItems] = useState<CartItem[]>(cartRedux.items);
  const [totalPrice, setTotalPrice] = useState<number>(cartRedux.total);
  const [totalEstimatedTime, setTotalEstimatedTime] = useState<number>(
    cartRedux.totalEstimatedTime
  );

  useEffect(() => {
    setCartItems(cartRedux.items);
    setTotalPrice(cartRedux.total);
    setTotalEstimatedTime(cartRedux.totalEstimatedTime);
  }, [cartRedux.items, cartRedux.total, cartRedux.totalEstimatedTime]);

  const handleRemoveFromCart = (
    id: number,
    servicePrice: number,
    estimatedTime: number
  ) => {
    dispatch(
      removeFromCart({
        id: id,
        servicePrice: servicePrice,
        estimatedTime: estimatedTime,
      })
    );
  };

  return (
    <div>
      <div>
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border-b border-gray-300 py-2"
          >
            <div className="flex justify-between w-full">
              <div className="whitespace-nowrap">
                {item.serviceName}
              </div>
              <div >$ {(item.servicePrice).toFixed(2)}</div>
            </div>
            <button
              onClick={() =>
                handleRemoveFromCart(
                  item.id,
                  item.servicePrice,
                  item.estimatedTime
                )
              }
              className="px-3 py-1 rounded"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6z"/></svg>
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4 flex w-full justify-between">
        <p className="font-bold">Total Price: </p>
        <div className="mr-10">$ {totalPrice.toFixed(2)}</div>
      </div>
      <div>Estimated time : {totalEstimatedTime} minutes</div>
    </div>
  );
};

export default Cart;
