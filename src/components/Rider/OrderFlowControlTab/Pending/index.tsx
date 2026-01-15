"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";

export default function PendingOrders() {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full min-h-[800px]">
            {/* =======================
                COLUMN 1 
               ======================= */}
            <div className="flex flex-col gap-6 h-full">
                
                {/* 1. ORDER QUEUE CARD */}
                <div className="bg-white border border-border/50 rounded-[20px] p-5 flex flex-col gap-4 flex-1">
                    <h3 className="flex items-center gap-2 font-bold text-lg text-foreground">
                        <Icon icon="ph:circle-notch-bold" className="text-primary w-6 h-6" />
                        Order Queue
                    </h3>

                    {/* Chart & Legend Section */}
                    <div className="bg-white rounded-xl border border-border/40 p-4 flex items-center justify-between">
                        <div className="space-y-2 text-xs font-medium text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" /> Delayed (2)
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#EAB308]" /> Pending (10)
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#84CC16]" /> En route (12)
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" /> Completed (50)
                            </div>
                        </div>
                        
                        {/* CSS Donut Chart */}
                        <div className="relative w-20 h-20 rounded-full" 
                             style={{ 
                                 background: 'conic-gradient(#22C55E 0% 55%, #84CC16 55% 70%, #EAB308 70% 85%, #EF4444 85% 100%)' 
                             }}>
                            <div className="absolute inset-2.5 bg-white rounded-full" />
                        </div>
                    </div>

                    {/* Order Cards List */}
                    <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar max-h-[400px]">
                        {/* Card 1: Delayed (Red) */}
                        <div className="bg-[#FFF1F2] border border-[#FECDD3] p-4 rounded-2xl space-y-3">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2 text-[#BE123C] font-semibold text-xs">
                                    <div className="w-2 h-2 rounded-full bg-[#BE123C]" />
                                    Order ID: #12345
                                </div>
                                <Icon icon="ph:copy" className="text-muted-foreground/70 w-4 h-4 cursor-pointer hover:text-foreground" />
                            </div>
                            <div className="text-xs space-y-1 text-foreground/80 font-medium">
                                <p>1 X Mixed Rice with Chicken</p>
                                <p>1 X Fanta 50cl</p>
                            </div>
                        </div>

                        {/* Card 2: Pending (Yellow) */}
                        <div className="bg-[#FEFCE8] border border-[#FEF08A] p-4 rounded-2xl space-y-3">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2 text-[#A16207] font-semibold text-xs">
                                    <div className="w-2 h-2 rounded-full bg-[#EAB308]" />
                                    Order ID: #12345
                                </div>
                                <Icon icon="ph:copy" className="text-muted-foreground/70 w-4 h-4 cursor-pointer hover:text-foreground" />
                            </div>
                            <div className="text-xs space-y-1 text-foreground/80 font-medium">
                                <p>1 X Mixed Rice with Chicken</p>
                                <p>1 X Fanta 50cl</p>
                            </div>
                        </div>

                        {/* Card 3: En Route/Orange (Orange) */}
                        <div className="bg-[#FFF7ED] border border-[#FFEDD5] p-4 rounded-2xl space-y-3">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2 text-[#C2410C] font-semibold text-xs">
                                    <div className="w-2 h-2 rounded-full bg-[#F97316]" />
                                    Order ID: #12345
                                </div>
                                <Icon icon="ph:copy" className="text-muted-foreground/70 w-4 h-4 cursor-pointer hover:text-foreground" />
                            </div>
                            <div className="text-xs space-y-1 text-foreground/80 font-medium">
                                <p>1 X Mixed Rice with Chicken</p>
                                <p>1 X Fanta 50cl</p>
                            </div>
                        </div>
                        
                         {/* Card 4: Cutoff simulation */}
                         <div className="bg-[#FFF1F2] border border-[#FECDD3] p-4 rounded-2xl opacity-50">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2 text-[#BE123C] font-semibold text-xs">
                                    <div className="w-2 h-2 rounded-full bg-[#BE123C]" />
                                    Order ID: #12345
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. SYSTEM ALERTS CARD */}
                <div className="bg-white border border-border/50 rounded-[20px] p-5 h-auto shrink-0">
                    <h3 className="flex items-center gap-2 font-bold text-lg text-foreground mb-4">
                        <Icon icon="ph:siren-fill" className="text-[#EF4444] w-6 h-6" />
                        System Alerts
                    </h3>
                    
                    <div className="space-y-0 divide-y divide-border/40">
                         <div className="flex items-center justify-between py-3 text-xs">
                             <div className="flex items-center gap-2 font-medium">
                                 <Icon icon="ph:warning-fill" className="text-[#EF4444] w-4 h-4" /> 
                                 Repeated Cancelation
                             </div>
                             <span className="text-muted-foreground">Rider - James James</span>
                             <button className="text-muted-foreground hover:text-foreground"><Icon icon="ph:dots-three-vertical-bold" /></button>
                         </div>
                         <div className="flex items-center justify-between py-3 text-xs">
                             <div className="flex items-center gap-2 font-medium">
                                 <Icon icon="ph:warning-fill" className="text-[#EAB308] w-4 h-4" /> 
                                 Oder delay - Order ID #1234
                             </div>
                             <span className="text-muted-foreground">Rider - James James</span>
                             <button className="text-muted-foreground hover:text-foreground"><Icon icon="ph:dots-three-vertical-bold" /></button>
                         </div>
                    </div>
                </div>
            </div>

            {/* =======================
                COLUMN 2: RIDER STATUS
               ======================= */}
            <div className="bg-white border border-border/50 rounded-[20px] p-5 flex flex-col gap-6 h-full">
                <h3 className="flex items-center gap-2 font-bold text-lg text-foreground">
                    <Icon icon="ph:circle-notch-bold" className="text-primary w-6 h-6" />
                    Rider Status
                </h3>

                {/* Status Stats Blocks */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-white border border-border/60 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-[#F97316]" />
                            <span className="text-sm font-medium">Online</span>
                        </div>
                        <span className="text-lg font-bold">15</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white border border-border/60 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
                            <span className="text-sm font-medium">Available</span>
                        </div>
                        <span className="text-lg font-bold">10</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white border border-border/60 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                            <span className="text-sm font-medium">Busy</span>
                        </div>
                        <span className="text-lg font-bold">5</span>
                    </div>
                </div>

                <div className="h-px bg-border/50 w-full" />

                {/* Active Riders List */}
                <div className="flex flex-col flex-1 overflow-hidden">
                    <h4 className="font-medium text-base mb-4">Active Riders List</h4>
                    <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                        {[
                            { name: "James James", id: "RGHV0923", status: "Available", color: "text-[#22C55E]", dot: "bg-[#22C55E]" },
                            { name: "Daniel Ade", id: "RGHV0824", status: "Available", color: "text-[#22C55E]", dot: "bg-[#22C55E]" },
                            { name: "John Gabriel", id: "RGHV0947", status: "Available", color: "text-[#22C55E]", dot: "bg-[#22C55E]" },
                            { name: "John Gabriel", id: "RGHV0947", status: "Available", color: "text-[#22C55E]", dot: "bg-[#22C55E]" },
                            { name: "John Gabriel", id: "RGHV0947", status: "Available", color: "text-[#22C55E]", dot: "bg-[#22C55E]" },
                        ].map((rider, i) => (
                            <div key={i} className="flex items-center justify-between p-3 border border-border/50 rounded-xl hover:bg-muted/30 transition-colors">
                                <div className="space-y-1">
                                    <p className="font-semibold text-sm">{rider.name}</p>
                                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                                        Status 
                                        <div className={`w-1.5 h-1.5 rounded-full ${rider.dot}`} /> 
                                        <span className="text-foreground">{rider.status}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-[10px] h-6 px-2 bg-white font-normal text-muted-foreground rounded-md border-border">
                                        {rider.id}
                                    </Badge>
                                    <Icon icon="ph:copy" className="text-[#22C55E] w-4 h-4 cursor-pointer" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* =======================
                COLUMN 3: LIVE MAP
               ======================= */}
            <div className="bg-white border border-border/50 rounded-[20px] p-5 flex flex-col gap-5 h-full">
                <h3 className="font-bold text-lg text-foreground">Live Map</h3>
                
                {/* Map Container */}
                <div className="relative flex-1 bg-[#EBF0F0] rounded-2xl overflow-hidden border border-border/50 min-h-[300px]">
                    <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-74.006,40.7128,14,0/800x600')] bg-cover bg-center opacity-80 mix-blend-multiply" />
                    
                    {/* Mock Overlay UI on Map */}
                    <div className="absolute top-10 right-10">
                         <div className="w-4 h-4 bg-[#22C55E] rounded-full border-2 border-white shadow-lg animate-pulse" />
                    </div>
                     <div className="absolute top-1/3 left-1/4">
                         <div className="w-4 h-4 bg-[#22C55E] rounded-full border-2 border-white shadow-lg" />
                    </div>
                     <div className="absolute bottom-1/3 left-1/2 flex flex-col items-center">
                         <div className="bg-[#EF4444] text-white text-[10px] px-2 py-0.5 rounded-full shadow-md mb-1 whitespace-nowrap">Avalon Hotel</div>
                         <div className="w-6 h-6 bg-[#EF4444] rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                            <Icon icon="ph:house-fill" className="text-white w-3 h-3" />
                         </div>
                    </div>
                     <div className="absolute top-1/2 right-1/4 flex flex-col items-center">
                         <div className="bg-[#F97316] text-white text-[10px] px-2 py-0.5 rounded-full shadow-md mb-1 whitespace-nowrap">Shawarma place</div>
                         <div className="w-6 h-6 bg-[#F97316] rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                             <Icon icon="ph:fork-knife-fill" className="text-white w-3 h-3" />
                         </div>
                    </div>
                </div>

                {/* Selection Details */}
                <div className="space-y-4">
                    <div className="space-y-3">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-foreground">Order ID</label>
                            <div className="border border-border rounded-xl h-11 px-4 flex items-center text-sm bg-white text-muted-foreground">
                                #12345
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-foreground">Rider’s ID</label>
                            <div className="border border-border rounded-xl h-11 px-4 flex items-center text-sm bg-white text-muted-foreground">
                                RGHV0923
                            </div>
                        </div>
                    </div>

                    {/* Selected Rider Card */}
                    <div className="bg-white rounded-xl p-0 space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-base">James James</span>
                                    <Badge variant="outline" className="text-[10px] bg-white font-normal text-muted-foreground h-5">RGHV0923</Badge>
                                </div>
                                <p className="text-[11px] font-medium text-muted-foreground">Current Location: 1.5km from Vendor</p>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center gap-1.5 justify-end text-xs font-medium mb-1">
                                    Status <div className="w-2 h-2 rounded-full bg-[#22C55E]" /> Available
                                </div>
                                <p className="text-[11px] font-medium text-muted-foreground">ETA Customer (12 min)</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <Button className="bg-[#43A149] hover:bg-[#43A149]/90 text-white rounded-lg h-11 text-sm font-medium shadow-sm">
                                Assign
                            </Button>
                            <Button className="bg-[#4B5563] hover:bg-[#4B5563]/90 text-white rounded-lg h-11 text-sm font-medium shadow-sm">
                                Contact Rider
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}