import { Box, Text } from "@chakra-ui/react";

interface Props {
  label: string;
  value: string;
}

export const StatDisplayBox = ({ label, value }: Props) => {
  return (
    <Box
      flex="1"
      bg="white"
      p={4}
      rounded="lg"
      border="1px solid"
      borderColor="gray.200"
      minW="0"
    >
      <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>
        {label}
      </Text>
      <Text fontSize="lg" fontWeight="bold">
        {value}
      </Text>
    </Box>
  );
};
