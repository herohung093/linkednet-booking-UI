import React from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { clearCart } from "@/redux toolkit/cartSlice";
import Home from "./Home";
import { Back } from "@/icons/Back";

const NavBar: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const goBack = () => {
    router.back();
  };

  const goToHome = () => {
    dispatch(clearCart());
    router.push("/");
  };

  return (
    <nav className="bg-pink-600 p-4 flex justify-between items-center">
      <div className="text-white  text-lg cursor-pointer" onClick={goBack}>
        <Back />
      </div>
      <h1 className="text-white text-lg font-semibold">Logo</h1>
      <Home />
    </nav>
  );
};

export default NavBar;
