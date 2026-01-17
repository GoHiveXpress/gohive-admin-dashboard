"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export default function RefundLogTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* === LEFT COLUMN: Refund Logs List === */}
      <div className="lg:col-span-7 bg-white rounded-[20px] p-6 shadow-sm border border-border">
         <h2 className="text-xl font-medium mb-6">Refund Logs</h2>
         
         {/* Filters */}
         <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="relative w-full sm:w-[200px]">
               <Icon icon="lucide:search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
               <Input placeholder="Search" className="pl-9 h-10 rounded-lg border-border bg-transparent" />
            </div>

            <Button variant="outline" size="icon" className="h-10 w-10 border-border bg-transparent">
               <Icon icon="lucide:sliders-horizontal" className="w-4 h-4" />
            </Button>

            <Button className="h-10 bg-accent hover:bg-accent/90 text-white px-6 rounded-lg">All</Button>

            <Button variant="outline" className="h-10 border-border bg-transparent px-4 rounded-lg flex items-center gap-2 text-sm font-medium">
               status <Icon icon="lucide:chevron-down" className="w-4 h-4" />
            </Button>
         </div>

         {/* Simple Custom Table for Refund Log */}
         <div className="border-t border-border">
             <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-border">
                        <TableHead className="w-[140px] text-xs uppercase text-foreground font-medium">Order ID</TableHead>
                        <TableHead className="text-xs uppercase text-foreground font-medium">Status</TableHead>
                        <TableHead className="text-xs uppercase text-foreground font-medium">Reason</TableHead>
                        <TableHead className="text-right text-xs uppercase text-foreground font-medium">Refund</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* Row 1 */}
                    <TableRow className="border-b border-border/50 h-14">
                        <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full border-2 border-primary" />
                                <span className="text-xs text-muted-foreground">Order ID</span>
                                <span className="text-xs border border-border rounded px-1">#12345</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-accent font-medium text-xs">Processing</TableCell>
                        <TableCell className="text-sm">Wrong item received</TableCell>
                        <TableCell className="text-right text-accent font-medium">₦3000</TableCell>
                    </TableRow>
                     {/* Row 2 */}
                     <TableRow className="border-b border-border/50 h-14">
                        <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full border-2 border-primary" />
                                <span className="text-xs text-muted-foreground">Order ID</span>
                                <span className="text-xs border border-border rounded px-1">#12345</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-secondary font-medium text-xs">Approved</TableCell>
                        <TableCell className="text-sm">Delivery delay</TableCell>
                        <TableCell className="text-right text-secondary font-medium">₦3000</TableCell>
                    </TableRow>
                     {/* Row 3 */}
                     <TableRow className="border-b border-border/50 h-14">
                        <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full border-2 border-primary" />
                                <span className="text-xs text-muted-foreground">Order ID</span>
                                <span className="text-xs border border-border rounded px-1">#12345</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-primary font-medium text-xs">Pending</TableCell>
                        <TableCell className="text-sm">Incorrect charge</TableCell>
                        <TableCell className="text-right text-primary font-medium">₦3000</TableCell>
                    </TableRow>
                </TableBody>
             </Table>
         </div>

         {/* Footer */}
         <div className="mt-8 pt-4">
                <div className="flex items-center gap-2 mb-2 text-sm font-medium text-foreground">
                    <Icon icon="lucide:download" className="w-4 h-4" />
                    Download Refund Logs
                </div>
                <div className="flex gap-3">
                    <Button className="bg-secondary hover:bg-secondary/90 text-white w-20">PDF</Button>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-20">CVS</Button>
                </div>
            </div>
      </div>

      {/* === RIGHT COLUMN: Details & Action === */}
      <div className="lg:col-span-5 space-y-6">
         
         {/* Order Summary Card */}
         <div className="bg-white rounded-[20px] p-6 shadow-sm border border-border">
            <div className="flex items-center gap-2 mb-6">
                 <div className="w-4 h-4 rounded-full border-[3px] border-primary" />
                 <h3 className="text-lg font-semibold">Order Summary</h3>
            </div>

            {/* Header info */}
            <div className="flex justify-between items-center mb-4 text-sm">
                <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Order ID</span>
                    <span className="border border-border rounded px-2 py-0.5 text-xs bg-muted/20">#12345</span>
                </div>
                <span className="text-xs text-muted-foreground font-medium">02 Nov 2025 | 7:45 PM</span>
            </div>

            {/* IDs */}
            <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm">
                    <Icon icon="lucide:smile" className="text-secondary w-4 h-4" />
                    <span className="text-muted-foreground text-xs w-16">Customer ID</span>
                    <span className="border border-border rounded px-2 py-0.5 text-[10px]">CHV12345</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Icon icon="lucide:store" className="text-secondary w-4 h-4" />
                    <span className="text-muted-foreground text-xs w-16">Vendor ID</span>
                    <span className="border border-border rounded px-2 py-0.5 text-[10px]">VHV12345</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Icon icon="lucide:bike" className="text-secondary w-4 h-4" />
                    <span className="text-muted-foreground text-xs w-16">Rider ID</span>
                    <span className="border border-border rounded px-2 py-0.5 text-[10px]">RHV12345</span>
                </div>
            </div>

            {/* Items */}
            <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex justify-between text-sm font-semibold">
                    <span>1 X Mixed Rice with Chicken</span>
                    <span>₦3,000</span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                    <span>1 X Fanta 50cl</span>
                    <span>₦500</span>
                </div>
            </div>

            {/* Calculations */}
            <div className="space-y-2 pt-4 border-t border-border mt-4">
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Restaurant packaging</span>
                    <span>#100</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Service charge</span>
                    <span>#500</span>
                </div>
            </div>
             
             {/* Total */}
             <div className="flex justify-between items-center pt-4 mt-2">
                 <div className="flex items-center gap-1 text-muted-foreground text-sm">
                     Total bill: <Icon icon="lucide:chevron-up" className="w-3 h-3" />
                 </div>
                 <span className="font-bold text-lg">₦4,100</span>
             </div>
         </div>

         {/* Process Refund Form Card */}
         <div className="bg-white rounded-[20px] p-6 shadow-sm border border-border">
             <div className="flex items-center gap-2 mb-6">
                 <div className="w-4 h-4 rounded-full border-[3px] border-primary" />
                 <h3 className="text-lg font-semibold">Process Refund</h3>
            </div>

            <div className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium">Order ID</label>
                    <Input defaultValue="#12345" className="h-11 bg-white border-border" />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium">Reason</label>
                    <Select>
                        <SelectTrigger className="h-11 bg-white border-border">
                            <SelectValue placeholder="Select reason" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="wrong_item">Wrong item received</SelectItem>
                            <SelectItem value="delayed">Delivery delay</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium">Amount</label>
                    <Input defaultValue="₦4,100" className="h-11 bg-white border-border" />
                </div>

                <Button className="w-full h-11 bg-secondary hover:bg-secondary/90 text-white font-medium text-base mt-2">
                    Process
                </Button>
            </div>
         </div>

      </div>
    </div>
  );
}