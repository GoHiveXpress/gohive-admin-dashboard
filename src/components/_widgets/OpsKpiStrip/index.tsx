// src/components/_widgets/OpsKpiStrip/index.tsx
// Today's figures so far, each compared with the same weekday last week up to
// the same time (e.g. "vs 12 last Monday"), with a 14-day trend line.
// Data: GET /admin/ops/kpis (refreshed by socket events).

"use client";

import { Icon } from "@iconify/react";
import { Skeleton } from "@/components/ui/skeleton";
import { useOpsKpis } from "@/hooks/useOps";
import { type OpsChange, type OpsTrendPoint, type OpsWindowStats } from "@/types/ops";

const naira = new Intl.NumberFormat("en-NG", {
	style: "currency",
	currency: "NGN",
	maximumFractionDigits: 0,
});

interface Card {
	label: string;
	icon: string;
	value: string;
	change: number | null;
	// Raw figures behind the change, so it can be shown as "vs 12 last Monday".
	current: number;
	previous: number;
	previousText: string;
	// Cancellations going up is bad news, so its colours flip.
	higherIsWorse?: boolean;
	footnote?: string;
	series: number[];
}

function Sparkline({ values }: { values: number[] }) {
	const width = 96;
	const height = 28;
	const max = Math.max(...values, 1);
	const step = values.length > 1 ? width / (values.length - 1) : width;
	const points = values
		.map(
			(value, index) =>
				`${(index * step).toFixed(1)},${(height - (value / max) * height).toFixed(1)}`,
		)
		.join(" ");

	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
			<polyline
				points={points}
				fill="none"
				stroke="currentColor"
				strokeWidth="1.75"
				strokeLinejoin="round"
				strokeLinecap="round"
			/>
		</svg>
	);
}

function ChangeLabel({
	card,
	lastWeekDay,
}: {
	card: Card;
	// "last Monday": the same weekday as today, up to the same time.
	lastWeekDay: string;
}) {
	const { change, current, previous, previousText, higherIsWorse } = card;

	if (current === 0 && previous === 0) {
		return (
			<span className="text-muted-foreground text-xs">
				Same as {lastWeekDay} ({previousText})
			</span>
		);
	}

	// Last week had none, so there's no percentage to show.
	if (change === null) {
		return (
			<span
				className={`flex items-center gap-1 text-xs font-medium ${higherIsWorse ? "text-destructive" : "text-secondary"}`}
			>
				<Icon icon="ph:arrow-up-right-bold" width="12" />
				Up from {previousText}
				<span className="text-muted-foreground font-normal">{lastWeekDay}</span>
			</span>
		);
	}

	const isUp = change > 0;
	const isGood = change === 0 || (higherIsWorse ? !isUp : isUp);
	return (
		<span
			className={`flex items-center gap-1 text-xs font-medium ${isGood ? "text-secondary" : "text-destructive"}`}
		>
			<Icon icon={isUp ? "ph:arrow-up-right-bold" : "ph:arrow-down-right-bold"} width="12" />
			{isUp ? "+" : ""}
			{change}%
			<span className="text-muted-foreground font-normal">
				vs {previousText} {lastWeekDay}
			</span>
		</span>
	);
}

const lastWeekDayLabel = (generatedAt: string) =>
	`last ${new Date(generatedAt).toLocaleDateString("en-NG", {
		weekday: "long",
		timeZone: "Africa/Lagos",
	})}`;

const buildCards = (
	today: OpsWindowStats,
	lastWeek: OpsWindowStats,
	change: OpsChange,
	trend: OpsTrendPoint[],
): Card[] => [
	{
		label: "Orders today",
		icon: "ph:shopping-bag-fill",
		value: today.orders.toLocaleString(),
		change: change.orders,
		current: today.orders,
		previous: lastWeek.orders,
		previousText: lastWeek.orders.toLocaleString(),
		series: trend.map((point) => point.orders),
	},
	{
		label: "Delivered value",
		icon: "ph:wallet-fill",
		value: naira.format(today.gmv),
		change: change.gmv,
		current: today.gmv,
		previous: lastWeek.gmv,
		previousText: naira.format(lastWeek.gmv),
		series: trend.map((point) => point.gmv),
	},
	{
		label: "Delivered",
		icon: "ph:check-circle-fill",
		value: today.delivered.toLocaleString(),
		change: change.delivered,
		current: today.delivered,
		previous: lastWeek.delivered,
		previousText: lastWeek.delivered.toLocaleString(),
		footnote:
			today.avgDeliveryMinutes === null
				? undefined
				: `Avg ${today.avgDeliveryMinutes} min to deliver`,
		series: trend.map((point) => point.delivered),
	},
	{
		label: "Cancelled",
		icon: "ph:x-circle-fill",
		value: today.cancelled.toLocaleString(),
		change: change.cancelled,
		current: today.cancelled,
		previous: lastWeek.cancelled,
		previousText: lastWeek.cancelled.toLocaleString(),
		higherIsWorse: true,
		series: trend.map((point) => point.cancelled),
	},
];

export default function OpsKpiStrip() {
	const { data, isLoading, isError } = useOpsKpis();
	const kpis = data?.data;

	if (isError) {
		return (
			<div className="border-border/50 text-muted-foreground rounded-[20px] border bg-white p-5 text-sm shadow-sm">
				Today&apos;s figures couldn&apos;t be loaded. They&apos;ll retry automatically.
			</div>
		);
	}

	const lastWeekDay = kpis ? lastWeekDayLabel(kpis.generatedAt) : "";
	const cards = kpis ? buildCards(kpis.today, kpis.lastWeek, kpis.change, kpis.trend) : [];

	return (
		<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
			{isLoading || !kpis
				? [0, 1, 2, 3].map((key) => (
						<Skeleton key={key} className="h-[132px] rounded-[20px]" />
					))
				: cards.map((card) => (
						<div
							key={card.label}
							className="border-border/50 flex flex-col gap-3 rounded-[20px] border bg-white p-5 shadow-sm"
						>
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
									<Icon icon={card.icon} className="text-secondary" width="18" />
									{card.label}
								</span>
								<span
									className={
										card.higherIsWorse
											? "text-destructive/70"
											: "text-secondary/70"
									}
								>
									<Sparkline values={card.series} />
								</span>
							</div>
							<h2 className="text-foreground text-3xl font-bold tabular-nums">
								{card.value}
							</h2>
							<div className="flex flex-wrap items-center justify-between gap-2">
								<ChangeLabel card={card} lastWeekDay={lastWeekDay} />
								{card.footnote && (
									<span className="text-muted-foreground text-xs">
										{card.footnote}
									</span>
								)}
							</div>
						</div>
					))}
		</div>
	);
}
