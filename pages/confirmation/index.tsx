import React, { useEffect, useState } from "react";
import Cart from "@/components/Cart";
import { clearCart, setSelectedStaff } from "@/redux toolkit/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import AlertDeleteDialog from "@/components/AlertDeleteDialog";
import useSWR from "swr";
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

  const [formValid, setFormValid] = useState<boolean>(false);
  const [contactMethod, setContactMethod] = useState<"phoneNumber" | "email">(
    "phoneNumber"
  );

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "phoneNumber" && !/^\d*$/.test(value)) {
      return;
    }

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  useEffect(() => {
    const isValid =
      formData.name.trim() !== "" &&
      (contactMethod === "phoneNumber"
        ? formData.phoneNumber.trim() !== ""
        : formData.email.trim() !== "");
    setFormValid(isValid);
  }, [formData, contactMethod]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // console.log(bookingInfo);

    const serviceItems = bookingInfo?.items?.map((service: any) => ({
      id: service.id,
    }));

    const payload = {
      customer: {
        // name: formData.name,
        phone: formData.phoneNumber,
      },
      note: `{I want ${staff.firstName} ${staff.lastName}}`,
      bookingTime: `${bookingInfo.selectedDate} ${bookingInfo.selectedHour}`,
      staff: {
        id: staff.id,
      },
      status: "PENDING",
      serviceItems: serviceItems,
      // timeZone: bookingInfo.timeZone,
    };
    console.log(payload);

    try {
      const response = await fetch(
        "https://big-umbrella-c5c3450b8837.herokuapp.com/reservation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
console.log(response);

      if (!response.ok) {
        throw new Error("Failed to submit booking.");
      }
      dispatch(clearCart());
    } catch (error) {
      console.error("Error submitting booking:", error);
    }
  };

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
            <div className="flex justify-evenly">
              <button
                type="button"
                onClick={() => setContactMethod("phoneNumber")}
                className={`${
                  contactMethod === "phoneNumber"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700"
                } rounded-md px-4 py-2 w-[140px]`}
              >
                Phone Number
              </button>
              <button
                type="button"
                onClick={() => setContactMethod("email")}
                className={`${
                  contactMethod === "email"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700"
                } rounded-md px-4 py-2 w-[140px]`}
              >
                Email
              </button>
            </div>
            <input
              type={contactMethod === "phoneNumber" ? "tel" : "email"}
              name={contactMethod}
              value={formData[contactMethod]}
              onChange={handleChange}
              placeholder={
                contactMethod === "phoneNumber" ? "Phone Number" : "Email"
              }
              className="border-2 rounded-md outline-none px-4 py-2"
            />

            <div className="flex justify-between items-center mx-10 mt-10">
              <AlertDeleteDialog />
              <button
                type="submit"
                disabled={!formValid}
                className={`text-blue-900 border-2 border-blue-900 rounded-lg font-bold w-[100px] h-[45px] shadow-green7 inline-flex items-center justify-center px-[20px] leading-none focus:shadow-[0_0_0_2px] text-xl cursor-pointer  hover:text-pink-700 hover:border-pink-700`}
              >
                Confirm
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ConfirmationPage;
