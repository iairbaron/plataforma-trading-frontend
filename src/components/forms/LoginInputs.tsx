import {
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
  } from "@chakra-ui/react";
  import { useFormContext } from "react-hook-form";
  import { LoginFormData } from "../../schemas/loginSchema";
  import { PasswordField } from "./PasswordField";
  
  export const LoginInputs = () => {
    const {
      register,
      formState: { errors },
    } = useFormContext<LoginFormData>();
  
    return (
      <>
        <FormControl isInvalid={!!errors.email} isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            {...register("email")}
            type="email"
            placeholder="you@company.com"
            height="56px"
          />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>
  
        <PasswordField
          label="Password"
          register={register("password")}
          error={errors.password}
        />
      </>
    );
  };
  