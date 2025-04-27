import { Flex, Text, Divider } from "@chakra-ui/react";
import { formatPrice } from "../../utils/formatters";

interface OrderSummaryProps {
  currentPrice: number;
  totalValue: number;
  type: 'buy' | 'sell';
}

export const OrderSummary = ({
  currentPrice,
  totalValue,
  type
}: OrderSummaryProps) => (
    <>
      <Divider my={4} />
      
      <Flex justifyContent="space-between" mt={4}>
        <Text>Precio unitario</Text>
        <Text fontWeight="bold">${formatPrice(currentPrice)}</Text>
      </Flex>
      
      <Flex justifyContent="space-between" mt={2}>
        <Text>Total a {type === "buy" ? "pagar" : "recibir"}</Text>
        <Text fontWeight="bold">${formatPrice(totalValue)}</Text>
      </Flex>
    </>
  );
