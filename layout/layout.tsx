import BookingCart from "@/components/BookingCart";
import NavBar from "@/components/Navbar";
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
    <div  className="sm:w-[80%] m-auto mb-20">
      <NavBar/>
      <main>
        {children}
        </main>   
      {cartHasItem ? <BookingCart bookingInfo={bookingInfo} /> : ""}    
    </div>
  );
};

export default Layout;
