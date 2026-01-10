"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";
import { Icon } from "@iconify/react";

const data = [
  { name: 'Customers', value: 1603, color: 'hsl(var(--secondary))' },
  { name: 'Riders', value: 547, color: 'hsl(var(--primary))' },
  { name: 'Vendors', value: 200, color: 'hsl(var(--destructive))' },
];

export default function TotalUsers() {
  return (
    <div className="bg-white rounded-[20px] p-6 shadow-sm border border-border/50 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Icon icon="ph:chart-pie-slice-fill" className="text-primary" width="20" />
        <h3 className="text-xl font-bold text-foreground">Total Users</h3>
      </div>

      <div className="flex-1 min-h-[220px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <Label
                value="2350"
                position="centerBottom"
                className="fill-foreground text-3xl font-bold"
                dy={-5}
              />
              <Label
                value="Total Users"
                position="centerTop"
                className="fill-muted-foreground text-xs font-medium"
                dy={15}
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-2">
        {data.map((item, index) => (
            <div key={index} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-medium text-foreground">{item.name}</span>
            </div>
        ))}
      </div>
    </div>
  );
}