import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "@/redux toolkit/cartSlice";
import Home from "./Home";
import { Back } from "@/icons/Back";

const NavBar: React.FC = () => {
  const router = useRouter();
  const slug = router.route;
  const dispatch = useDispatch();
  const storeInfo = useSelector((state: any) => state.storeInfo.storeInfo);
  const [store, setStore] = useState<string | null>(null);
  useEffect(() => {
    setStore(storeInfo?.storeName);
  }, [storeInfo]);
  const goBack = () => {
    router.back();
  };

  return (
    <nav className="p-4 flex justify-between items-center">
      <div className="text-primary-700  text-lg cursor-pointer" onClick={goBack}>
       {slug !== "/" && <Back />}
      </div>
      <h1 className="text-primary-700 text-lg font-semibold">{store}</h1>
      <Home />
    </nav>
  );
};

export default NavBar;
