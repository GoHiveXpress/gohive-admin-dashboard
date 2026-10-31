// Where to pin a working rider on the live map, or null when they are offline
// or the app has not reported a position yet.
import { type RiderUser } from "@/types/riderManagement";

export type MapPosition = { lat: number; lng: number };

export const riderPosition = (rider: RiderUser): MapPosition | null => {
	if (!["online", "busy"].includes(rider.riderProfile?.availabilityStatus)) return null;
	const [lng, lat] = rider.location?.coordinates ?? [];
	if (lng === undefined || lat === undefined) return null;
	return { lat, lng };
};
