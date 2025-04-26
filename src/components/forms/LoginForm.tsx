import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Container,
  VStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { loginSchema, LoginFormData } from "../../schemas/loginSchema";
import { LoginInputs } from "./LoginInputs";
import { authService } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";
import { useUser } from "../../hooks/useUser";

export const LoginForm = () => {
  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const toast = useToast();
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const { updateUser } = useUser();

  const mutation = useMutation({
    mutationFn: (data: LoginFormData) => authService.login(data),
    onSuccess: (response) => {
      if (response.data) {
        setToken(response.data.token);
        updateUser(response.data.user);

        toast({
          title: "Login exitoso",
          description: "¡Bienvenido de nuevo!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        navigate("/home", { replace: true });
      }
    },
    onError: (error: any) => {
      const errorData = error.response?.data;
      const description =
        errorData?.message ||
        errorData?.errors?.[0]?.message ||
        "Credenciales inválidas";

      toast({
        title: "Error de autenticación",
        description,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  return (
    <Box minH="100vh" bg="white">
      <Container maxW="container.sm" py={8}>
        <FormProvider {...methods}>
          <VStack
            as="form"
            onSubmit={methods.handleSubmit((data) => mutation.mutate(data))}
            spacing={6}
            align="stretch"
          >
            <Text fontSize="3xl" fontWeight="bold" textAlign="center">
              Iniciar sesión
            </Text>
            <LoginInputs />
            <Button
              type="submit"
              colorScheme="red"
              size="lg"
              height="56px"
              width="full"
              isLoading={mutation.isPending}
            >
              Entrar
            </Button>
          </VStack>
        </FormProvider>
      </Container>
    </Box>
  );
};
