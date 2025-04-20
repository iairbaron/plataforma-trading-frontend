import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { PasswordField } from "./PasswordField";
import { SignupFormData } from "../../schemas/signupSchema";

export const SignupInputs = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<SignupFormData>();

  return (
    <>
      <FormControl isInvalid={!!errors.name} isRequired>
        <FormLabel>Name</FormLabel>
        <Input {...register("name")} placeholder="Your name" height="56px" />
        <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.email} isRequired>
        <FormLabel>Email</FormLabel>
        <Input {...register("email")} placeholder="Email" height="56px" />
        <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
      </FormControl>

      <PasswordField
        label="Password"
        register={register("password")}
        error={errors.password}
      />

      <PasswordField
        label="Confirm Password"
        register={register("confirmPassword")}
        error={errors.confirmPassword}
      />
    </>
  );
};
