import React from "react";
import { Alert, AlertIcon, AlertDescription, CloseButton } from "@chakra-ui/react";

interface ErrorAlertProps {
  message: string | null;
  onClose: (e?: React.MouseEvent) => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onClose }) => {
  if (!message) return null;
  
  return (
    <Alert status="error" mb={4} borderRadius="md">
      <AlertIcon />
      <AlertDescription>{message}</AlertDescription>
      <CloseButton 
        position="absolute" 
        right="8px" 
        top="8px"
        onClick={onClose}
      />
    </Alert>
  );
};

export default ErrorAlert; 