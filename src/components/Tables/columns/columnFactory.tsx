//src/components/Tables/columns/columnFactory.tsx
import { ColumnDef } from "@tanstack/react-table";
import { BaseColumnSchema } from "../types";

export function getColumns<TData>(
  config: BaseColumnSchema<TData>[]
): ColumnDef<TData, any>[] {
  return config.map((col) => {
    const baseCol: ColumnDef<TData, any> = {
      accessorKey: col.key as string,
      header: col.header,
      cell: ({ row, getValue }) => {
        if (col.render) return col.render(row.original);
        return getValue() as React.ReactNode;
      },
    };
    return baseCol;
  });
}