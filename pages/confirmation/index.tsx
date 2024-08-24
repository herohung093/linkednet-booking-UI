import React, { useCallback, useEffect, useState } from "react";
import Cart from "@/components/Cart";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import AlertSuccessful from "@/components/AlertSuccessful";
import axios from "@/ulti/axios";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { TextField } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';

interface BookingSubmitForm {
  firstName: string;
  lastName: string;
  phone: string;
  note: string;
}

const ConfirmationPage: React.FC = () => {
  const [ok, setOk] = useState<boolean>(false);
  const bookingInfo = useSelector((state: any) => state.cart);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { executeRecaptcha } = useGoogleReCaptcha();
  const router = useRouter();
  const urlStoreUuid = router.query;
  const staff = useSelector((state: any) => state.staff.selectedStaffByHour);
  const [captchaToken, setCaptchaToken] = useState('');
  const { control, register, formState: { errors }, handleSubmit } = useForm<BookingSubmitForm>()

  useEffect(() => {
    if (bookingInfo?.items.length === 0 && urlStoreUuid.storeUuid) {
      router.push("/?storeUuid=" + urlStoreUuid.storeUuid);
    }
  }, [bookingInfo, router]);

  // Create an event handler so you can call the verification on button click event or form submit
  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available');
      return;
    }

    const captchaTokenResponse = await executeRecaptcha('booking');
    setCaptchaToken(captchaTokenResponse);
  }, [executeRecaptcha]);

  const [res, setRes] = useState<any>(null);

  const onSubmit = async (formData: BookingSubmitForm) => {
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
        phone: formData.phone.replace(/^0/, '+61'),
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
            <form className="flex flex-col justify-center">
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
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-center  "
          >
            <Controller
              name="firstName"
              control={control}
              rules={{ required: "First name is required", maxLength: { value: 20, message: "First name cannot exceed 20 characters" } }}
              render={({ field }) => (
                <div className="mb-4">
                  <TextField
                    {...field}
                    required
                    id="firstName"
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    error={!!errors.firstName}
                    helperText={errors.firstName ? errors.firstName.message : ''}
                    inputProps={{ maxLength: 20 }}
                  />
                </div>
              )}
            />
            <Controller
              name="lastName"
              control={control}
              rules={{ required: "Last name is required", maxLength: { value: 20, message: "Last name cannot exceed 20 characters" } }}
              render={({ field }) => (
                <div className="mb-4">
                  <TextField
                    {...field}
                    id="lastName"
                    required
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    error={!!errors.lastName}
                    helperText={errors.lastName ? errors.lastName.message : ''}
                    inputProps={{ maxLength: 20 }}
                  />
                </div>
              )}
            />
            <Controller
              name="phone"
              control={control}
              rules={{
                required: "Phone number is required",
                maxLength: { value: 10, message: "Phone number cannot exceed 10 digits" },
                minLength: { value: 10, message: "Phone number must be at least 10 digits" },
                pattern: { value: /^04[0-9]*$/, message: "Phone number must start with 04" }
              }}
              render={({ field }) => (
                <div className="mb-4">
                  <TextField
                    {...field}
                    id="phone"
                    type="tel"
                    required
                    label="Mobile Number"
                    inputMode="numeric"
                    placeholder="04xxxxxxxx"
                    variant="outlined"
                    fullWidth
                    error={!!errors.phone}
                    helperText={errors.phone ? errors.phone.message : ''}
                    inputProps={{ maxLength: 10 }}
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.value = target.value.replace(/\D/g, '');
                      field.onChange(target.value);
                    }}
                  />
                </div>
              )}
            />
            <Controller
              name="note"
              control={control}
              rules={{
                maxLength: { value: 100, message: "Note cannot exceed 100 characters" }
              }}
              render={({ field }) => (
                <div className="mb-4">
                  <TextField
                    {...field}
                    id="note"
                    placeholder="Note for shop"
                    label="Note"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    error={!!errors.note}
                    helperText={errors.note ? errors.note.message : ''}
                    inputProps={{ maxLength: 100 }}
                  />
                </div>
              )}
            />
            <LoadingButton
              type="submit"
              variant="outlined"
              className="mt-4 px-4 py-2 w-full md:w-auto"
              loading={isLoading}
            >
              Create booking
            </LoadingButton>
            <div className="flex justify-center items-center mx-10 mt-10">
              <AlertSuccessful
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
