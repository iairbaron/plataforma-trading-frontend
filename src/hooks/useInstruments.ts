import { useQuery } from "@tanstack/react-query";
import { marketService } from "../services/marketService";

export const useInstruments = () =>  useQuery({
    queryKey: ["instruments"],
    queryFn: marketService.getInstruments,
    staleTime: 5 * 60 * 1000, // cada 5 minutos
  });
