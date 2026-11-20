// The area GoHive serves: Offa and Ijagbo (Kwara State). Every dashboard map
// opens on these two towns and can't be panned or zoomed out far past them.

export const SERVICE_CENTER = { lat: 8.155, lng: 4.73 };

// The two towns themselves: what a map frames when it opens.
export const CITIES_BOUNDS = { north: 8.19, south: 8.125, west: 4.7, east: 4.77 };

// A little room around the towns: the furthest a map can be dragged.
export const SERVICE_BOUNDS = { north: 8.24, south: 8.07, west: 4.63, east: 4.83 };

// Map options that keep a Google map inside the service area.
export const SERVICE_AREA_MAP_OPTIONS = {
	restriction: { latLngBounds: SERVICE_BOUNDS, strictBounds: false },
	minZoom: 12,
	maxZoom: 19,
};
