// src/hooks/riderManagement/index.ts
/* eslint-disable @typescript-eslint/no-floating-promises */
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useToast } from "@/hooks/useToast";
import { riderApi } from "@/app/api/riderManagement";
import { type RiderListFilters } from "@/types/riderManagement";

// The one rider list hook. Every rider list shares the ["riders", ...] cache,
// so a status change invalidates all of them. Single riders: useRider in
// hooks/userManagement.
export const useRiders = (
	filters: RiderListFilters = {},
	options: { enabled?: boolean; keepPrevious?: boolean } = {},
) => {
	return useQuery({
		queryKey: ["riders", filters],
		queryFn: () => riderApi.getAllRiders(filters),
		enabled: options.enabled ?? true,
		placeholderData: options.keepPrevious ? keepPreviousData : undefined,
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

export const useRiderTrips = (id: string, status?: string, month?: number, year?: number) => {
	return useQuery({
		queryKey: ["rider_trips", id, status, month, year],
		queryFn: () => riderApi.getRiderTrips(id, { status, month, year }),
		enabled: !!id,
	});
};

/* eslint-enable */
