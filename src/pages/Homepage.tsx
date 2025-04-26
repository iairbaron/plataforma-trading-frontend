import { Box, Container, Tabs, TabList, TabPanels, Tab, TabPanel, Flex, Text, Avatar } from "@chakra-ui/react";
import { InstrumentsList } from "../components/market/InstrumentsList";
import WalletBalance from "../components/wallet/WalletBalance";
import { useState } from "react";

export const Homepage = () => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Container maxW="container.xl" py={4}>
      <Box 
        bg="white" 
        borderRadius="lg" 
        boxShadow="sm" 
        p={4} 
        mb={6}
      >
        <Flex justify="space-between" align="center" mb={6}>
          <Text fontSize="2xl" fontWeight="bold">Hola</Text>
          <Avatar size="md" />
        </Flex>

        <Tabs 
          index={tabIndex} 
          onChange={setTabIndex}
          colorScheme="blue"
          variant="line"
          isFitted
        >
          <TabList>
            <Tab>Monitor de Mercado</Tab>
            <Tab>Wallet</Tab>
          </TabList>
          <TabPanels pt={6}>
            <TabPanel px={0}>
              <InstrumentsList />
            </TabPanel>
            <TabPanel px={0}>
              <WalletBalance />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};
