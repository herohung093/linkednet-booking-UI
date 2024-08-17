import React, { useCallback, useEffect, useState } from "react";
import Cart from "@/components/Cart";
import { useSelector } from "react-redux";
import { IMaskInput } from 'react-imask';
import { useRouter } from "next/router";
import AlertSuccessful from "@/components/AlertSuccessful";
import axios from "@/ulti/axios";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const ConfirmationPage: React.FC = () => {
  const [ok, setOk] = useState<boolean | null>(null);
  const bookingInfo = useSelector((state: any) => state.cart);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { executeRecaptcha } = useGoogleReCaptcha();
  const router = useRouter();
  const urlStoreUuid = router.query;
  const staff = useSelector((state: any) => state.staff.selectedStaffByHour);
  const [captchaToken, setCaptchaToken] = useState('');

  useEffect(() => {
    if (bookingInfo?.items.length === 0 && urlStoreUuid.storeUuid) {
      router.push("/?storeUuid=" + urlStoreUuid.storeUuid);
    }
  }, [bookingInfo, router]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    note: "",
  });
  const noteInputMaxLength = 100;
  const [noteInputRemainingChars, setNoteInputRemainingChars] = useState(noteInputMaxLength);

  const [formValid, setFormValid] = useState<boolean>(false);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "note") {
      if (value.length > noteInputMaxLength) {
        return;
      }
      setNoteInputRemainingChars(noteInputMaxLength - value.length);
    }

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  // Create an event handler so you can call the verification on button click event or form submit
  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available');
      return;
    }

    const captchaTokenResponse = await executeRecaptcha('booking');
    setCaptchaToken(captchaTokenResponse);
  }, [executeRecaptcha]);

  useEffect(() => {
    const isValid =
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      !formData.phone.trim().includes('#');
    setFormValid(isValid);

    handleReCaptchaVerify();
  }, [formData, handleReCaptchaVerify]);

  const [res, setRes] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    handleReCaptchaVerify();

    const serviceItems = bookingInfo?.items?.map(
      (service: NailSalonService) => ({
        id: service.id,
      })
    );

    const payload = {
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone.replace(/\s+/g, ''),
      },
      note: formData.note,
      bookingTime: `${bookingInfo.selectedDate} ${bookingInfo.selectedHour}`,
      staff: {
        id: staff.id,
      },
      serviceItems: serviceItems,
    };

    try {
      const response = await axios.post(
        "/reservation/",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            'X-StoreID': urlStoreUuid.storeUuid,
            "Captcha-Token": captchaToken,
          },
        }
      );
      setOk(response.status === 201);
      setIsLoading(false)
      setRes(response.data);

      if (response.status !== 201) {
        throw new Error("Failed to submit booking.");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      setIsLoading(false)

    }
  };

  const FormFieldSkeleton = () => (
    <div className="w-full h-10 bg-gray-200 rounded-md"></div>
  );

  const ConfirmationMessageSkeleton = () => (
    <div className="w-full h-10 bg-gray-200 rounded-md"></div>
  );

  if (!bookingInfo) {
    return (
      <div className="w-[90%] sm:w-[65%] mx-auto mt-9">
        <div>
          <h1 className="text-2xl font-semibold mb-5">Booking confirmation</h1>
          <div className="w-full h-40 bg-gray-200 rounded-md"></div>
          <div className="w-full h-10 bg-gray-200 rounded-md mb-3 mt-3"></div>
          <div className="w-full h-10 bg-gray-200 rounded-md mb-3"></div>
          <div className="max-w-[500px] mx-auto mt-10">
            <form className="flex flex-col gap-y-5 justify-center">
              {[1, 2, 3, 4, 5].map((_, index) => (
                <FormFieldSkeleton key={index} />
              ))}
              <ConfirmationMessageSkeleton />
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[90%] sm:w-[65%] mx-auto mt-9">
      <div>
        <h1 className="text-2xl font-semibold mb-5">Booking confirmation</h1>
        <div className=" bg-zinc-100 bg-bg-opacity-50 p-2 ">
          <Cart />
          <h2 className="text-xl font-semibold mb-3 mt-3 text-sky-800 font-sans">
            Date: <span className="text-rose-500 text-lg font-bold tracking-wide">{bookingInfo.selectedDate}</span> at <span className="text-rose-500 text-lg font-bold tracking-wide">{bookingInfo.selectedHour}</span>
          </h2>
          <h2 className="text-xl font-semibold mb-3 text-sky-800 font-sans">
            Staff: {staff ? staff?.firstName + " " + staff?.lastName : "N/A"}
          </h2>
        </div>
        <div className="max-w-[500px] mx-auto mt-10">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-y-5 justify-center  "
          >
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="border-2 rounded-md outline-none px-4 py-2 "
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="border-2 rounded-md outline-none px-4 py-2 "
            />
            <IMaskInput
              mask='+61 400 000 000'
              placeholderChar='#'
              type="tel"
              name="phone"
              value={formData.phone}
              onAccept={(value) => handleChange({ target: { name: 'phone', value } })}
              placeholder="Phone Number"
              lazy={false}
              className="border-2 rounded-md outline-none px-4 py-2"
            />
            <div>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                placeholder="Note for shop"
                maxLength={noteInputMaxLength}
                className="border-2 rounded-md outline-none px-4 py-2 h-16 resize-none w-full"
              />
              <div className="text-gray-400 text-sm mt-1">
                {noteInputRemainingChars} characters remaining
              </div>
            </div>

            <div className="flex justify-center items-center mx-10 mt-10">
              {/* <AlertDeleteDialog /> */}
              <AlertSuccessful
                formValid={formValid}
                bookingInfo={bookingInfo}
                ok={ok}
                id={res?.id}
                status={res?.status}
                isLoading={isLoading}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ConfirmationPage;
