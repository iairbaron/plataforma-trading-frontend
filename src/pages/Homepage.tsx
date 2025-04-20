import { Box, Container, Heading } from "@chakra-ui/react";
import { InstrumentsList } from "../components/market/InstrumentsList";

export const Homepage = () => {
  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8}>
        <Heading size="lg">Monitor de Mercado</Heading>
      </Box>
      <InstrumentsList />
    </Container>
  );
};
