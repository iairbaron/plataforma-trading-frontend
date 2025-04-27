import React from "react";
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
} from "@chakra-ui/react";
import { useOrderForm } from "../../hooks/useOrderForm";
import OrderForm from "./OrderForm";
import OrderSummary from "./OrderSummary";
import { useWallet } from "../../hooks/useWallet";
import { formatCryptoAmount, formatPrice } from "../../utils/formatters";
import ErrorAlert from "./ErrorAlert";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "buy" | "sell";
  symbol: string;
}

const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  type,
  symbol,
}) => {
  // Precio simulado - En una implementación real, esto vendría de una API o contexto
  const currentPrice = type === "buy" ? 1807.18 : 1805.0;

  // Obtener el balance del wallet
  const { walletData } = useWallet();
  const coinBalance = walletData?.coinDetails[symbol.toLowerCase()]?.amount || 0;
  const coinBalanceUSD = coinBalance * currentPrice;

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
    currentPrice,
    onSuccess: onClose,
  });

  // Calcular balance restante para ventas
  const remainingBalance = type === "sell" ? coinBalance - (watchAmount || 0) : coinBalance;
  const remainingBalanceUSD = remainingBalance * currentPrice;

  return (
    <Modal isOpen={isOpen} onClose={() => handleClose(onClose)} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {type === "buy" ? "Comprar" : "Vender"} {symbol.toUpperCase()}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Mostrar balance actual y restante para ventas */}
          {type === "sell" && (
            <Box mb={4} borderWidth="1px" borderRadius="md" p={3}>
              <Flex justify="space-between" align="center">
                <Text fontSize="sm" color="gray.600">Balance actual:</Text>
                <Box textAlign="right">
                  <Text fontSize="sm" fontWeight="medium">
                    {formatCryptoAmount(remainingBalance)} {symbol.toUpperCase()}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    ≈ ${formatPrice(remainingBalanceUSD)}
                  </Text>
                </Box>
              </Flex>

              {remainingBalance < 0 && (
                <Alert status="error" size="sm" mt={2}>
                  <AlertIcon />
                  No tienes suficiente balance para esta operación
                </Alert>
              )}
            </Box>
          )}

          {/* Componente de alerta de error */}
          <ErrorAlert message={errorMessage} onClose={clearError} />

          {/* Formulario de orden */}
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

          {/* Resumen de la orden */}
          <OrderSummary
            currentPrice={currentPrice}
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
            isDisabled={isSubmitting || (type === "sell" && remainingBalance < 0)}
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

export default OrderModal;
