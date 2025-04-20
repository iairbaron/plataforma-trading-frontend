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

export const LoginForm = () => {
  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const toast = useToast();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data: LoginFormData) => authService.login(data),
    onSuccess: (response) => {
      if (response.data) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        toast({
          title: "Login successful",
          description: "Welcome back!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        navigate("/", { replace: true });      }
    },
    onError: (error: any) => {
      const errorData = error.response?.data;
      const description =
        errorData?.message ||
        errorData?.errors?.[0]?.message ||
        "Invalid credentials";

      toast({
        title: "Authentication error",
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
              Sign in
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
              Sign In
            </Button>
          </VStack>
        </FormProvider>
      </Container>
    </Box>
  );
};
