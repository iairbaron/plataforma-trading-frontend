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
} from "@chakra-ui/react";
import { useOrderForm } from "../../hooks/useOrderForm";
import OrderForm from "./OrderForm";
import OrderSummary from "./OrderSummary";
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

  // Usar nuestro hook personalizado
  const {
    control,
    errors,
    isSubmitting,
    errorMessage,
    watchTotalValue,
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

  return (
    <Modal isOpen={isOpen} onClose={() => handleClose(onClose)} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {type === "buy" ? "Comprar" : "Vender"} {symbol.toUpperCase()}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
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
            isDisabled={isSubmitting}
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
