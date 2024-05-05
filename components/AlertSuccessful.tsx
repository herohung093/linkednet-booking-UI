import React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useRouter } from "next/navigation";

const AlertSuccessful: React.FC<{ formValid: boolean }> = ({ formValid }) => {
  const router = useRouter();
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button
          type="submit"
          disabled={!formValid}
          className={`text-blue-900 border-2 border-blue-900 rounded-lg font-bold w-[100px] h-[35px] shadow-green7 inline-flex items-center justify-center px-[15px] leading-none focus:shadow-[0_0_0_2px] `}
        >
          Confirm
        </button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="bg-slate-700 bg-opacity-70 data-[state=open]:animate-overlayShow fixed inset-0" />
        <AlertDialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <AlertDialog.Title className="text-mauve12 m-0 text-[17px] font-medium flex justify-center items-center">
            Booking Successful!
          </AlertDialog.Title>

          <div className="flex justify-end gap-[25px]">
            <AlertDialog.Action asChild>
              <div
                onClick={() => router.push("/")}
                className="text-blue-900 border-2 mt-3 border-blue-900 rounded-lg font-bold w-[400px] h-[35px] shadow-green7  items-center justify-center px-[15px] leading-none focus:shadow-[0_0_0_2px] flex cursor-pointer"
              >
                Go back to home page
              </div>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default AlertSuccessful;
