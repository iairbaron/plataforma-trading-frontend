import React from "react";
import {
  Stack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
} from "@chakra-ui/react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { OrderFormValues } from "../../hooks/useOrderForm";

interface OrderFormProps {
  control: Control<OrderFormValues>;
  errors: FieldErrors<OrderFormValues>;
  symbol: string;
  handleAmountChange: (valueString: string) => void;
  handleTotalChange: (valueString: string) => void;
  maxAmount?: number;
}

const OrderForm: React.FC<OrderFormProps> = ({
  control,
  errors,
  symbol,
  handleAmountChange,
  handleTotalChange,
  maxAmount,
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
            <Input
              type="number"
              step="any"
              min={0}
              placeholder="Monto en USD"
              value={field.value}
              onChange={(e) => handleTotalChange(e.target.value)}
            />
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
            <Input
              type="number"
              step="any"
              min={0}
              max={maxAmount}
              placeholder="Cantidad a operar"
              value={field.value}
              onChange={(e) => handleAmountChange(e.target.value)}
            />
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
