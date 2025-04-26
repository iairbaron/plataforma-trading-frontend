import React from "react";
import { useQuery } from "@tanstack/react-query";
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
import { walletService } from "../../services/walletService";

// Función para formatear cantidades de criptomonedas
const formatCryptoAmount = (amount: number): string => {
  // Para cantidades enteras o muy pequeñas
  if (amount >= 1) {
    return amount.toFixed(2);
  } else if (amount >= 0.001) {
    return amount.toFixed(3);
  } else if (amount >= 0.00001) {
    return amount.toFixed(5);
  } else {
    // Para valores extremadamente pequeños, usamos notación científica
    return amount.toExponential(2);
  }
};

const WalletBalance: React.FC = () => {
  // Usar React Query para obtener los datos del wallet
  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['wallet-balance'],
    queryFn: walletService.getBalance,
    refetchOnWindowFocus: false,
  });

  // Calculamos el color para alternancia de filas
  const rowBgEven = useColorModeValue("white", "gray.800");
  const rowBgOdd = useColorModeValue("gray.50", "gray.700");

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
          <Button 
            mt={4} 
            colorScheme="red" 
            onClick={() => refetch()}
          >
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
    value: details.value
  }));

  // Calcular el total
  const totalValue = data.usdBalance + data.totalCoinValue;

  return (
    <Box>
      <Heading size="xl" mb={8}>Balance total</Heading>
      
        <Box>
          <Text fontSize="lg" color="gray.600">USD disponible</Text>
          <Text fontSize="3xl" fontWeight="bold">${data.usdBalance.toFixed(2)}</Text>
          </Box>
          <Box py={4}>
          <Text fontSize="lg" color="gray.600">Valor de portafolio</Text>
          <Text fontSize="3xl" fontWeight="bold">${totalValue.toFixed(2)}</Text>
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
                      label={`≈ $${coin.value.toFixed(2)}`}
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
                <Td isNumeric>${coin.currentPrice.toFixed(2)}</Td>
                <Td isNumeric>${coin.value.toFixed(2)}</Td>
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
        <Button colorScheme="green" size="lg" width="200px">
          Depositar
        </Button>
        <Button variant="outline" size="lg" width="200px">
          Retirar
        </Button>
      </Flex>
    </Box>
  );
};

export default WalletBalance; 