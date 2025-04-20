import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Collapse,
  Box,
  Flex,
} from "@chakra-ui/react";
import { useState, Fragment } from "react";
import { Instrument } from "../../types/market";
import { StatDisplayBox } from "./StatsBoxs";

interface Props {
  instruments: Instrument[];
}

export const InstrumentsTable = ({ instruments }: Props) => {
  const [openRow, setOpenRow] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setOpenRow((prev) => (prev === id ? null : id));
  };

  return (
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
            <Fragment key={instrument.id}>
              <Tr
                onClick={() => handleToggle(instrument.id)}
                _hover={{ bg: "gray.50", cursor: "pointer" }}
              >
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
              {openRow === instrument.id && (
                <Tr>
                  <Td colSpan={5} p={0}>
                    <Collapse in={true} animateOpacity>
                      <Box px={4} py={6} bg="gray.50" rounded="md">
                        <Flex gap={4} flexWrap="wrap" justify="space-between">
                          <StatDisplayBox
                            label="Máximo 24h"
                            value={instrument.high24h.toLocaleString()}
                          />
                          <StatDisplayBox
                            label="Mínimo 24h"
                            value={instrument.low24h.toLocaleString()}
                          />
                          <StatDisplayBox
                            label="Volumen 24h"
                            value={instrument.volume24h.toLocaleString()}
                          />
                        </Flex>
                      </Box>
                    </Collapse>
                  </Td>
                </Tr>
              )}
            </Fragment>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
