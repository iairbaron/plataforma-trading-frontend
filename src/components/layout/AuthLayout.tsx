import { Outlet } from "react-router-dom";
import { Box, Container, Flex } from "@chakra-ui/react";
import { Header } from "../Header";

export const AuthLayout = () => {
  return (
    <Flex direction="column" minH="100vh" bg="gray.50">
      <Header />
      <Box flex="1" display="flex" alignItems="center" justifyContent="center">
        <Container maxW="container.sm">
          <Outlet />
        </Container>
      </Box>
    </Flex>
  );
};
