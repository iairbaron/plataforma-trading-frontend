import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
import { InstrumentsSkeleton } from "./InstrumentsSkeleton";
import { InstrumentsTable } from "./InstrumentsTable";
import { useInstruments } from "../../hooks/useInstruments";
import { useFavorites } from "../../hooks/useFavorites";
import { SearchIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

export const InstrumentsList = () => {
  const { data: instrumentsData, isLoading: loadingInstruments } =
    useInstruments();
  const { data: favorites = [], isLoading: loadingFavorites } = useFavorites();

  const [searchTerm, setSearchTerm] = useState("");
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  if (loadingInstruments || loadingFavorites) return <InstrumentsSkeleton />;

  if (!instrumentsData) {
    return (
      <Box p={4}>
        <Text color="red.500">Error al cargar instrumentos.</Text>
      </Box>
    );
  }

  // Enriquecer instrumentos con isFavorite
  const enrichedInstruments = instrumentsData.coins.map((coin) => ({
    ...coin,
    isFavorite: favorites.includes(coin.symbol.toLowerCase()),
  }));

  // Filtrar por búsqueda y favoritos
  const filteredInstruments = enrichedInstruments.filter((coin) => {
    const matchesSearch =
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFavorite = onlyFavorites ? coin.isFavorite : true;

    return matchesSearch && matchesFavorite;
  });

  return (
    <Box>
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align="center"
        gap={4}
        mb={4}
      >
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="center"
          gap={4}
          mb={4}
        >
          <InputGroup maxW="400px" w="full">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Buscar por nombre o símbolo"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg="white"
            />
          </InputGroup>

          <Button
            leftIcon={onlyFavorites ? <AiFillHeart /> : <AiOutlineHeart />}
            variant="ghost"
            color={onlyFavorites ? "blue.500" : "gray.500"}
            _hover={{ bg: "gray.100" }}
            onClick={() => setOnlyFavorites((prev) => !prev)}
          >
            Favoritos
          </Button>
        </Flex>
      </Flex>

      <InstrumentsTable instruments={filteredInstruments} />
    </Box>
  );
};
