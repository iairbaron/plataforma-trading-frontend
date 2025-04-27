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
  IconButton,
  Button,
} from "@chakra-ui/react";
import { useState, Fragment } from "react";
import { Instrument } from "../../types/market";
import { StatDisplayBox } from "./StatsBoxs";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useFavorites } from "../../hooks/useFavorites";
import OrderModal from "./OrderModal";
import { formatPrice } from "../../utils/formatters";

interface Props {
  instruments: Instrument[];
}

export const InstrumentsTable = ({ instruments }: Props) => {
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"buy" | "sell">("buy");
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);

  const { toggleFavorite } = useFavorites();

  const handleToggle = (id: string) => {
    setOpenRow((prev) => (prev === id ? null : id));
  };

  const openModal = (type: "buy" | "sell", symbol: string, price: number) => {
    setModalType(type);
    setSelectedSymbol(symbol);
    setSelectedPrice(price);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
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
                <Td>
                  <Flex align="center" gap={2}>
                    {instrument.name}
                    <IconButton
                      aria-label="Favorito"
                      icon={
                        instrument.isFavorite ? (
                          <AiFillHeart />
                        ) : (
                          <AiOutlineHeart />
                        )
                      }
                      size="sm"
                      variant="ghost"
                      color={instrument.isFavorite ? "blue.500" : "gray.300"}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite.mutate(instrument.symbol.toLowerCase());
                      }}
                    />
                  </Flex>
                </Td>{" "}
                <Td>{instrument.symbol.toUpperCase()}</Td>
                <Td isNumeric>${formatPrice(instrument.price)}</Td>
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
                <Td>
                  <Flex gap={2}>
                    <Button
                      size="sm"
                      colorScheme="green"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal("buy", instrument.symbol, instrument.price);
                      }}
                    >
                      Comprar
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal("sell", instrument.symbol, instrument.price);
                      }}
                    >
                      Vender
                    </Button>
                  </Flex>
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
      <OrderModal
        isOpen={modalOpen}
        onClose={closeModal}
        type={modalType}
        symbol={selectedSymbol}
        price={selectedPrice || 0}
      />
    </TableContainer>
  );
};
