import BookingCart from "@/components/BookingCart";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartHasItem, setCartHasItem] = useState<boolean>(true);

  const bookingInfo = useSelector((state: { cart: CartState }) => state.cart);
  const cartItems = bookingInfo.items.length;
  useEffect(() => {
    setCartHasItem(cartItems !== 0);
  }, [cartItems]);

  return (
    <div >
      <main>{children}</main>
      {cartHasItem ? <BookingCart bookingInfo={bookingInfo} /> : ""}
    </div>
  );
};

export default Layout;
