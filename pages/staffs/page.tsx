"use-client";
import CustomStaffRadio from "@/components/CustomStaffRadio";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSWR from "swr";
import { setSelectedStaff } from "@/redux toolkit/cartSlice";
import Error from "@/components/Error";

import { CartSide } from "@/components/CartSide";
import { setSelectedStaffList } from "@/redux toolkit/staffSlice";
import { useRouter } from "next/router";
import BookingCart from "@/components/BookingCart";

type FetcherFunction = (...args: Parameters<typeof fetch>) => Promise<any>;

const fetcher: FetcherFunction = (...args) =>
  fetch(...args).then((res) => res.json());

const StaffsPage: React.FC = () => {
  const { data, error, isLoading } = useSWR(
    "https://big-umbrella-c5c3450b8837.herokuapp.com/staff/?isOnlyActive=true",
    fetcher
  );
  const bookingInfo = useSelector((state: any) => state.cart);
  const router = useRouter();
  useEffect(() => {
    if (bookingInfo?.items.length === 0) {
      router.push("/");
    }
  }, [bookingInfo, router]);

  const dispatch = useDispatch();
  const [selectStaff, setSelectStaff] = useState<number | null>(null);

  const anyStaff: Staff = useMemo(
    () => ({
      id: 0,
      firstName: "Any",
      lastName: "Professional",
      nickName: "Any",
      phone: "",
      skillLevel: 1,
      dateOfBirth: "",
      rate: 1,
      workingDays: "1,2,3,4,5,6,7",
      active: true,
    }),
    []
  );

  const newStaffsArray = useMemo(() => {
    return data ? [anyStaff, ...data] : [anyStaff];
  }, [data, anyStaff]);
  useEffect(() => {
    dispatch(setSelectedStaffList(newStaffsArray));
  });
  useEffect(() => {
    if (newStaffsArray?.length > 0 && selectStaff === null) {
      setSelectStaff(newStaffsArray[0].id);
      dispatch(setSelectedStaff(newStaffsArray[0]));
    }
  }, [newStaffsArray, selectStaff, dispatch, data]);

  const handleSelectStaff = (staff: Staff) => {
    setSelectStaff(staff.id);
    dispatch(setSelectedStaff(staff));
  };

  if (error) return <Error />;
  if (isLoading) {
    return (
      <div className="lg:flex gap-20 md:gap-0 md:justify-around lg:mx-auto mx-10">
        <div>
          <h1 className="mt-10 mb-5 text-3xl mx-5 font-bold">Select professional</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-1 gap-y-4 ">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
              <div key={index} className="animate-pulse bg-gray-200 rounded-lg h-24"></div>
            ))}
          </div>
        </div>
        <div className="sticky top-20 self-start mt-20">
          <CartSide />
        </div>
      </div>
    );
  }

  return (
    <div className="lg:flex gap-20 md:gap-0 md:justify-around lg:mx-auto ">
      <div>
        <h1 className="mt-10 mb-5 text-3xl mx-5 font-bold">Select professional</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-1 gap-y-4 ">
          {newStaffsArray?.map((staff: Staff) => (
            <CustomStaffRadio
              error={error}
              isLoading={isLoading}
              key={staff.id}
              staff={staff}
              selected={selectStaff === staff.id}
              onSelect={handleSelectStaff}
            />
          ))}
        </div>
      </div>
      <div className="sticky top-20 self-start mt-20">
        <CartSide />
      </div>
      <BookingCart />
    </div>
  );
};

export default StaffsPage;
