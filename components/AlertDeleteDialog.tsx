import React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "@/redux toolkit/cartSlice";
import { RootState } from "@/redux toolkit/store";

const AlertDeleteDialog = () => {
  const router = useRouter();
  const storeUuid = useSelector((state: RootState) => state.storeInfo.storeUuid);
  const dispatch = useDispatch();
  const handleDelete = () => {
    dispatch(clearCart());
    router.push("/?storeUuid=" + storeUuid);
  };
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button
          className={`text-blue-900 border-2 border-blue-900 rounded-lg font-bold w-[100px] h-[45px] shadow-green7 inline-flex items-center justify-center px-[20px] leading-none focus:shadow-[0_0_0_2px] text-xl hover:text-pink-700 hover:border-pink-700`}
        >
          Cancel
        </button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="bg-slate-700 bg-opacity-70 data-[state=open]:animate-overlayShow fixed inset-0" />
        <AlertDialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <AlertDialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
            Are you absolutely sure?
          </AlertDialog.Title>
          <AlertDialog.Description className="text-mauve11 mt-4 mb-5 text-[15px] leading-normal">
            Do you want to reset your selection.
          </AlertDialog.Description>
          <div className="flex justify-end gap-[25px]">
            <AlertDialog.Cancel asChild>
              <button className="text-blue-900 border-2 border-blue-900 rounded-lg font-bold w-[100px] inline-flex h-[35px] items-center justify-center px-[15px] leading-none cursor-pointer ">
                Cancel
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                onClick={handleDelete}
                className="text-red-600 bg-red4 hover:bg-red5 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]"
              >
                Yes
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};
export default AlertDeleteDialog;
