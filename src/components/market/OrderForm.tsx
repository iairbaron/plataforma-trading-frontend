import React from "react";
import { Controller } from "react-hook-form";
import {
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  Stack,
  FormErrorMessage,
} from "@chakra-ui/react";

interface OrderFormProps {
  control: any;
  errors: any;
  symbol: string;
  handleAmountChange: (value: string) => void;
  handleTotalChange: (value: string) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({
  control,
  errors,
  symbol,
  handleAmountChange,
  handleTotalChange,
}) => {
  return (
    <Stack spacing={4}>
      {/* Campo de valor total */}
      <FormControl isInvalid={!!errors.totalValue}>
        <FormLabel>USD</FormLabel>
        <Controller
          name="totalValue"
          control={control}
          render={({ field }) => (
            <NumberInput
              min={0}
              precision={2}
              step={10}
              value={field.value}
              onChange={handleTotalChange}
            >
              <NumberInputField placeholder="Monto en USD" />
            </NumberInput>
          )}
        />
        <FormErrorMessage>
          {errors.totalValue && errors.totalValue.message}
        </FormErrorMessage>
      </FormControl>
      {/* Campo de cantidad */}
      <FormControl isInvalid={!!errors.amount}>
        <FormLabel>Cantidad de {symbol.toUpperCase()}</FormLabel>
        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <NumberInput
              min={0}
              precision={4}
              step={0.01}
              value={field.value}
              onChange={handleAmountChange}
            >
              <NumberInputField placeholder="Cantidad a operar" />
            </NumberInput>
          )}
        />
        <FormErrorMessage>
          {errors.amount && errors.amount.message}
        </FormErrorMessage>
      </FormControl>

    </Stack>
  );
};

export default OrderForm;
