import CustomRadio from "@/components/CustomRadioProps";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import useSWR from "swr";
import { setSelectedStaff } from "@/redux toolkit/cartSlice";

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

  const handleSelectStaff = (staffId: number) => {
    setSelectStaff(staffId);
    dispatch(setSelectedStaff(staffId));
  };

  return (
    <div className="grid grid-cols-2 gap-x-1 gap-y-4 mt-10">
      {data?.map((staff: Staff) => (
        <CustomRadio
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
