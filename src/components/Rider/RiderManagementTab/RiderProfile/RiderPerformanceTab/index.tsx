"use client";

import { useMemo, useState } from "react";
import { useRiderTrips } from "@/hooks/riderManagement";
import { Loader2 } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const containerStyle = {
	width: "100%",
	height: "100%",
	borderRadius: "16px",
};

interface RiderPerformanceTabProps {
	rider: any;
}

export default function RiderPerformanceTab({ rider }: RiderPerformanceTabProps) {
	const [sortOrder, setSortOrder] = useState<"chrono" | "high" | "low">("chrono");
	
	const currentDate = new Date();
	const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth());
	const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());

	const { data: response, isLoading } = useRiderTrips(rider?._id, "delivered", selectedMonth, selectedYear);

	const { isLoaded: isMapLoaded } = useJsApiLoader({
		id: "google-map-script",
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
	});

	// Default to a generic location or rider's specific location if available
	const center = useMemo(
		() => ({
			lat: rider?.location?.coordinates?.[1] || 6.5244, // Lagos fallback
			lng: rider?.location?.coordinates?.[0] || 3.3792,
		}),
		[rider]
	);

	const chartData = useMemo(() => {
		if (!response?.data) return [];
		let rawData = [...response.data];

		if (sortOrder === "high") {
			rawData.sort((a, b) => b.trips - a.trips);
		} else if (sortOrder === "low") {
			rawData.sort((a, b) => a.trips - b.trips);
		} else {
			// standard chronological by date string
			rawData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
		}

		// Transform dates to readable format for the chart
		return rawData.map((d) => {
			const dateObj = new Date(d.date);
			return {
				name: dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
				trips: d.trips,
			};
		});
	}, [response?.data, sortOrder]);

	// Month options
	const MONTHS = [
		{ value: 0, label: "January" },
		{ value: 1, label: "February" },
		{ value: 2, label: "March" },
		{ value: 3, label: "April" },
		{ value: 4, label: "May" },
		{ value: 5, label: "June" },
		{ value: 6, label: "July" },
		{ value: 7, label: "August" },
		{ value: 8, label: "September" },
		{ value: 9, label: "October" },
		{ value: 10, label: "November" },
		{ value: 11, label: "December" },
	];

	if (isLoading) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<Loader2 className="text-secondary size-8 animate-spin" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Metric Cards */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				<div className="border-border/50 rounded-2xl border bg-white p-5 shadow-sm">
					<p className="text-muted-foreground text-sm font-medium">Lifetime Trips Delivered</p>
					<h3 className="text-2xl font-bold text-black">
						{rider?.riderProfile?.totalDeliveries || 0}
					</h3>
				</div>
				<div className="border-border/50 rounded-2xl border bg-white p-5 shadow-sm">
					<p className="text-muted-foreground text-sm font-medium">Active Days</p>
					<h3 className="text-2xl font-bold text-black">{response?.data?.length || 0}</h3>
				</div>
				<div className="border-border/50 rounded-2xl border bg-white p-5 shadow-sm">
					<p className="text-muted-foreground text-sm font-medium">Avg Trips / Day</p>
					<h3 className="text-2xl font-bold text-black">
						{response?.data?.length
							? (
									response.data.reduce(
										(acc: number, val: any) => acc + val.trips,
										0
									) / response.data.length
								).toFixed(1)
							: "0.0"}
					</h3>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
				{/* CHART SECTION */}
				<div className="border-border/50 col-span-3 flex min-h-[400px] flex-col rounded-[20px] border bg-white p-5 shadow-sm">
					<div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
						<h3 className="text-foreground text-lg font-bold">Trip Performance</h3>
						
						<div className="flex items-center gap-2">
							<Select
								value={selectedMonth.toString()}
								onValueChange={(val) => setSelectedMonth(parseInt(val, 10))}
							>
								<SelectTrigger className="w-[140px] rounded-lg">
									<SelectValue placeholder="Select Month" />
								</SelectTrigger>
								<SelectContent>
									{MONTHS.map((m) => (
										<SelectItem key={m.value} value={m.value.toString()}>
											{m.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Select
								value={sortOrder}
								onValueChange={(val: "chrono" | "high" | "low") => setSortOrder(val)}
							>
								<SelectTrigger className="w-[150px] rounded-lg">
									<SelectValue placeholder="Sort output" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="chrono">Chronological</SelectItem>
									<SelectItem value="high">High to Low</SelectItem>
									<SelectItem value="low">Low to High</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{chartData.length === 0 ? (
						<div className="flex flex-1 items-center justify-center text-muted-foreground">
							No trips recorded for this rider in the selected month.
						</div>
					) : (
						<div className="flex-1 w-full">
							<ResponsiveContainer width="100%" height="100%" minHeight={300}>
								<BarChart
									data={chartData}
									margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
								>
									<CartesianGrid strokeDasharray="3 3" vertical={false} />
									<XAxis
										dataKey="name"
										tickLine={false}
										axisLine={false}
										tick={{ fontSize: 12, fill: "#8E8B7B" }}
										dy={10}
									/>
									<YAxis
										tickLine={false}
										axisLine={false}
										tick={{ fontSize: 12, fill: "#8E8B7B" }}
										dx={-10}
										allowDecimals={false}
									/>
									<Tooltip
										cursor={{ fill: "transparent" }}
										contentStyle={{
											borderRadius: "12px",
											border: "none",
											boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
										}}
									/>
									<Bar
										dataKey="trips"
										fill="#F59E0B"
										radius={[6, 6, 0, 0]}
										maxBarSize={50}
									/>
								</BarChart>
							</ResponsiveContainer>
						</div>
					)}
				</div>

				{/* MAP SECTION */}
				<div className="border-border/50 col-span-2 flex min-h-[400px] flex-col rounded-[20px] border bg-white p-5 shadow-sm">
					<div className="mb-4">
						<h3 className="text-foreground text-lg font-bold">Last Known Location</h3>
						<p className="text-muted-foreground text-xs font-medium">Real-time rider presence</p>
					</div>

					<div className="relative flex-1 overflow-hidden" style={{ minHeight: "300px" }}>
						{!isMapLoaded ? (
							<div className="flex h-full w-full items-center justify-center rounded-2xl bg-muted/20">
								<Loader2 className="size-6 animate-spin text-muted-foreground" />
							</div>
						) : (
							<GoogleMap
								mapContainerStyle={containerStyle}
								center={center}
								zoom={14}
								options={{
									disableDefaultUI: true,
									zoomControl: true,
									styles: [
										{
											featureType: "poi",
											elementType: "labels",
											stylers: [{ visibility: "off" }],
										},
									],
								}}
							>
								<Marker
									position={center}
									icon={{
										path: google.maps.SymbolPath.CIRCLE,
										scale: 8,
										fillColor: "#22C55E",
										fillOpacity: 1,
										strokeWeight: 2,
										strokeColor: "#FFFFFF",
									}}
								/>
							</GoogleMap>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
