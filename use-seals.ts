import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "../../shared/routes";  // ruta ajustada
import { useToast } from "@/hooks/use-toast";

export function useSeals() {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: seals = [], isLoading } = useQuery({
    queryKey: ['seals'],
    queryFn: async () => {
      const response = await fetch(buildUrl('/seals'));
      if (!response.ok) throw new Error('Failed to fetch seals');
      return response.json();
    }
  });

  const createSeal = useMutation({
    mutationFn: async (data: { documentHash: string, owner: string, metadata?: any }) => {
      const response = await fetch(buildUrl('/seals/new'), {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create seal');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['seals']);
      toast({ title: "✅ New Seal creado" });
    }
  });

  // Agrega verify si lo tienes

  return { seals, isLoading, createSeal };
}