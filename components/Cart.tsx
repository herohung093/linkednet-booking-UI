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
            className="flex justify-between items-center border-b border-gray-300 py-2 whitespace-nowrap"
          >
            <div className="flex justify-between w-full">
              <div>
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
              <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 15 15">
                <path fill="#dc2626" fill-rule="evenodd" d="M5.5 1a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zM3 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1H11v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4h-.5a.5.5 0 0 1-.5-.5M5 4h5v8H5z" clip-rule="evenodd" />
              </svg>
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
