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

  const orderForm = useOrderForm({
    symbol,
    type,
    currentPrice: price,
    onSuccess: onClose,
  });

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

  // Calcular balance restante para ventas
  const remainingBalance =
    type === "sell" ? coinBalance - (orderForm.watchAmount || 0) : coinBalance;
  const remainingBalanceUSD = remainingBalance * price;
  const remainingUsdBalance =
    type === "buy" ? usdBalance - (orderForm.watchTotalValue || 0) : usdBalance;

  return (
    <Modal isOpen={isOpen} onClose={() => orderForm.handleClose(onClose)} isCentered>
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

          <ErrorAlert message={orderForm.errorMessage} onClose={orderForm.clearError} />

          <form id="order-form" onSubmit={orderForm.onSubmit}>
            <OrderForm
              control={orderForm.control}
              errors={orderForm.errors}
              symbol={symbol}
              handleAmountChange={orderForm.handleAmountChange}
              handleTotalChange={orderForm.handleTotalChange}
              maxAmount={type === "sell" ? coinBalance : undefined}
            />
          </form>

          <OrderSummary
            currentPrice={price}
            totalValue={orderForm.watchTotalValue}
            type={type}
          />
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme={type === "buy" ? "green" : "red"}
            mr={3}
            type="submit"
            form="order-form"
            isLoading={orderForm.mutation.isPending || orderForm.isSubmitting}
            loadingText="Procesando"
            isDisabled={
              orderForm.isSubmitting ||
              (type === "sell" && remainingBalance < 0) ||
              (type === "buy" && remainingUsdBalance < 0)
            }
            onClick={() => {
              if (orderForm.errorMessage) {
                orderForm.clearError();
              }
            }}
          >
            {orderForm.errorMessage ? "Volver a intentar" : "Confirmar"}
          </Button>
          <Button variant="ghost" onClick={() => orderForm.handleClose(onClose)}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
