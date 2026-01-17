"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import ProfileSettingsTab from "./ProfileSettingsTab";
import RoleSettingsTab from "./RoleSettingsTab";
import AppConfigSettingsTab from "./AppConfigSettingsTab";
import NotificationSettingsTab from "./NotificationSettingsTab";
import OthersSettingsTab from "./OthersSettingsTab";

const TABS = [
  { id: "profile", label: "Profile" },
  { id: "role", label: "Role Management" },
  { id: "app-config", label: "App Configuration" },
  { id: "notification", label: "Notification Templates" },
  { id: "others", label: "Others" },
];

export default function SettingsMain() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="flex flex-col h-full w-full gap-8">
      
      {/* 
        Main Tabs - Styling explicitly to match the Green Active State in Screenshots 
        Using bg-secondary for active state as seen in the UI.
      */}
      <div className="bg-gray-50/80 rounded-[20px] p-1.5 w-full md:w-fit flex flex-wrap items-center gap-1">
        {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
                <Button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    variant="ghost"
                    className={`
                        rounded-2xl px-6 h-12 text-base font-medium transition-all duration-200
                        ${isActive 
                            ? "bg-secondary text-white hover:bg-secondary/90 shadow-sm" 
                            : "bg-transparent text-foreground hover:bg-accent"
                        }
                    `}
                >
                    {tab.label}
                </Button>
            );
        })}
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-0">
        {activeTab === "profile" && <ProfileSettingsTab />}
        {activeTab === "role" && <RoleSettingsTab />}
        {activeTab === "app-config" && <AppConfigSettingsTab />}
        {activeTab === "notification" && <NotificationSettingsTab />}
        {activeTab === "others" && <OthersSettingsTab />}
      </div>
    </div>
  );
}