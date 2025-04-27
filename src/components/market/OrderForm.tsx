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

export const OrderForm= ({
  control,
  errors,
  symbol,
  handleAmountChange,
  handleTotalChange,
  maxAmount,
}: OrderFormProps) => (
    <Stack spacing={4}>
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

