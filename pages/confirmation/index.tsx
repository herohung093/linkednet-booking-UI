import React, { useEffect, useState } from "react";
import Cart from "@/components/Cart";
import { clearCart, setSelectedStaff } from "@/redux toolkit/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import AlertDeleteDialog from "@/components/AlertDeleteDialog";
import AlertSuccessful from "@/components/AlertSuccessful";
import useSWR from "swr";
import Error from "@/components/Error";
import Loading from "@/components/Loading";

type FetcherFunction = (...args: Parameters<typeof fetch>) => Promise<any>;

const fetcher: FetcherFunction = (...args) =>
  fetch(...args).then((res) => res.json());

const ConfirmationPage: React.FC = () => {
  const dispatch = useDispatch();
  const {
    data: StaffList,
    error,
    isLoading,
  } = useSWR(
    "https://big-umbrella-c5c3450b8837.herokuapp.com/staff/?isOnlyActive=true",
    fetcher
  );
  const bookingInfo = useSelector((state: any) => state.cart);
  const staffId = bookingInfo.selectedStaff;

  let staff: Staff;
  if (staffId === -1) {
    const randomIndex = Math.floor(Math.random() * StaffList.length);
    staff = StaffList[randomIndex];
  } else {
    staff = StaffList?.find((staff: Staff) => staff.id == staffId);
  }

  useEffect(() => {
    if (staff) {
      dispatch(setSelectedStaff(staff.id));
    }
  }, [staff, dispatch]);

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
  });

  const [formValid, setFormValid] = useState(false);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    const isValid =
      formData.name.trim() !== "" &&
      formData.phoneNumber.trim() !== "" &&
      formData.email.trim() !== "";
    setFormValid(isValid);
  }, [formData]);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log(formData);
    console.log(bookingInfo);
    dispatch(clearCart());
  };

  if (error) return <Error />;
  if (isLoading) return <Loading />;

  return (
    <div className="w-[90%] mx-auto mt-9">
      <div>
        <h1 className="text-2xl font-semibold mb-5">Booking confirmation</h1>
        <Cart />
        <h2 className="text-xl font-semibold mb-3 mt-3">
          Date: {bookingInfo.selectedDate} at {bookingInfo.selectedHour}
        </h2>
        <h2 className="text-xl font-semibold mb-3">
          Staff: {staff && staff?.firstName + " " + staff?.lastName}
        </h2>
        <div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-y-5">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="border-2 rounded-md outline-none px-4 py-2 "
            />
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              className="border-2 rounded-md outline-none px-4 py-2 "
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="border-2 rounded-md outline-none px-4 py-2 "
            />
            <div className="flex justify-between items-center mx-10 mt-10">
              <AlertDeleteDialog />
              <AlertSuccessful formValid={formValid} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
