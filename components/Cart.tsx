"use client";
import React, { useEffect, useState } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
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
              <div>
                {item.serviceName} x {item.quantity}
              </div>
              <div>$ {(item.servicePrice * item.quantity).toFixed(2)}</div>
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
              <Cross2Icon />
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
