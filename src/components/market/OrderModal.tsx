import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { API_ROUTES } from "../../config/api";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  Flex,
  Text,
  useToast,
  Divider,
  Stack,
  FormErrorMessage,
} from "@chakra-ui/react";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  symbol: string;
}

interface OrderData {
  symbol: string;
  amount: number;
  type: string;
  priceAtExecution: number;
  total: number;
}

// Definir el esquema de validación con Zod
const orderFormSchema = z.object({
  amount: z.number()
    .positive("La cantidad debe ser mayor a 0")
    .min(0.000001, "La cantidad mínima es 0.000001"),
  totalValue: z.number()
    .positive("El valor debe ser mayor a 0")
    .min(0.01, "El valor mínimo es 0.01 USD")
});

// Tipo inferido del esquema Zod
type FormValues = z.infer<typeof orderFormSchema>;

const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  type,
  symbol,
}) => {
  const toast = useToast();
  
  // Valores simulados
  const currentPrice = type === "buy" ? 1807.18 : 1805.0; // Precio simulado para ETH

  const { 
    control, 
    handleSubmit: hookFormSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    defaultValues: {
      amount: 0,
      totalValue: 0
    },
    resolver: zodResolver(orderFormSchema),
    mode: "onSubmit" 
  });


  const watchTotalValue = watch("totalValue");

  const handleAmountChange = (valueString: string) => {
    const newAmount = parseFloat(valueString || "0");
    setValue("amount", newAmount);
    // Calcular el valor total basado en la cantidad
    const newTotal = newAmount * currentPrice;
    setValue("totalValue", newTotal);
  };

  const handleTotalChange = (valueString: string) => {
    const newTotal = parseFloat(valueString || "0");
    setValue("totalValue", newTotal);
    const newAmount = newTotal / currentPrice;
    setValue("amount", newAmount);
  };

  const mutation = useMutation<unknown, Error, OrderData>({
    mutationFn: (orderData) => {
      return fetch(API_ROUTES.orders.create, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      }).then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      });
    },
  });

  const onSubmit = hookFormSubmit((data) => {
    const orderData = {
      symbol,
      amount: data.amount,
      type,
      priceAtExecution: currentPrice,
      total: data.totalValue,
    };

    mutation.mutate(orderData, {
      onSuccess: (responseData: any) => {
        console.log(responseData);
        toast({
          title: "Operación exitosa",
          description: `Has ${
            type === "buy" ? "comprado" : "vendido"
          } ${data.amount.toFixed(
            6
          )} ${symbol.toUpperCase()} por $${data.totalValue.toFixed(2)}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        reset();
        onClose();
      },
      onError: (error: any) => {
        console.error(error);
        toast({
          title: "Error",
          description:
            error.message || "Ha ocurrido un error al procesar tu orden",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      },
    });
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {type === "buy" ? "Comprar" : "Vender"} {symbol.toUpperCase()}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form id="order-form" onSubmit={onSubmit}>
            <Stack spacing={4}>
              <FormControl isInvalid={!!errors.amount}>
                <FormLabel>Cantidad de {symbol.toUpperCase()}</FormLabel>
                <Controller
                  name="amount"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                      min={0}
                      precision={6}
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
            </Stack>
          </form>
          
          <Divider my={4} />
          
          <Flex justifyContent="space-between" mt={4}>
            <Text>Precio unitario</Text>
            <Text fontWeight="bold">${currentPrice.toLocaleString()}</Text>
          </Flex>
          
          <Flex justifyContent="space-between" mt={2}>
            <Text>Total a {type === "buy" ? "pagar" : "recibir"}</Text>
            <Text fontWeight="bold">${watchTotalValue.toFixed(2)}</Text>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme={type === "buy" ? "green" : "red"}
            mr={3}
            type="submit"
            form="order-form"
            isLoading={mutation.isPending || isSubmitting}
            loadingText="Procesando"
          >
            Confirmar
          </Button>
          <Button variant="ghost" onClick={handleClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OrderModal;
