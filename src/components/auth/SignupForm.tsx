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
import { authService } from "../../services/authService";
import { Header } from "../Header";

// Match backend validation rules
const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot exceed 50 characters"),
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    password: z
      .string()
      .min(5, "Password must be at least 5 characters")
      .regex(/\d/, "Password must contain at least one number")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

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

  const onSubmit = (data: SignupFormData) => {
    mutation.mutate(data);
  };

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

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
            Sign up
          </Text>

          <FormControl isInvalid={!!errors.name} isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              {...register("name")}
              type="text"
              placeholder="Your full name"
              size="lg"
              height="56px"
              fontSize="md"
              bg="white"
              borderColor="gray.300"
            />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>

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

          <FormControl isInvalid={!!errors.confirmPassword} isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup size="lg">
              <Input
                {...register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Strong password"
                height="56px"
                fontSize="md"
                bg="white"
                borderColor="gray.300"
              />
              <InputRightElement height="56px">
                <IconButton
                  variant="ghost"
                  onClick={toggleConfirmPassword}
                  icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  size="sm"
                />
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>
              {errors.confirmPassword?.message}
            </FormErrorMessage>
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
            Sign Up
          </Button>
        </VStack>
      </Container>
    </Box>
  );
};
