"use client"

import { MapPin, MessageSquare, Search, FileInput, FileOutput } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navItems = [
    { id: "chat", label: "Chat Assistant", icon: MessageSquare },
    { id: "lost-items", label: "Lost Items", icon: FileInput },
    { id: "found-items", label: "Found Items", icon: FileOutput },
    { id: "search", label: "Search Items", icon: Search },
  ]

  const recentItems = [
    { id: "1", title: "Lost Smartphone - iPhone 13", type: "lost" },
    { id: "2", title: "Found Keys - Main Building", type: "found" },
  ]

  return (
    <div className="w-64 border-r bg-muted/10 flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          <span className="font-semibold">LostFound AI</span>
        </div>
      </div>

      <nav className="p-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm",
              activeTab === item.id ? "bg-accent text-accent-foreground" : "hover:bg-muted text-muted-foreground",
            )}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto p-4 border-t">
        <h3 className="text-xs font-medium text-muted-foreground mb-2">RECENT ITEMS</h3>
        <div className="space-y-1">
          {recentItems.map((item) => (
            <button key={item.id} className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-muted">
              {item.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
