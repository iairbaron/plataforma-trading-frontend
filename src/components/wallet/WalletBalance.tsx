import { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Flex,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Tooltip,
  useColorModeValue,
  Skeleton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Center,
} from "@chakra-ui/react";
import { formatCryptoAmount, formatPrice } from "../../utils/formatters";
import { BalanceOperationModal } from "./BalanceOperationModal";
import { OperationType } from "../../services/walletService";
import { useWallet } from "../../hooks/useWallet";

export const WalletBalance = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [operationType, setOperationType] = useState<OperationType>("deposit");

  // Usar nuestro hook personalizado
  const {
    walletData: data,
    isLoading,
    isError,
    error,
    refetch,
    userName,
  } = useWallet();

  // Calculamos el color para alternancia de filas
  const rowBgEven = useColorModeValue("white", "gray.800");
  const rowBgOdd = useColorModeValue("gray.50", "gray.700");

  const handleOpenModal = (type: OperationType) => {
    setOperationType(type);
    setIsModalOpen(true);
  };

  // Si está cargando, mostrar un estado de loading
  if (isLoading) {
    return (
      <Box>
        <Heading size="xl" mb={8}>
          <Skeleton height="40px" width="200px" />
        </Heading>

        <Flex justify="space-between" mb={10}>
          <Box width="40%">
            <Skeleton height="24px" width="120px" mb={2} />
            <Skeleton height="36px" width="140px" />
          </Box>
          <Box width="40%" textAlign="right">
            <Skeleton height="24px" width="120px" ml="auto" mb={2} />
            <Skeleton height="36px" width="140px" ml="auto" />
          </Box>
        </Flex>

        <Divider my={6} />

        <Skeleton height="200px" />
      </Box>
    );
  }

  // Si hay un error, mostrar una alerta
  if (isError) {
    return (
      <Alert
        status="error"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="200px"
        borderRadius="md"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Error al cargar el wallet
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          {(error as Error)?.message || "Ha ocurrido un error inesperado"}
          <Button mt={4} colorScheme="red" onClick={() => refetch()}>
            Intentar nuevamente
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Si no hay datos (aunque la petición fue exitosa)
  if (!data) {
    return (
      <Center height="200px" flexDirection="column">
        <Text mb={4}>No se encontraron datos del wallet</Text>
        <Button colorScheme="blue" onClick={() => refetch()}>
          Recargar
        </Button>
      </Center>
    );
  }

  // Convertir los coinDetails a un array para renderizar
  const coins = Object.entries(data.coinDetails).map(([symbol, details]) => ({
    symbol,
    amount: details.amount,
    currentPrice: details.currentPrice,
    value: details.value,
  }));

  return (
    <Box>
      <Heading size="xl" mb={8}>
        {userName ? `Balance de ${userName}` : "Balance total"}
      </Heading>

      <Box>
        <Text fontSize="lg" color="gray.600">
          USD disponible
        </Text>
        <Text fontSize="3xl" fontWeight="bold">
          ${formatPrice(data.usdBalance)}
        </Text>
      </Box>
      <Box py={4}>
        <Text fontSize="lg" color="gray.600">
          Valor de portafolio
        </Text>
        <Text fontSize="3xl" fontWeight="bold">
          ${formatPrice(data.totalCoinValue)}
        </Text>
      </Box>

      <Divider my={6} />

      {coins.length > 0 ? (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Criptomoneda</Th>
              <Th isNumeric>Cantidad</Th>
              <Th isNumeric>Valor actual</Th>
              <Th isNumeric>Valor en USD</Th>
            </Tr>
          </Thead>
          <Tbody>
            {coins.map((coin, index) => (
              <Tr key={coin.symbol} bg={index % 2 === 0 ? rowBgEven : rowBgOdd}>
                <Td>
                  <Text fontWeight="medium">{coin.symbol.toUpperCase()}</Text>
                </Td>
                <Td isNumeric>
                  <Box display="inline-block" position="relative">
                    <Tooltip
                      label={`≈ $${formatPrice(coin.value)}`}
                      placement="top"
                      hasArrow
                      bg="gray.700"
                      color="white"
                      borderRadius="md"
                      px={3}
                      py={1}
                      fontSize="sm"
                    >
                      <Text>{formatCryptoAmount(coin.amount)}</Text>
                    </Tooltip>
                  </Box>
                </Td>
                <Td isNumeric>${formatPrice(coin.currentPrice)}</Td>
                <Td isNumeric>${formatPrice(coin.value)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Box textAlign="center" py={10} color="gray.500">
          No tienes criptomonedas en tu wallet
        </Box>
      )}

      <Flex justify="center" mt={10} gap={4}>
        <Button
          colorScheme="green"
          size="lg"
          width="200px"
          onClick={() => handleOpenModal("deposit")}
        >
          Depositar
        </Button>
        <Button
          variant="outline"
          size="lg"
          width="200px"
          onClick={() => handleOpenModal("withdraw")}
        >
          Retirar
        </Button>
      </Flex>

      <BalanceOperationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        operationType={operationType}
      />
    </Box>
  );
};

