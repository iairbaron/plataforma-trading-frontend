import {
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    IconButton,
    FormErrorMessage,
  } from "@chakra-ui/react";
  import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
  import { useState } from "react";
  import { FieldError, UseFormRegisterReturn } from "react-hook-form";
  
  interface PasswordFieldProps {
    label: string;
    register: UseFormRegisterReturn;
    error?: FieldError;
  }
  
  export const PasswordField = ({ label, register, error }: PasswordFieldProps) => {
    const [show, setShow] = useState(false);
    return (
      <FormControl isInvalid={!!error} isRequired>
        <FormLabel>{label}</FormLabel>
        <InputGroup size="lg">
          <Input
            {...register}
            type={show ? "text" : "password"}
            placeholder={label}
            height="56px"
          />
          <InputRightElement height="56px">
            <IconButton
              variant="ghost"
              onClick={() => setShow((s) => !s)}
              icon={show ? <ViewOffIcon /> : <ViewIcon />}
              aria-label={show ? "Hide" : "Show"}
              size="sm"
            />
          </InputRightElement>
        </InputGroup>
        <FormErrorMessage>{error?.message}</FormErrorMessage>
      </FormControl>
    );
  };
  