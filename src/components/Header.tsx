import {
  Flex,
  Text,
  Image,
  Button,
  HStack,
  Avatar,
  Spinner,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useUser } from "../hooks/useUser";
import { FiLogOut } from "react-icons/fi";

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, setToken } = useAuth();
  const { user, isLoading, clearUser } = useUser();
  const isLoginPage = location.pathname === "/login";

  const handleLogout = () => {
    // Eliminar el token y limpiar información de usuario
    setToken(null);
    clearUser();

    navigate("/login");
  };

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
      </Flex>

      <Flex alignItems="center" gap={2}>
        {!isAuthenticated ? (
          <>
            <Text fontSize="md" color="gray.600">
              {isLoginPage ? "¿No tienes una cuenta?" : "¿Ya tienes cuenta?"}
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
              {isLoginPage ? "Registrarse" : "Iniciar Sesión"}
            </Button>
          </>
        ) : (
          <HStack spacing={4}>
            <Flex alignItems="center" gap={2}>
              {isLoading ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <Avatar
                    size="sm"
                    name={user?.name || user?.email || ""}
                    bg="blue.500"
                  />
                  <Text fontWeight="medium">
                    {user?.name || user?.email || ""}
                  </Text>
                </>
              )}
            </Flex>
            <Tooltip label="Cerrar sesión" hasArrow placement="bottom">
              <IconButton
                aria-label="Cerrar sesión"
                icon={<FiLogOut size={22} />}
                colorScheme="red"
                variant="ghost"
                onClick={handleLogout}
                size="lg"
                fontSize="1.4rem"
                fontWeight="bold"
              />
            </Tooltip>
          </HStack>
        )}
      </Flex>
    </Flex>
  );
};
