import CustomStaffRadio from "@/components/CustomStaffRadio";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import useSWR from "swr";
import { setSelectedStaff } from "@/redux toolkit/cartSlice";
import Error from "@/components/Error";
import Loading from "@/components/Loading";

type FetcherFunction = (...args: Parameters<typeof fetch>) => Promise<any>;

const fetcher: FetcherFunction = (...args) =>
  fetch(...args).then((res) => res.json());

const StaffsPage: React.FC = () => {
  const { data, error, isLoading } = useSWR(
    "https://big-umbrella-c5c3450b8837.herokuapp.com/staff/?isOnlyActive=true",
    fetcher
  );
  const dispatch = useDispatch();
  const [selectStaff, setSelectStaff] = useState<number | null>(null);

  const anyStaff: Staff = useMemo(
    () => ({
      id: -1,
      firstName: "Any",
      lastName: "Professional",
      nickName: "Any",
      phone: "",
      skillLevel: 1,
      dateOfBirth: "",
      rate: 1,
      workingDays: "",
      active: true,
    }),
    []
  );

  const newStaffsArray = useMemo(() => {
    return data ? [anyStaff, ...data] : [anyStaff];
  }, [data, anyStaff]);
  useEffect(() => {
    if (newStaffsArray.length > 0 && selectStaff === null) {
      setSelectStaff(newStaffsArray[0].id);
      dispatch(setSelectedStaff(newStaffsArray[0].id));
    }
  }, [newStaffsArray, selectStaff, dispatch]);

  const handleSelectStaff = (staffId: number) => {
    setSelectStaff(staffId);
    dispatch(setSelectedStaff(staffId));
  };

  if (error) return <Error />;
  if (isLoading) return <Loading />;
  return (
    <div className="grid grid-cols-2 gap-x-1 gap-y-4 mt-10">
      {newStaffsArray?.map((staff: Staff) => (
        <CustomStaffRadio
          error={error}
          isLoading={isLoading}
          key={staff.id}
          id={staff.id}
          firstName={staff.firstName}
          lastName={staff.lastName}
          nickName={staff.nickName}
          selected={selectStaff === staff.id}
          onSelect={handleSelectStaff}
        />
      ))}
    </div>
  );
};

export default StaffsPage;
