import { useQuery } from '@tanstack/react-query';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Text,
  Skeleton,
} from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';
import { API_ROUTES } from '../config/api';

interface Instrument {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  change7d: number;
}

const fetchInstruments = async (): Promise<{ coins: Instrument[] }> => {
  const token = useAuth.getState().token;
  const response = await fetch(API_ROUTES.market.instruments, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Error al obtener los instrumentos');
  }
  
  return response.json();
};

export const InstrumentsList = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['instruments'],
    queryFn: fetchInstruments,
    refetchInterval: 5 * 60 * 1000, // 5 minutos
  });

  if (isLoading) {
    return (
      <Box p={4}>
        <Skeleton height="400px" />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box p={4}>
        <Text color="red.500">Error al cargar los instrumentos. Por favor, intente nuevamente.</Text>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Nombre</Th>
              <Th>Símbolo</Th>
              <Th isNumeric>Precio</Th>
              <Th isNumeric>Variación 24h</Th>
              <Th isNumeric>Variación 7d</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.coins.slice(0, 20).map((instrument) => (
              <Tr key={instrument.id}>
                <Td>{instrument.name}</Td>
                <Td>{instrument.symbol.toUpperCase()}</Td>
                <Td isNumeric>${instrument.price.toLocaleString()}</Td>
                <Td isNumeric color={instrument.change24h >= 0 ? 'green.500' : 'red.500'}>
                  {instrument.change24h.toFixed(2)}%
                </Td>
                <Td isNumeric color={instrument.change7d >= 0 ? 'green.500' : 'red.500'}>
                  {instrument.change7d.toFixed(2)}%
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}; 