import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  VStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { SignupInputs } from "./SignupInputs";
import { authService } from "../../services/authService";
import { SignupFormData, signupSchema } from "../../schemas/signupSchema";
import { useAuth } from "../../hooks/useAuth";
import { useUser } from "../../hooks/useUser";

export const SignupForm = () => {
  const methods = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const navigate = useNavigate();
  const toast = useToast();
  const { setToken } = useAuth();
  const { updateUser } = useUser();

  const mutation = useMutation({
    mutationFn: (data: SignupFormData) => {
      const { confirmPassword, ...signupData } = data;
      return authService.signup(signupData);
    },
    onSuccess: (response) => {
      if (response.data) {
        // Actualizar el estado global de autenticación
        setToken(response.data.token);
        updateUser(response.data.user);

        toast({
          title: "Registro exitoso",
          description: "¡Bienvenido!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        navigate("/home", { replace: true });
      }
    },
    onError: (error: any) => {
      const errorData = error.response?.data;
      if (errorData?.errors) {
        // Manejar errores de validación
        errorData.errors.forEach((err: any) => {
          toast({
            title: "Error de validación",
            description: err.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
      } else {
        // Manejar otros errores
        toast({
          title: "Error de registro",
          description:
            errorData?.message || "Ocurrió un error durante el registro",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    },
  });

  return (
    <FormProvider {...methods}>
      <VStack
        as="form"
        spacing={6}
        onSubmit={methods.handleSubmit((data) => mutation.mutate(data))}
        w="100%"
        p={8}
        borderRadius="lg"
        boxShadow="md"
        bg="white"
      >
        <Text fontSize="3xl" fontWeight="bold" textAlign="center">
          Registrarse
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
          Crear cuenta
        </Button>
      </VStack>
    </FormProvider>
  );
};
