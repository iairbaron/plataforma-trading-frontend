import React, { useState } from 'react';
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
  Input,
  FormErrorMessage,
  useToast,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { walletService, OperationType } from '../../services/walletService';

// Schema de validación
const balanceOperationSchema = z.object({
  amount: z
    .number()
    .positive('El monto debe ser mayor a 0')
    .min(0.01, 'El monto mínimo es 0.01 USD')
});

type BalanceOperationFormValues = z.infer<typeof balanceOperationSchema>;

interface BalanceOperationModalProps {
  isOpen: boolean;
  onClose: () => void;
  operationType: OperationType;
}

const BalanceOperationModal: React.FC<BalanceOperationModalProps> = ({
  isOpen,
  onClose,
  operationType,
}) => {
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const queryClient = useQueryClient();

  // Configuración del formulario
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BalanceOperationFormValues>({
    resolver: zodResolver(balanceOperationSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const title = operationType === 'deposit' ? 'Depositar fondos' : 'Retirar fondos';
  const buttonColor = operationType === 'deposit' ? 'green' : 'red';

  const operationMutation = useMutation({
    mutationFn: walletService.updateBalance,
    onSuccess: (data) => {
      toast({
        title: 'Operación exitosa',
        description: `Has ${operationType === 'deposit' ? 'depositado' : 'retirado'} $${data.data.balance.toFixed(2)} USD en tu cuenta.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      // Invalidar la consulta para actualizar la UI
      queryClient.invalidateQueries({ queryKey: ['wallet-balance'] });
      reset();
      setError(null);
      onClose();
    },
    onError: (err: Error) => {
      console.error(err);
      setError(err.message || 'Ha ocurrido un error al procesar tu operación');
    },
  });

  const onSubmit = handleSubmit((data) => {
    setError(null);
    operationMutation.mutate({
      operation: operationType,
      amount: data.amount,
    });
  });

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} as="form" onSubmit={onSubmit}>
            {error && (
              <Text color="red.500" fontSize="sm">
                {error}
              </Text>
            )}
            <FormControl isInvalid={!!errors.amount}>
              <FormLabel>Monto en USD</FormLabel>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                {...register('amount', {
                  valueAsNumber: true,
                })}
              />
              <FormErrorMessage>
                {errors.amount?.message}
              </FormErrorMessage>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            colorScheme={buttonColor}
            isLoading={isSubmitting || operationMutation.isPending}
            onClick={onSubmit}
          >
            {operationType === 'deposit' ? 'Depositar' : 'Retirar'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BalanceOperationModal; 