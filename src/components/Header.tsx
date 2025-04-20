import {  Flex, Text, Image, Button } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";

export const Header = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <Flex
      as="header"
      width="100%"
      py={4}
      px={8}
      alignItems="center"
      justifyContent="space-between"
      borderBottom="1px solid"
      borderColor="gray.200"
      bg="white"
    >
      <Image
        src="/Logo_PUENTE_ARG_Negro_Reducido.svg"
        alt="Puente Logo"
        height="40px"
      />
      <Flex alignItems="center" gap={2}>
        <Text fontSize="md" color="gray.600">
          {isLoginPage ? "Don't have an account yet?" : "Already have an account?"}
        </Text>
        <Button
          as={Link}
          to={isLoginPage ? "/signup" : "/login"}
          variant="outline"
          size="md"
          borderColor="gray.300"
          color="gray.700"
          bg="white"
          _hover={{
            bg: "gray.50",
          }}
        >
          {isLoginPage ? "Sign Up" : "Sign In"}
        </Button>
      </Flex>
    </Flex>
  );
}; 