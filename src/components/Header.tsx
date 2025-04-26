import { Flex, Text, Image, Button, HStack } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const Header = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
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
      <Flex alignItems="center">
        <Image
          src="/Logo_PUENTE_ARG_Negro_Reducido.svg"
          alt="Puente Logo"
          height="40px"
          mr={6}
        />
        
        {isAuthenticated && (
          <HStack spacing={4}>
            <Button
              as={Link}
              to="/"
              variant="ghost"
              colorScheme="blue"
              size="md"
            >
              Trading Platform
            </Button>
          </HStack>
        )}
      </Flex>

      <Flex alignItems="center" gap={2}>
        {!isAuthenticated ? (
          <>
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
          </>
        ) : (
          <Button
            variant="outline"
            size="md"
            borderColor="gray.300"
            color="gray.700"
            bg="white"
            _hover={{
              bg: "gray.50",
            }}
            onClick={() => {
              // Implementar cierre de sesión
              window.location.href = "/login";
            }}
          >
            Cerrar Sesión
          </Button>
        )}
      </Flex>
    </Flex>
  );
}; 