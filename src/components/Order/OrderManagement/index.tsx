"use client";

import React from "react";
import { Icon } from "@iconify/react";
import {
  OrderListItem,
  TimelineActor,
  StatusCheck,
  PanelHeader,
} from "@/components/_atoms/OrderAtoms"; 

// Shadcn UI components (Assuming standard installation paths)
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const OrderManagement = () => {
  return (
    <div className="w-full h-full p-6 space-y-6 bg-background">
      {/* --- Top Header with Icon --- */}
      <div className="flex items-center gap-3 mb-6">
        <Icon
          icon="heroicons:clipboard-document-list"
          className="text-secondary w-8 h-8"
        />
        <h1 className="text-2xl font-bold text-foreground">
          Order Lifecycle Management
        </h1>
      </div>

      {/* --- Filter Bar --- */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative w-64">
          <Icon
            icon="lucide:search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4"
          />
          <Input
            placeholder="Search"
            className="pl-9 bg-card border-border h-10"
          />
        </div>

        {/* Filter Button */}
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 border-border bg-card text-foreground"
        >
          <Icon icon="lucide:sliders-horizontal" className="w-4 h-4" />
        </Button>

        {/* Status Pills */}
        <Button className="h-10 bg-accent hover:bg-accent/90 text-white px-6">
          All
        </Button>

        {/* Dropdowns / Buttons */}
        {["Status", "Customer", "Vendor", "Rider"].map((item) => (
          <Button
            key={item}
            variant="outline"
            className="h-10 border-border bg-card text-foreground px-4 flex gap-2"
          >
            {item}
            {item === "Status" && (
              <Icon icon="lucide:chevron-down" className="w-4 h-4" />
            )}
          </Button>
        ))}
      </div>

      {/* --- Main Content Grid --- */}
      <div className="mt-8">
        <h2 className="text-xl font-medium mb-4 text-foreground">
          Order Timeline View
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* === COLUMN 1: ORDER LIST (Left Sidebar) === */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            {/* Header */}
            <div className="bg-secondary text-secondary-foreground rounded-lg p-3 flex items-center gap-2 mb-1">
              <Icon icon="heroicons:document-text" className="w-5 h-5" />
              <span className="font-semibold">Orders (7)</span>
            </div>

            {/* List */}
            <OrderListItem orderId="95345" statusColor="yellow" />
            <OrderListItem orderId="28345" statusColor="yellow" />
            <OrderListItem orderId="12346" statusColor="red" />
            <OrderListItem orderId="12379" statusColor="red" />
            <OrderListItem orderId="12379" statusColor="red" />
            <OrderListItem orderId="12379" statusColor="red" />
            <OrderListItem orderId="12379" statusColor="red" />
          </div>

          {/* === COLUMN 2: TIMELINE DETAILS (Middle) === */}
          <div className="lg:col-span-5 bg-card border border-border rounded-xl p-6 shadow-sm">
            {/* Order Header */}
            <div className="flex items-center justify-between bg-orange-50 dark:bg-accent/10 p-3 rounded-lg mb-8 border border-accent/20">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span className="font-semibold text-foreground">
                  Order ID: #12345
                </span>
              </div>
              <Icon
                icon="lucide:copy"
                className="text-muted-foreground w-4 h-4 cursor-pointer hover:text-foreground"
              />
            </div>

            {/* Actors Timeline */}
            <div className="mb-8 pl-2">
              <TimelineActor
                name="Paul Paul"
                role="Customer"
                idLabel="Customer ID Number"
                idValue="RGHV0923"
                time="11:30 PM"
              />
              <TimelineActor
                name="Item7 Go"
                role="Vendor"
                idLabel="Vendor ID Number"
                idValue="RGHV0923"
                time="11:32 PM"
              />
              <TimelineActor
                name="James James"
                role="Rider"
                idLabel="Rider's ID Number"
                idValue="RGHV0923"
                time="11:50 PM"
                isLast
              />
            </div>

            {/* Status Steps */}
            <div className="space-y-3">
              <StatusCheck label="Order Placed" isChecked />
              <StatusCheck label="Order Accepted" isChecked />
              <StatusCheck label="Picked Up" isChecked />
              <StatusCheck label="Delivered" isChecked />
            </div>
          </div>

          {/* === COLUMN 3: ACTION PANELS (Right) === */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Panel 1: Dispute Resolution */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <PanelHeader title="Dispute Resolution Panel" />
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Reason</label>
                  <div className="relative">
                     {/* Simulating a Select Box to match design */}
                    <div className="flex items-center justify-between w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background text-muted-foreground">
                      Incorrect item received
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Notes</label>
                  <Textarea 
                    placeholder="Add notes" 
                    className="min-h-[100px] resize-none bg-transparent"
                  />
                </div>

                <Button className="w-full bg-secondary hover:bg-secondary/90 text-white font-medium h-11 text-base">
                  Resolve
                </Button>
              </div>
            </div>

            {/* Panel 2: Refund & Adjustment */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <PanelHeader title="Refund & Adjustment panel" />
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Refund Amount</label>
                  <Input 
                    defaultValue="#3500" 
                    className="h-11 bg-transparent"
                  />
                </div>

                <Button className="w-full bg-secondary hover:bg-secondary/90 text-white font-medium h-11 text-base">
                  Process Refund
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;