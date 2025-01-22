import NavBar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import { CartSide } from "@/components/CartSide";
import BookingCart from "@/components/BookingCart";
import { useRouter } from "next/router";
import { getSelectedStaffId } from "@/redux toolkit/cartSlice";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const bookingInfo = useSelector((state: { cart: CartState }) => state.cart);
  const selectedStaff = useSelector(getSelectedStaffId);
  const router = useRouter();
  const slug = router.route;
  const [disableCartSideContinueButton, setDisableCartSideContinueButton] = useState<boolean>(false);
  const [disableBookingCartContinueButton, setDisableBookingCartContinueButton] = useState<boolean>(false);

  const displayContinueButton = () => {
    switch (slug) {
      case "/":
        setDisableCartSideContinueButton(false);
        setDisableBookingCartContinueButton(false);
        break;
      case "/staff":
        setDisableCartSideContinueButton(selectedStaff === null);
        setDisableBookingCartContinueButton(selectedStaff === null);
        break;
      case "/time":
        setDisableCartSideContinueButton(bookingInfo.selectedHour === null || bookingInfo.selectedHour === undefined);
        setDisableBookingCartContinueButton(bookingInfo.selectedHour === null || bookingInfo.selectedHour === undefined);
        break;
      case "/confirmation":
        setDisableCartSideContinueButton(true);
        setDisableBookingCartContinueButton(true);
        break;
    }
  };

  useEffect(() => {
    displayContinueButton();
  }, [router.route, bookingInfo]);

  return (
    <div className="lg:w-[80%] mx-auto mb-20">
      <NavBar />
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }}>
        <Box flex={{ xs: 1, md: 2 }} >
          <main>{children}</main>
        </Box>
        <Box
          flex={{ xs: 0, md: 1 }} 
          ml={{ xs: 0, md: 3 }}
          className="mt-20 top-20"
          sx={{ display: { xs: "none", md: "block", lg: "block" } }}
        >
          <CartSide disableContinueButton={disableCartSideContinueButton} />
        </Box>
        <Box sx={{ display: { xs: "block", md: "none", lg: "none" } }}>
        {<BookingCart disableContinueButton={disableBookingCartContinueButton} />}
      </Box>
      </Box>
    </div>
  );
};

export default Layout;
