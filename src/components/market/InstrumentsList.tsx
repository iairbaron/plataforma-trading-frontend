import { Box, Text } from "@chakra-ui/react";
import { InstrumentsSkeleton } from "./InstrumentsSkeleton";
import { useInstruments } from "../../hooks/useInstruments";
import { InstrumentsTable } from "./InstrumentsTable";

export const InstrumentsList = () => {
  const { data, isLoading, isError } = useInstruments();

  if (isLoading) return <InstrumentsSkeleton />;

  if (isError) {
    return (
      <Box p={4}>
        <Text color="red.500">
          Error al cargar los instrumentos. Por favor, intente nuevamente.
        </Text>
      </Box>
    );
  }

  return <InstrumentsTable instruments={data?.coins || []} />;
};
