import {
  Tr,
  Td,
  Flex,
  IconButton,
  Button,
  Collapse,
  Box
} from "@chakra-ui/react";
import { Fragment } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { StatDisplayBox } from "./StatsBoxs";
import { formatPrice } from "../../utils/formatters";
import { Instrument } from "../../types/market";

interface InstrumentRowProps {
  instrument: Instrument;
  isOpen: boolean;
  onToggle: (id: string) => void;
  onToggleFavorite: (symbol: string) => void;
  onBuy: (symbol: string, price: number) => void;
  onSell: (symbol: string, price: number) => void;
}

export const InstrumentRow = ({
  instrument,
  isOpen,
  onToggle,
  onToggleFavorite,
  onBuy,
  onSell
}: InstrumentRowProps) => {
  return (
    <Fragment>
      <Tr
        onClick={() => onToggle(instrument.id)}
        _hover={{ bg: "gray.50", cursor: "pointer" }}
      >
        <Td>
          <Flex align="center" gap={2}>
            {instrument.name}
            <IconButton
              aria-label="Favorito"
              icon={
                instrument.isFavorite ? <AiFillHeart /> : <AiOutlineHeart />
              }
              size="sm"
              variant="ghost"
              color={instrument.isFavorite ? "blue.500" : "gray.300"}
              onClick={e => {
                e.stopPropagation();
                onToggleFavorite(instrument.symbol.toLowerCase());
              }}
            />
          </Flex>
        </Td>
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
              onClick={e => {
                e.stopPropagation();
                onBuy(instrument.symbol, instrument.price);
              }}
            >
              Comprar
            </Button>
            <Button
              size="sm"
              colorScheme="red"
              onClick={e => {
                e.stopPropagation();
                onSell(instrument.symbol, instrument.price);
              }}
            >
              Vender
            </Button>
          </Flex>
        </Td>
      </Tr>
      {isOpen && (
        <Tr>
          <Td colSpan={6} p={0}>
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
  );
}; 