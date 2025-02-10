import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Users, User, CheckCircle2 } from "lucide-react";
import axios from "@/ulti/axios";

// Components
import Error from "@/components/Error";

// Redux actions
import { setSelectedStaffList, setAllStaff } from "@/redux toolkit/staffSlice";
import { getSelectedStaffId, setSelectedStaffForFirstGuest } from "@/redux toolkit/cartSlice";

const StaffPage: React.FC = () => {
  // Hooks
  const router = useRouter();
  const dispatch = useDispatch();
  const urlStoreUuid = router.query;

  // State
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const preSelectedStaff = useSelector(getSelectedStaffId);
  const [selectStaff, setSelectStaff] = useState<number | null>(null);

  // Selectors
  const bookingInfo = useSelector((state: any) => state.cart);

  // Effects
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get("/staff/?isOnlyActive=true", {
          headers: {
            'X-StoreID': urlStoreUuid.storeUuid,
          }
        }).then(res => res.data);
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (urlStoreUuid.storeUuid) {
      fetchData();
    }
  }, [urlStoreUuid]);

  useEffect(() => {
    if (bookingInfo?.guests.length === 0 && urlStoreUuid.storeUuid) {
      router.push("/?storeUuid=" + urlStoreUuid.storeUuid);
    }
  }, [bookingInfo, router, urlStoreUuid.storeUuid]);

  // Memoized values
  const anyStaff: Staff = useMemo(
    () => ({
      id: 0,
      firstName: "Any",
      lastName: "Professional",
      nickname: "Any",
      phone: "",
      skillLevel: 1,
      dateOfBirth: "",
      rate: 1,
      workingDays: "1,2,3,4,5,6,7",
      active: true,
    }),
    []
  );

  const newstaffArray = useMemo(() => {
    if (data && data.length !== 0) {
      dispatch(setAllStaff([anyStaff, ...data]))
      if (bookingInfo.isGroupBooking && bookingInfo.guests.length > 1) {
        return [anyStaff];
      }
      return [anyStaff, ...data];
    }
    return [];
  }, [data]);

  useEffect(() => {
    dispatch(setSelectedStaffList(newstaffArray));
    setSelectStaff(preSelectedStaff);
  });

  // Handlers
  const handleSelectStaff = (staff: Staff) => {
    setSelectStaff(staff.id);
    dispatch(setSelectedStaffForFirstGuest(staff));
  };

  if (error) return <Error />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Select Professional</h1>
        <p className="text-sm text-gray-500 mt-1">
          Choose your preferred stylist or select &apos;Any Professional&apos; for flexible scheduling
        </p>
      </div>

      {isLoading ? (
        // Loading skeleton
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-100 rounded-xl p-4 h-[120px]">
                <div className="w-10 h-10 bg-gray-200 rounded-full mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Staff grid - Optimized for mobile
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {newstaffArray?.map((staff: Staff) => (
            <button
              key={staff.id}
              onClick={() => handleSelectStaff(staff)}
              className={`
                relative text-left p-4 rounded-xl transition-all duration-200
                ${selectStaff === staff.id
                  ? 'bg-black text-white shadow-lg'
                  : 'bg-white border border-gray-100 hover:border-black'
                }
              `}
            >
              {/* Selected indicator */}
              {selectStaff === staff.id && (
                <div className="absolute top-2 right-2">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              )}

              {/* Staff icon */}
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center mb-2
                ${selectStaff === staff.id 
                  ? 'bg-white' 
                  : 'bg-gray-100'
                }
              `}>
                {staff.id === 0 ? (
                  <Users className={`w-5 h-5 ${selectStaff === staff.id ? 'text-black' : 'text-gray-600'}`} />
                ) : (
                  <User className={`w-5 h-5 ${selectStaff === staff.id ? 'text-black' : 'text-gray-600'}`} />
                )}
              </div>

              {/* Staff info */}
              <div>
                <h3 className={`text-sm font-medium leading-tight mb-0.5
                  ${selectStaff === staff.id ? 'text-white' : 'text-gray-900'}
                `}>
                  {staff.firstName} {staff.lastName}
                </h3>
                <p className={`text-xs
                  ${selectStaff === staff.id ? 'text-gray-200' : 'text-gray-500'}
                `}>
                  {staff.nickname}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffPage;