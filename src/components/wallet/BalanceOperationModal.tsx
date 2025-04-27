import { useState } from 'react';
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
  Text,
  VStack,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { OperationType } from '../../services/walletService';
import { useWallet } from '../../hooks/useWallet';

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

export const BalanceOperationModal = ({
  isOpen,
  onClose,
  operationType,
}: BalanceOperationModalProps) => {
  const [error, setError] = useState<string | null>(null);
  const { updateBalance, isUpdating, userName, walletData } = useWallet();

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
  
  const onSubmit = handleSubmit((data) => {
    setError(null);
    // Validación: no permitir retirar más de lo disponible
    if (operationType === 'withdraw' && walletData && data.amount > walletData.usdBalance) {
      setError('No puedes retirar más de lo que tienes disponible.');
      return;
    }
    updateBalance({
      operation: operationType,
      amount: data.amount,
    }, {
      onSuccess: () => {
        reset();
        setError(null);
        onClose();
      },
      onError: (err: Error) => {
        console.error(err);
        setError(err.message || 'Ha ocurrido un error al procesar tu operación');
      }
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
        <ModalHeader>
          {userName ? `${title} - ${userName}` : title}
        </ModalHeader>
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
            isLoading={isSubmitting || isUpdating}
            onClick={onSubmit}
          >
            {operationType === 'deposit' ? 'Depositar' : 'Retirar'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
