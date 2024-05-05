import React, { useEffect, useState } from "react";
import Cart from "@/components/Cart";
import { clearCart } from "@/redux toolkit/cartSlice";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import AlertDeleteDialog from "@/components/AlertDeleteDialog";
import AlertSuccessful from "@/components/AlertSuccessful";

const ConfirmationPage: React.FC = () => {
  const bookingInfo = useSelector((state: any) => state.cart);
  const router = useRouter();
  const dispatch = useDispatch();

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

  return (
    <div className="w-[90%] mx-auto mt-9">
      <div>
        <h1 className="text-2xl font-semibold mb-5">Booking confirmation</h1>
        <Cart />
        <h2 className="text-xl font-semibold mb-3 mt-3">
          Date: {bookingInfo.selectedDate}
        </h2>
        <h2 className="text-xl font-semibold mb-3">
          Staff:{" "}
          {bookingInfo
            ? bookingInfo?.selectedStaff.firstName +
              " " +
              bookingInfo?.selectedStaff.lastName
            : "N/A"}
        </h2>
        <div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-y-5">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="border-2 rounded-md outline-none px-2 "
            />
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              className="border-2 rounded-md outline-none px-2 "
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="border-2 rounded-md outline-none px-2 "
            />
            <div className="flex justify-between items-center mx-10 mt-10">
              <AlertDeleteDialog />
              <AlertSuccessful formValid={formValid}/>
              {/* <button
                type="submit"
                disabled={!formValid}
                className={`text-blue-900 border-2 border-blue-900 rounded-lg font-bold w-[100px] h-[35px] shadow-green7 inline-flex items-center justify-center px-[15px] leading-none focus:shadow-[0_0_0_2px] `}
              >
                Confirm
              </button> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
