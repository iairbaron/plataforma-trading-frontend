import { useForm, FormProvider } from "react-hook-form";
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
import { SignupInputs } from "./SignupInputs";
import { authService } from "../../services/authService";
import { SignupFormData, signupSchema } from "../../schemas/signupSchema";

export const SignupForm = () => {
  const methods = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const navigate = useNavigate();
  const toast = useToast();

  const mutation = useMutation({
    mutationFn: (data: SignupFormData) => {
      const { confirmPassword, ...signupData } = data;
      return authService.signup(signupData);
    },
    onSuccess: (response) => {
      if (response.data) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        toast({
          title: "Registration successful",
          description: "Welcome!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        navigate("/", { replace: true });
      }
    },
    onError: (error: any) => {
      const errorData = error.response?.data;
      if (errorData?.errors) {
        // Handle validation errors
        errorData.errors.forEach((err: any) => {
          toast({
            title: "Validation Error",
            description: err.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
      } else {
        // Handle other errors
        toast({
          title: "Registration Error",
          description:
            errorData?.message || "An error occurred during registration",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    },
  });

  return (
    <Box minH="100vh" bg="white">
      <Container maxW="container.sm" py={8}>
        <FormProvider {...methods}>
          <VStack
            as="form"
            spacing={6}
            onSubmit={methods.handleSubmit((data) => mutation.mutate(data))}
          >
            <Text fontSize="3xl" fontWeight="bold" textAlign="center">
              Sign up
            </Text>
            <SignupInputs />
            <Button
              type="submit"
              colorScheme="red"
              size="lg"
              height="56px"
              width="full"
              isLoading={mutation.isPending}
            >
              Sign Up
            </Button>
          </VStack>
        </FormProvider>
      </Container>
    </Box>
  );
};
