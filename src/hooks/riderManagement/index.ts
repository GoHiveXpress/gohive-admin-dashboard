// src/hooks/riderManagement/index.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/useToast";
import { riderApi } from "@/app/api/riderManagement";

export const useRiders = () => {
  return useQuery({
    queryKey: ["riders"],
    queryFn: riderApi.getAllRiders,
  });
};

export const useSingleRider = (id: string) => {
  return useQuery({
    queryKey: ["rider", id],
    queryFn: () => riderApi.getRiderById(id),
    enabled: !!id,
  });
};

export const useUpdateRiderStatus = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    // FIX: Pass one object to the API function
    mutationFn: ({ id, status }: { id: string; status: "pending" | "approved" | "rejected" }) => 
      riderApi.updateRiderStatus({ riderId: id, status }),

    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["riders"] });
      queryClient.invalidateQueries({ queryKey: ["rider"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};