import React from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Home from "./Home";
import { ChevronLeft } from "lucide-react";
import { AppBar, Toolbar, Box, LinearProgress, Typography } from "@mui/material";
import { styled } from "@mui/system";

const NavBar: React.FC = () => {
  const router = useRouter();
  const slug = router.route;
  const storeInfo = useSelector((state: any) => state.storeInfo.storeInfo);
  const bookingInfo = useSelector((state: any) => state.cart);

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

  const getStepTitle = (slug: string): string => {
    switch (slug) {
      case "/":
        return "Select Services";
      case "/add-guests":
        return "Add Guests";
      case "/staff":
        return "Choose Staff";
      case "/time":
        return "Select Time";
      case "/confirmation":
        return "Confirmation";
      default:
        return "";
    }
  };

  const BlackLinearProgress = styled(LinearProgress)({
    backgroundColor: "#f3f4f6",
    height: "4px",
    "& .MuiLinearProgress-bar": {
      backgroundColor: "black",
    },
  });

  return (
    <>
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          backgroundColor: "white",
          borderBottom: "1px solid",
          borderColor: "grey.100"
        }}
      >
        <Toolbar sx={{ minHeight: { xs: '56px', sm: '64px' } }}>
          <Box 
            sx={{ 
              width: '100%',
              maxWidth: 'lg',
              mx: 'auto',
              px: { xs: 2, sm: 3 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            {/* Left section with back button and title */}
            <Box display="flex" alignItems="center" gap={2}>
              {slug !== "/" && (
                <button
                  onClick={goBack}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <div>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  {storeInfo?.storeName || "Booking"}
                </Typography>
                <Typography 
                  variant="subtitle1" 
                  color="text.primary"
                  fontWeight="medium"
                >
                  {getStepTitle(slug)}
                </Typography>
              </div>
            </Box>

            {/* Right section with home button */}
            <Box>
              <Home />
            </Box>
          </Box>
        </Toolbar>

        {/* Progress bar */}
        <BlackLinearProgress 
          variant="determinate" 
          value={getProgressValue(slug)} 
        />
      </AppBar>

      {/* Spacer to prevent content from going under the navbar */}
      <Box sx={{ height: { xs: '56px', sm: '64px' } }} />
    </>
  );
};

export default NavBar;