import { Box, Container, Heading } from '@chakra-ui/react';
import { InstrumentsList } from '../components/InstrumentsList';

export const MarketMonitor = () => {
  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8}>
        <Heading size="lg">Monitor de Mercado</Heading>
      </Box>
      <InstrumentsList />
    </Container>
  );
}; 