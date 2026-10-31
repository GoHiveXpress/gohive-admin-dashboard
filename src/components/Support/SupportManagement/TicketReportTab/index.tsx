"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTicketReport } from "@/hooks/supportManagement";
import {
	TICKET_PRIORITY_LABELS,
	TICKET_RESOLUTION_LABELS,
	categoryLabel,
	formatDuration,
	toDateInput,
} from "@/lib/supportTickets";

const DAY_MS = 24 * 60 * 60 * 1000;

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
	return (
		<div className="bg-card border-border rounded-xl border p-4">
			<p className="text-muted-foreground text-sm">{label}</p>
			<p className="text-foreground mt-1 text-2xl font-semibold">{value}</p>
			{hint && <p className="text-muted-foreground mt-1 text-xs">{hint}</p>}
		</div>
	);
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<section className="bg-card border-border rounded-xl border p-4">
			<h3 className="text-foreground mb-3 font-semibold">{title}</h3>
			{children}
		</section>
	);
}

const Empty = () => <p className="text-muted-foreground text-sm">No tickets in this period.</p>;

/**
 * How support is doing over a period: how fast tickets are answered and resolved,
 * the most common complaints, how tickets end, and each agent's numbers.
 */
export default function TicketReportTab() {
	const [from, setFrom] = useState(() => toDateInput(new Date(Date.now() - 30 * DAY_MS)));
	const [to, setTo] = useState(() => toDateInput(new Date()));
	const rangeValid = !!from && !!to && from <= to;
	const { data, isLoading, isError } = useTicketReport(rangeValid ? { from, to } : {});
	const report = data?.data;

	let body: React.ReactNode;
	if (isLoading) {
		body = (
			<div className="flex justify-center py-10">
				<Loader2 className="text-secondary animate-spin" />
			</div>
		);
	} else if (isError || !report) {
		body = <p className="text-destructive text-sm">Couldn&apos;t load the report.</p>;
	} else {
		const { totals } = report;
		const maxCategory = Math.max(1, ...report.byCategory.map((row) => row.count));
		body = (
			<div className="space-y-4">
				<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
					<Stat label="Tickets opened" value={String(totals.opened)} />
					<Stat
						label="Resolved"
						value={String(totals.resolved)}
						hint={
							totals.opened
								? `${Math.round((totals.resolved / totals.opened) * 100)}% of tickets`
								: undefined
						}
					/>
					<Stat
						label="First reply (median)"
						value={formatDuration(report.firstResponse.medianMs)}
						hint={`Average ${formatDuration(report.firstResponse.averageMs)} · ${totals.neverAnswered} never answered`}
					/>
					<Stat
						label="Time to resolve (median)"
						value={formatDuration(report.resolution.medianMs)}
						hint={`Average ${formatDuration(report.resolution.averageMs)}`}
					/>
				</div>

				<div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
					<Panel title="Most common complaints">
						{report.byCategory.length === 0 ? (
							<Empty />
						) : (
							<ul className="space-y-2">
								{report.byCategory.map((row) => (
									<li key={row.category} className="space-y-1 text-sm">
										<div className="flex justify-between gap-2">
											<span className="font-medium">
												{categoryLabel(row.category)}
											</span>
											<span className="text-muted-foreground">
												{row.count} · {row.resolved} resolved · median{" "}
												{formatDuration(row.medianResolutionMs)}
											</span>
										</div>
										<div className="bg-muted h-2 rounded-full">
											<div
												className="bg-primary h-2 rounded-full"
												style={{
													width: `${(row.count / maxCategory) * 100}%`,
												}}
											/>
										</div>
									</li>
								))}
							</ul>
						)}
					</Panel>

					<Panel title="How tickets were resolved">
						{report.byResolution.length === 0 ? (
							<Empty />
						) : (
							<ul className="space-y-1 text-sm">
								{report.byResolution.map((row) => (
									<li key={row.resolution} className="flex justify-between">
										<span>{TICKET_RESOLUTION_LABELS[row.resolution]}</span>
										<span className="text-muted-foreground">{row.count}</span>
									</li>
								))}
							</ul>
						)}
						<h4 className="text-foreground mb-2 mt-4 text-sm font-semibold">
							By priority
						</h4>
						<ul className="space-y-1 text-sm">
							{report.byPriority.map((row) => (
								<li key={row.priority} className="flex justify-between">
									<span>{TICKET_PRIORITY_LABELS[row.priority]}</span>
									<span className="text-muted-foreground">{row.count}</span>
								</li>
							))}
						</ul>
					</Panel>
				</div>

				<Panel title="Agents">
					{report.agents.length === 0 ? (
						<Empty />
					) : (
						<div className="overflow-x-auto">
							<table className="w-full text-left text-sm">
								<thead className="text-muted-foreground">
									<tr>
										<th className="py-2 pr-4 font-medium">Agent</th>
										<th className="py-2 pr-4 font-medium">Handled</th>
										<th className="py-2 pr-4 font-medium">Resolved</th>
										<th className="py-2 font-medium">First reply (median)</th>
									</tr>
								</thead>
								<tbody>
									{report.agents.map((agent) => (
										<tr key={agent.agentId} className="border-border border-t">
											<td className="py-2 pr-4">{agent.name}</td>
											<td className="py-2 pr-4">{agent.handled}</td>
											<td className="py-2 pr-4">{agent.resolved}</td>
											<td className="py-2">
												{formatDuration(agent.medianFirstResponseMs)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</Panel>

				{report.truncated && (
					<p className="text-muted-foreground text-xs">
						This period has too many tickets to count them all; the newest 20,000 are
						shown. Pick a shorter period.
					</p>
				)}
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-end gap-3">
				<div className="space-y-1">
					<Label htmlFor="report-from">From</Label>
					<Input
						id="report-from"
						type="date"
						value={from}
						max={to}
						onChange={(event) => setFrom(event.target.value)}
					/>
				</div>
				<div className="space-y-1">
					<Label htmlFor="report-to">To</Label>
					<Input
						id="report-to"
						type="date"
						value={to}
						min={from}
						onChange={(event) => setTo(event.target.value)}
					/>
				</div>
				<p className="text-muted-foreground pb-2 text-xs">
					Tickets opened in this period. Response time runs from when the user asked for
					an agent.
				</p>
			</div>
			{!rangeValid && (
				<p className="text-destructive text-sm">
					The start date must be before the end date.
				</p>
			)}
			{body}
		</div>
	);
}
