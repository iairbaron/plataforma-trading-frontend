import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  FormErrorMessage,
  Container,
  IconButton,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { authService } from "../../services/authService";
import { Header } from "../Header";

const loginSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password cannot exceed 50 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

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

        navigate("/dashboard");
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
        toast({
          title: "Authentication error",
          description: errorData?.message || "Invalid credentials",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutation.mutate(data);
  };

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <Box minH="100vh" bg="white">
      <Header />
      <Container maxW="container.sm" py={8}>
        <VStack
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          spacing={6}
          align="stretch"
        >
          <Text fontSize="3xl" fontWeight="bold" textAlign="center">
            Sign in{" "}
          </Text>
          
          <FormControl isInvalid={!!errors.email} isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              {...register("email")}
              type="email"
              placeholder="you@company.com"
              size="lg"
              height="56px"
              fontSize="md"
              bg="white"
              borderColor="gray.300"
            />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.password} isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup size="lg">
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Strong password"
                height="56px"
                fontSize="md"
                bg="white"
                borderColor="gray.300"
              />
              <InputRightElement height="56px">
                <IconButton
                  variant="ghost"
                  onClick={togglePassword}
                  icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  size="sm"
                />
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>

          <Button
            type="submit"
            colorScheme="red"
            size="lg"
            height="56px"
            width="full"
            fontSize="md"
            isLoading={mutation.isPending}
          >
            Sign In
          </Button>
        </VStack>
      </Container>
    </Box>
  );
};
