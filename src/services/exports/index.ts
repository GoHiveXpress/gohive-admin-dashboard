// CSV downloads built on the server from everything matching the filters,
// not just the page on screen. Each one is recorded in the audit log.
import axiosInstance from "@/lib/axiosInstance";

export type ExportDataset = "orders" | "transactions";

export type ExportParams = Record<string, string | undefined>;

export interface ExportResult {
	filename: string;
	rows: number | null;
}

const filenameFrom = (header: unknown, fallback: string) => {
	const match = typeof header === "string" ? /filename="?([^";]+)"?/.exec(header) : null;
	return match?.[1] ?? fallback;
};

// A failed export comes back as a Blob too; read its JSON message.
const errorMessage = async (error: unknown) => {
	const data = (error as { response?: { data?: unknown } }).response?.data;
	if (data instanceof Blob) {
		try {
			const body = JSON.parse(await data.text()) as { message?: string };
			if (body.message) return body.message;
		} catch {
			// Not JSON; fall through to the generic message
		}
	}
	return "The export failed. Try again.";
};

const saveFile = (blob: Blob, filename: string) => {
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	link.remove();
	URL.revokeObjectURL(url);
};

export const exportsApi = {
	download: async (dataset: ExportDataset, params: ExportParams = {}): Promise<ExportResult> => {
		const query = Object.fromEntries(
			Object.entries(params).filter(([, value]) => value !== undefined && value !== ""),
		);
		try {
			const response = await axiosInstance.get<Blob>(`/admin/exports/${dataset}`, {
				params: query,
				responseType: "blob",
			});
			const filename = filenameFrom(
				response.headers["content-disposition"],
				`${dataset}.csv`,
			);
			saveFile(response.data, filename);
			const rows = Number(response.headers["x-total-rows"]);
			return { filename, rows: Number.isFinite(rows) ? rows : null };
		} catch (error) {
			throw new Error(await errorMessage(error));
		}
	},
};
