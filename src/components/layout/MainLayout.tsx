import { Outlet } from "react-router-dom";
import { Box } from "@chakra-ui/react";

export const MainLayout = () => {
  return (
    <>
      <Box p={4}>
        <Outlet />
      </Box>
    </>
  );
};
