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

// Online/offline counts plus the riders working right now, for the order-flow
// screens. Two small queries instead of downloading every rider.
const WORKING_RIDERS_SHOWN = 50;
export const useRiderOverview = () => {
	const working = useRiders({ availability: "active", page: 1, limit: WORKING_RIDERS_SHOWN });
	const everyone = useRiders({ page: 1, limit: 1 });
	const online = working.data?.pagination?.total ?? 0;
	const total = everyone.data?.pagination?.total ?? 0;
	return {
		riders: working.data?.data ?? [],
		online,
		offline: Math.max(total - online, 0),
		isLoading: working.isLoading || everyone.isLoading,
	};
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
