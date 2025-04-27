import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';
import { orderService, OrderData } from '../services/orderService';
import { formatCryptoAmount } from '../utils/formatters';

// Esquema de validación
const orderFormSchema = z.object({
  amount: z.number()
    .positive('La cantidad debe ser mayor a 0')
    .min(0.000001, 'La cantidad mínima es 0.000001'),
  totalValue: z.number()
    .positive('El valor debe ser mayor a 0')
    .min(0.01, 'El valor mínimo es 0.01 USD')
});

// Tipo inferido del esquema
export type OrderFormValues = z.infer<typeof orderFormSchema>;

interface UseOrderFormProps {
  symbol: string;
  type: 'buy' | 'sell';
  currentPrice: number;
  onSuccess?: () => void;
}

export const useOrderForm = ({ symbol, type, currentPrice, onSuccess }: UseOrderFormProps) => {
  const toast = useToast();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Configuración del formulario
  const form = useForm<OrderFormValues>({
    defaultValues: {
      amount: 0,
      totalValue: 0
    },
    resolver: zodResolver(orderFormSchema),
    mode: 'onSubmit'
  });

  const { 
    control, 
    handleSubmit: hookFormSubmit, 
    watch, 
    setValue, 
    reset,
    getValues,
    formState: { errors, isSubmitting } 
  } = form;

  const watchTotalValue = watch('totalValue');
  const watchAmount = watch('amount');

  const mutation = useMutation({
    mutationFn: orderService.createOrder,
    onSuccess: () => {
      const formattedAmount = formatCryptoAmount(getValues().amount);
      toast({
        title: 'Operación exitosa',
        description: `Has ${type === 'buy' ? 'comprado' : 'vendido'} ${formattedAmount} ${symbol.toUpperCase()} por $${getValues().totalValue.toFixed(2)}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      queryClient.invalidateQueries({ queryKey: ['wallet-balance'] });
      reset();
      setErrorMessage(null);
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      console.error(error);
      setErrorMessage(error.message || 'Ha ocurrido un error al procesar tu orden');
      toast({
        title: 'Error en la operación',
        description: error.message || 'Ha ocurrido un error al procesar tu orden',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  // Manejar cambio en la cantidad
  const handleAmountChange = (valueString: string) => {
    const newAmount = parseFloat(valueString || '0');
    setValue('amount', newAmount);
    const newTotal = newAmount * currentPrice;
    setValue('totalValue', newTotal);
  };

  const handleTotalChange = (valueString: string) => {
    const newTotal = parseFloat(valueString || '0');
    setValue('totalValue', newTotal);
    const newAmount = newTotal / currentPrice;
    const formattedAmount = parseFloat(newAmount.toFixed(4));
    setValue('amount', formattedAmount);
  };

  const onSubmit = hookFormSubmit((data) => {
    setErrorMessage(null);
    
    // Validaciones adicionales
    if (data.amount <= 0) {
      setErrorMessage('La cantidad debe ser mayor que 0');
      return;
    }
    
    if (data.totalValue <= 0) {
      setErrorMessage('El valor total debe ser mayor que 0');
      return;
    }
    
    const orderData: OrderData = {
      symbol,
      amount: data.amount,
      type,
      priceAtExecution: currentPrice,
      total: data.totalValue,
    };

    mutation.mutate(orderData);
  });

  // Función para limpiar errores
  const clearError = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setErrorMessage(null);
  };

  // Función para cerrar y limpiar el formulario
  const handleClose = (closeFunc: () => void) => {
    reset();
    setErrorMessage(null);
    closeFunc();
  };

  return {
    form,
    control,
    errors,
    isSubmitting,
    errorMessage,
    watchTotalValue,
    watchAmount,
    mutation,
    handleAmountChange,
    handleTotalChange,
    onSubmit,
    clearError,
    handleClose
  };
}; 