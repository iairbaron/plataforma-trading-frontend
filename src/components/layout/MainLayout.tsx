import { Outlet } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { Header } from "../Header";

export const MainLayout = () => {
  return (
    <>
      <Header />
      <Box p={4}>
        <Outlet />
      </Box>
    </>
  );
};
