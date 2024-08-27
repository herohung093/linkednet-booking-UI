import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Home from "./Home";
import { Back } from "@/icons/Back";
import { AppBar, Toolbar, Box, LinearProgress } from '@mui/material';
import { styled } from '@mui/system';


const NavBar: React.FC = () => {
  const router = useRouter();
  const slug = router.route;
  console.log(slug);
  const dispatch = useDispatch();
  const storeInfo = useSelector((state: any) => state.storeInfo.storeInfo);
  const [store, setStore] = useState<string | null>(null);
  useEffect(() => {
    setStore(storeInfo?.storeName);
  }, [storeInfo]);
  const goBack = () => {
    router.back();
  };

  const getProgressValue = (slug: string | string[] | undefined): number => {
    switch (slug) {
      case '/':
        return 0;
      case '/staffs':
        return 25;
      case '/time':
        return 50;
      case '/confirmation':
        return 75;
      default:
        return 0;
    }
  };

  const BlackLinearProgress = styled(LinearProgress)({
    backgroundColor: '#d3d3d3',
    height: '8px',
    '& .MuiLinearProgress-bar': {
      backgroundColor: 'black',
    },
  });

  return (
    <>
      {/* NavBar */}
      <AppBar position="fixed" sx={{ height: '64px', backgroundColor: 'white' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: { lg: 6 } }}>
          {slug !== "/" && (
            <div onClick={goBack} className="text-primary-700  text-lg cursor-pointer">
              <Back />
            </div>
          )}
          <div>
            <Home />
          </div>
        </Toolbar>
        <Box>
          <BlackLinearProgress variant="determinate" value={getProgressValue(slug)} />
        </Box>
      </AppBar>
      <Box sx={{ height: '64px' }} />
    </>
  );
};

export default NavBar;
