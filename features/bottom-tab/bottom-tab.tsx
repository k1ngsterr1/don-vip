"use client";

import { useState } from "react";
import { Home, Search, User, MessageCircle } from "lucide-react";

export default function BottomTab() {
  const [activeTab, setActiveTab] = useState("home");

  const tabs = [
    { id: "home", icon: Home },
    { id: "search", icon: Search },
    { id: "profile", icon: User },
  ];

  return (
    <div className="fixed bottom-0 h-[64px] px-[60px] flex items-center justify-center w-full left-0 right-0 bg-[#F3F4F7] border-t border-gray-200 py-2">
      <div className="flex  w-full justify-between items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`flex flex-col items-center ${
                activeTab === tab.id ? "text-blue-500" : "text-gray-500"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={24} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
