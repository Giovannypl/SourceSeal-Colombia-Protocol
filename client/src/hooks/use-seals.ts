import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CreateSealRequest } from "@shared/routes";

// ============================================
// SEALS HOOKS
// ============================================

export function useSeals() {
  return useQuery({
    queryKey: [api.seals.list.path],
    queryFn: async () => {
      const res = await fetch(api.seals.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch seals");
      return api.seals.list.responses[200].parse(await res.json());
    },
  });
}

export function useSeal(id: number) {
  return useQuery({
    queryKey: [api.seals.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.seals.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch seal");
      return api.seals.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateSeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateSealRequest) => {
      const res = await fetch(api.seals.create.path, {
        method: api.seals.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.seals.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create seal");
      }
      return api.seals.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.seals.list.path] });
    },
  });
}

// ============================================
// REPORTS HOOKS
// ============================================

import { type InsertReport } from "@shared/schema";

export function useCreateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertReport) => {
      const res = await fetch(api.reports.create.path, {
        method: api.reports.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.reports.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to submit report");
      }
      return api.reports.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      // Invalidate the specific seal to update its report count/status
      queryClient.invalidateQueries({ queryKey: [api.seals.get.path, variables.sealId] });
      queryClient.invalidateQueries({ queryKey: [api.seals.list.path] });
    },
  });
}

// ============================================
// ENFORCEMENT HOOKS
// ============================================

export function useSimulateEnforcement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { sealId: number; financialUsd: number }) => {
      const res = await fetch(api.enforcement.simulate.path, {
        method: api.enforcement.simulate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to simulate enforcement");
      return api.enforcement.simulate.responses[200].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.seals.get.path, variables.sealId] });
      queryClient.invalidateQueries({ queryKey: [api.seals.list.path] });
    },
  });
}
