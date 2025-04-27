import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Box,
  Alert,
  AlertIcon,
  Flex,
  Divider,
  Center,
  VStack,
} from "@chakra-ui/react";
import { useOrderForm } from "../../hooks/useOrderForm";
import { OrderForm } from "./OrderForm";
import { OrderSummary } from "./OrderSummary";
import { useWallet } from "../../hooks/useWallet";
import { formatCryptoAmount, formatPrice } from "../../utils/formatters";
import { ErrorAlert } from "./ErrorAlert";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "buy" | "sell";
  symbol: string;
  price: number;
}

export const OrderModal = ({
  isOpen,
  onClose,
  type,
  symbol,
  price,
}: OrderModalProps) => {
  const {
    walletData,
    isError: isWalletError,
    refetch: refetchWallet,
  } = useWallet();

  // Si hay error al cargar los datos del wallet
  if (
    isWalletError ||
    !walletData ||
    walletData.coinDetails[symbol.toLowerCase()]?.amount < 0
  ) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Error</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center py={8}>
              <VStack spacing={4}>
                <Alert status="error">
                  <AlertIcon />
                  No se pudieron cargar los datos de las monedas
                </Alert>
                <Button onClick={() => refetchWallet()}>
                  Intentar nuevamente
                </Button>
              </VStack>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  const coinBalance = walletData.coinDetails[symbol.toLowerCase()]?.amount || 0;
  const usdBalance = walletData.usdBalance || 0;

  // Usar nuestro hook personalizado
  const {
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
    handleClose,
  } = useOrderForm({
    symbol,
    type,
    currentPrice: price,
    onSuccess: onClose,
  });

  // Calcular balance restante para ventas
  const remainingBalance =
    type === "sell" ? coinBalance - (watchAmount || 0) : coinBalance;
  const remainingBalanceUSD = remainingBalance * price;
  const remainingUsdBalance =
    type === "buy" ? usdBalance - (watchTotalValue || 0) : usdBalance;

  return (
    <Modal isOpen={isOpen} onClose={() => handleClose(onClose)} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {type === "buy" ? "Comprar" : "Vender"} {symbol.toUpperCase()}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Mostrar balance disponible */}
          <Box mb={4} borderWidth="1px" borderRadius="md" p={3}>
            <Text fontSize="sm" color="gray.600" mb={2}>
              Balance disponible:
            </Text>
            {type === "buy" ? (
              <Flex justify="space-between" align="center">
                <Text fontSize="sm" fontWeight="medium">
                  ${formatPrice(remainingUsdBalance)} USD
                </Text>
              </Flex>
            ) : (
              // Balance para ventas (Cripto + USD)
              <Flex justify="space-between" align="center">
                <Text fontSize="sm" fontWeight="medium">
                  {formatCryptoAmount(remainingBalance)} {symbol.toUpperCase()}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  ≈ ${formatPrice(remainingBalanceUSD)}
                </Text>
              </Flex>
            )}

            {((type === "sell" && remainingBalance < 0) ||
              (type === "buy" && remainingUsdBalance < 0)) && (
              <Alert status="error" size="sm" mt={2}>
                <AlertIcon />
                No tienes suficiente balance para esta operación
              </Alert>
            )}
          </Box>
          <Divider mb={4} />

          <ErrorAlert message={errorMessage} onClose={clearError} />

          <form id="order-form" onSubmit={onSubmit}>
            <OrderForm
              control={control}
              errors={errors}
              symbol={symbol}
              handleAmountChange={handleAmountChange}
              handleTotalChange={handleTotalChange}
              maxAmount={type === "sell" ? coinBalance : undefined}
            />
          </form>

          <OrderSummary
            currentPrice={price}
            totalValue={watchTotalValue}
            type={type}
          />
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme={type === "buy" ? "green" : "red"}
            mr={3}
            type="submit"
            form="order-form"
            isLoading={mutation.isPending || isSubmitting}
            loadingText="Procesando"
            isDisabled={
              isSubmitting ||
              (type === "sell" && remainingBalance < 0) ||
              (type === "buy" && remainingUsdBalance < 0)
            }
            onClick={() => {
              if (errorMessage) {
                clearError();
              }
            }}
          >
            {errorMessage ? "Volver a intentar" : "Confirmar"}
          </Button>
          <Button variant="ghost" onClick={() => handleClose(onClose)}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
