"use-client";
import CustomStaffRadio from "@/components/CustomStaffRadio";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Error from "@/components/Error";
import { setSelectedStaffList, setAllStaff } from "@/redux toolkit/staffSlice";
import { useRouter } from "next/router";
import axios from "@/ulti/axios";
import { getSelectedStaffId, setSelectedStaffForFirstGuest } from "@/redux toolkit/cartSlice";

const StaffPage: React.FC = () => {
  const router = useRouter();
  const preSelectedStaff =  useSelector(getSelectedStaffId);
  const dispatch = useDispatch();
  const [selectStaff, setSelectStaff] = useState<number | null>(null);
  const urlStoreUuid = router.query;

  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {

    const fetchData = async () => {
      try {
        const result = await axios.get("/staff/?isOnlyActive=true", {
          headers: {
            'X-StoreID': urlStoreUuid.storeUuid,
          }
        }).then(res => res.data);

        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (urlStoreUuid.storeUuid) {
      fetchData();
    }
  }, [urlStoreUuid]);

  const bookingInfo = useSelector((state: any) => state.cart);
  useEffect(() => {

    if (bookingInfo?.guests.length === 0 && urlStoreUuid.storeUuid) {
      router.push("/?storeUuid=" + urlStoreUuid.storeUuid);
    }
  }, [bookingInfo, router, urlStoreUuid.storeUuid]);


  const anyStaff: Staff = useMemo(
    () => ({
      id: 0,
      firstName: "Any",
      lastName: "Professional",
      nickname: "Any",
      phone: "",
      skillLevel: 1,
      dateOfBirth: "",
      rate: 1,
      workingDays: "1,2,3,4,5,6,7",
      active: true,
    }),
    []
  );

  const newstaffArray = useMemo(() => {
    if (data && data.length !== 0) {
      dispatch(setAllStaff([anyStaff, ...data]))
      if (bookingInfo.isGroupBooking && bookingInfo.guests.length > 1) {
        return [anyStaff];
      }
      return [anyStaff, ...data];;
    }
    return [];
  }, [data]);

  useEffect(() => {
    dispatch(setSelectedStaffList(newstaffArray));

    // preselect staff when navigate back to the page
    setSelectStaff(preSelectedStaff)
  });

  const handleSelectStaff = (staff: Staff) => {
    setSelectStaff(staff.id);
    dispatch(setSelectedStaffForFirstGuest(staff));
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
      </div>
    );
  }

  return (
    <div className="lg:flex gap-20 md:gap-0 md:justify-around lg:mx-auto mx-5 ">
      <div>
        <h1 className="mt-10 mb-5 text-3xl font-bold">Select professional</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-1 gap-y-4 ">
          {newstaffArray?.map((staff: Staff) => (
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
    </div>
  );
};

export default StaffPage;

