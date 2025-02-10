import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Users, User, MoreVertical, Plus, Trash2, Settings } from "lucide-react";
import {
  addGuest,
  getGuests,
  removeGuest,
  setCurrentGuestName,
} from "@/redux toolkit/cartSlice";
import { RootState } from "@/redux toolkit/store";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const AddGuestPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const guests = useSelector(getGuests);
  const storeConfig = useSelector((state: RootState) => state.storeInfo);
  const currentGuestName = useSelector(
    (state: RootState) => state.cart.currentGuestName
  );
  const maxGuests = storeConfig?.storeInfo?.maxGuestsForGroupBooking || 0;

  const handleAddGuest = () => {
    const newGuest = {
      id: null,
      name: `Guest ${guests.length + 1}`,
      guestServices: [],
      totalPrice: 0,
      totalEstimatedTime: 0,
    };
    dispatch(addGuest(newGuest));
    dispatch(setCurrentGuestName(newGuest.name));
    router.push("/?storeUuid=" + storeConfig.storeUuid);
  };

  const handleRemoveGuest = (guestName: string) => {
    dispatch(removeGuest(guestName));
    if (currentGuestName === guestName) {
      const nextGuest = guests.find(
        (guest) => guest.name !== guestName && guest.name !== "Me"
      );
      if (nextGuest) {
        dispatch(setCurrentGuestName(nextGuest.name));
      } else {
        dispatch(setCurrentGuestName("Me"));
      }
    }
  };

  const handleEditGuest = (guestName: string) => {
    dispatch(setCurrentGuestName(guestName));
    router.push("/?storeUuid=" + storeConfig.storeUuid);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Add Guests and Services
        </h1>
        <p className="text-gray-500">
          Book a group appointment for up to {maxGuests} guests
        </p>
      </div>

      {/* Guests List */}
      <div className="space-y-4 mb-8">
        {guests.map((guest) => (
          <div
            key={guest.name}
            className="bg-white rounded-xl border border-gray-200 p-4 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              {/* Guest Info */}
              <div className="flex items-center gap-4">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center shrink-0
                  ${guest.name === "Me" ? 'bg-blue-100' : 'bg-gray-100'}
                `}>
                  {guest.name === "Me" ? (
                    <User className="w-6 h-6 text-blue-600" />
                  ) : (
                    <Users className="w-6 h-6 text-gray-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{guest.name}</h3>
                  <p className="text-sm text-gray-500">
                    {guest.guestServices?.length || 0} service
                    {(guest.guestServices?.length || 0) !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Actions Dropdown */}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button 
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="More options"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                  </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="min-w-[180px] bg-white rounded-lg shadow-lg p-2 z-50"
                    sideOffset={5}
                  >
                    <DropdownMenu.Item
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 
                        hover:bg-gray-100 rounded-md cursor-pointer outline-none"
                      onSelect={() => handleEditGuest(guest.name)}
                    >
                      <Settings className="w-4 h-4" />
                      Edit Services
                    </DropdownMenu.Item>

                    {guest.name !== "Me" && (
                      <DropdownMenu.Item
                        className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 
                          hover:bg-red-50 rounded-md cursor-pointer outline-none"
                        onSelect={() => handleRemoveGuest(guest.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove Guest
                      </DropdownMenu.Item>
                    )}
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>
          </div>
        ))}
      </div>

      {/* Add Guest Button */}
      {guests.length < maxGuests && (
        <button
          onClick={handleAddGuest}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 
            border-2 border-dashed border-gray-300 rounded-xl text-gray-600
            hover:border-gray-400 hover:text-gray-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add Guest</span>
        </button>
      )}
    </div>
  );
};

export default AddGuestPage;