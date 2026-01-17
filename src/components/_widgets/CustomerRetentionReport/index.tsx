"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Jan', value: 30 },
    { name: 'Feb', value: 45 },
    { name: 'Mar', value: 42 },
    { name: 'Apr', value: 38 },
    { name: 'May', value: 46 },
    { name: 'June', value: 38 },
    { name: 'July', value: 55 },
    { name: 'Aug', value: 38 },
    { name: 'Sept', value: 35 }, // Drop off point
    { name: 'Oct', value: 32 },
    { name: 'Nov', value: 40 },
    { name: 'Dec', value: 25 },
];

export default function CustomerRetentionReport() {
  return (
    <div className="bg-white rounded-[20px] p-6 shadow-sm border border-border mt-6">
      <div className="flex items-center gap-2 mb-8">
            <Icon icon="ph:circle-fill" className="text-primary w-4 h-4" />
            <h3 className="text-xl font-medium">Customer Retention</h3>
      </div>

      <div className="grid grid-cols-12 gap-8">
          {/* Left Stats Column */}
          <div className="col-span-12 lg:col-span-2 space-y-8 border-r border-border pr-6">
              <div>
                  <h4 className="text-base text-foreground font-medium mb-1">Churn Rate</h4>
                  <p className="text-4xl font-bold text-foreground">12%</p>
              </div>
              <div>
                  <h4 className="text-base text-foreground font-medium mb-1">Return Rate</h4>
                  <p className="text-4xl font-bold text-foreground">17%</p>
              </div>
              <div>
                  <h4 className="text-base text-foreground font-medium mb-1">Repeat Order</h4>
                  <p className="text-4xl font-bold text-foreground">8%</p>
              </div>
          </div>

          {/* Right Chart Column */}
          <div className="col-span-12 lg:col-span-10">
               <div className="flex flex-wrap justify-between items-center mb-6">
                    <h3 className="text-xl font-medium">Retention over time</h3>
                    <div className="flex items-center gap-3">
                         <div className="bg-muted/30 p-1 rounded-full flex">
                             <Button className="h-8 rounded-full bg-secondary text-white text-xs px-4">New</Button>
                             <Button variant="ghost" className="h-8 rounded-full text-muted-foreground text-xs px-4">Returning</Button>
                         </div>
                         <Button variant="outline" size="icon" className="h-9 w-9"><Icon icon="lucide:sliders-horizontal" className="w-4 h-4" /></Button>
                         <Button variant="outline" className="h-9 text-sm">Time <Icon icon="lucide:chevron-down" className="ml-2 w-3 h-3" /></Button>
                         <Button variant="outline" className="h-9 text-sm">Location <Icon icon="lucide:chevron-down" className="ml-2 w-3 h-3" /></Button>
                         <Button variant="outline" className="h-9 text-sm">City <Icon icon="lucide:chevron-down" className="ml-2 w-3 h-3" /></Button>
                    </div>
               </div>

               <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} tickFormatter={(value) => `${value}%`} domain={[0, 100]} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            {/* Annotation simulated as a dot */}
                            <Line 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#F58A20" 
                                strokeWidth={2} 
                                dot={(props) => {
                                    if (props.payload.name === 'Sept') return <circle cx={props.cx} cy={props.cy} r={6} fill="#EF4444" stroke="white" strokeWidth={2} />;
                                    return <></>;
                                }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
               </div>

               <div className="flex flex-wrap gap-4 mt-6">
                   <Button className="bg-secondary hover:bg-secondary/90 text-white h-11 px-6 rounded-lg font-medium">Retention by city or campaign</Button>
                   <Button className="bg-[#EF4444] hover:bg-[#EF4444]/90 text-white h-11 px-6 rounded-lg font-medium">Trigger Re-engagement Campaign</Button>
                   <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-11 px-6 rounded-lg font-medium">Flag Drop-off Zone</Button>
               </div>
          </div>
      </div>
    </div>
  );
}