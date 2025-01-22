import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Home from "./Home";
import { Back } from "@/icons/Back";
import { AppBar, Toolbar, Box, LinearProgress } from "@mui/material";
import { styled } from "@mui/system";

const NavBar: React.FC = () => {
  const router = useRouter();
  const slug = router.route;
  const storeInfo = useSelector((state: any) => state.storeInfo.storeInfo);
  const bookingInfo = useSelector((state: any) => state.cart);
  const [store, setStore] = useState<string | null>(null);
  useEffect(() => {
    setStore(storeInfo?.storeName);
  }, [storeInfo]);
  const goBack = () => {
    router.back();
  };

  const getProgressValue = (slug: string | string[] | undefined): number => {
    if (!bookingInfo.isGroupBooking) {
      switch (slug) {
        case "/":
          return 0;
        case "/staff":
          return 33;
        case "/time":
          return 66;
        case "/confirmation":
          return 100;
        default:
          return 0;
      }
    } else {
      switch (slug) {
        case "/":
          return 0;
        case "/add-guests":
          return 25;
        case "/staff":
          return 50;
        case "/time":
          return 75;
        case "/confirmation":
          return 100;
        default:
          return 0;
      }
    }
  };

  const BlackLinearProgress = styled(LinearProgress)({
    backgroundColor: "#d3d3d3",
    height: "8px",
    "& .MuiLinearProgress-bar": {
      backgroundColor: "black",
    },
  });

  return (
    <>
      {/* NavBar */}
      <AppBar
        position="fixed"
        sx={{ minHeight: "auto", backgroundColor: "white" }}
      >
        {slug !== "/" && (
          <div>
            <Toolbar
              sx={{
                display: "flex",
                justifyContent: "space-between",
                px: { lg: 6 },
              }}
            >
              <div
                onClick={goBack}
                className="text-primary-700  text-lg cursor-pointer"
              >
                <Back />
              </div>
              <div>
                <Home />
              </div>
            </Toolbar>
          </div>
        )}
        <Box>
          <BlackLinearProgress
            variant="determinate"
            value={getProgressValue(slug)}
          />
        </Box>
      </AppBar>
      <Box sx={{ height: "64px" }} />
    </>
  );
};

export default NavBar;
