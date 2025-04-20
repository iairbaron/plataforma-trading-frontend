import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { Instrument } from "../../types/market";

interface Props {
  instruments: Instrument[];
}

export const InstrumentsTable = ({ instruments }: Props) => (
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
        {instruments.slice(0, 20).map((instrument) => (
          <Tr key={instrument.id}>
            <Td>{instrument.name}</Td>
            <Td>{instrument.symbol.toUpperCase()}</Td>
            <Td isNumeric>${instrument.price.toLocaleString()}</Td>
            <Td
              isNumeric
              color={instrument.change24h >= 0 ? "green.500" : "red.500"}
            >
              {instrument.change24h.toFixed(2)}%
            </Td>
            <Td
              isNumeric
              color={instrument.change7d >= 0 ? "green.500" : "red.500"}
            >
              {instrument.change7d.toFixed(2)}%
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  </TableContainer>
);
