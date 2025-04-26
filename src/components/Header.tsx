import { Flex, Text, Image, Button, HStack } from "@chakra-ui/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, setToken } = useAuth();
  const isLoginPage = location.pathname === "/login";

  const handleLogout = () => {
    // Eliminar el token y limpiar información de usuario
    setToken(null);
    localStorage.removeItem('user');
    
    // Redireccionar al login
    navigate('/login');
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
        
        {isAuthenticated && (
          <HStack spacing={4}>
            <Button
              as={Link}
              to="/home"
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
          <Button
            variant="outline"
            size="md"
            borderColor="gray.300"
            color="gray.700"
            bg="white"
            _hover={{
              bg: "gray.50",
            }}
            onClick={handleLogout}
          >
            Cerrar Sesión
          </Button>
        )}
      </Flex>
    </Flex>
  );
}; 