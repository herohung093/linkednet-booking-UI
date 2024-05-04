"use client";
import { Logo } from "@/components/Logo";
import { NailServices } from "@/components/NailServices";
import Navbar from "@/components/Navbar";
import { Staff } from "@/components/Staff";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useSWR from "swr";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

type FetcherFunction = (...args: Parameters<typeof fetch>) => Promise<any>;

const fetcher: FetcherFunction = (...args) =>
  fetch(...args).then((res) => res.json());

export default function Home() {
  const { data: serviceData } = useSWR(
    "https://big-umbrella-c5c3450b8837.herokuapp.com/service/",
    fetcher
  );
  const { data: staffData } = useSWR(
    "https://big-umbrella-c5c3450b8837.herokuapp.com/staff/?isOnlyActive=true",
    fetcher
  );
  console.log(staffData);

  const sortedData = serviceData?.sort((a: any, b: any) =>
    a.serviceType.type.localeCompare(b.serviceType.type)
  );

  const groupedData = sortedData?.reduce((acc: any, service: any) => {
    const { serviceType, ...rest } = service;
    const index = acc.findIndex(
      (item: any) => item[0].serviceType.type === serviceType.type
    );
    if (index === -1) {
      acc.push([{ serviceType, ...rest }]);
    } else {
      acc[index].push({ serviceType, ...rest });
    }
    return acc;
  }, []);

  const [cartHasItem, setCartHasItem] = useState<boolean>(true);

  const bookingInfo = useSelector((state: { cart: CartState }) => state.cart);
  const cartItems = bookingInfo.items.length;
  useEffect(() => {
    setCartHasItem(cartItems !== 0);
  }, [cartItems]);

  return (
    <main>
      <div className="sm:w-[80%] m-auto ">
        <Logo />
        {groupedData &&
          groupedData.map((item: any, index: number) => (
            <NailServices key={index} data={item} index={index} />
          ))}
        <div className="p-3 font-bold text-2xl m-5 ">Staff</div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 ">
          {staffData?.map((staff: Staff, index: number) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-8 mx-5 flex flex-col justify-center items-center mb-3 "
            >
              <div className="text-lg font-semibold flex justify-center gap-2 mb-2 items-center">
                <AccountCircleIcon />
                {staff.firstName} {staff.lastName}
              </div>
              <p className="text-gray-600 mb-4">Nickname: {staff.nickName}</p>
            </div>
          ))}
        </div>
        {cartHasItem ? <Navbar bookingInfo={bookingInfo} /> : ""}
      </div>
    </main>
  );
}
