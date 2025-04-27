import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { walletService, OperationType } from "../services/walletService";
import { useToast } from "@chakra-ui/react";
import { WalletBalance } from "../types/wallet";
import { useUser } from "./useUser";

export const useWallet = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { user } = useUser();

  // Consulta para obtener el balance
  const { 
    data: walletData, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery<WalletBalance, Error>({
    queryKey: ["wallet-balance"],
    queryFn: walletService.getBalance,
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000, // 1 minuto
  });

  // Mutación para actualizar el balance (depósito/retiro)
  const updateBalanceMutation = useMutation({
    mutationFn: ({ operation, amount }: { operation: OperationType; amount: number }) => 
      walletService.updateBalance({ operation, amount }),
    onSuccess: (data, variables) => {
      const { operation, amount } = variables;
      const operationText = operation === "deposit" ? "depositado" : "retirado";
      const userName = user?.name ? ` ${user.name}` : "";
      
      toast({
        title: "Operación exitosa",
        description: `¡Hola${userName}! Has ${operationText} $${amount.toFixed(2)} USD en tu cuenta.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      // Invalidar la consulta para actualizar la UI
      queryClient.invalidateQueries({ queryKey: ["wallet-balance"] });
    },
    onError: (err: Error) => {
      toast({
        title: "Error en la operación",
        description: err.message || "Ha ocurrido un error al procesar tu operación",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  return {
    walletData,
    isLoading,
    isError,
    error,
    refetch,
    updateBalance: updateBalanceMutation.mutate,
    isUpdating: updateBalanceMutation.isPending,
    userName: user?.name,
    userEmail: user?.email
  };
}; 