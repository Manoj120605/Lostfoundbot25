"use client"

import { useState } from "react"
import { Moon, Sun, RefreshCw, Plus } from "lucide-react"
import { useTheme } from "next-themes"
import ChatInterface from "@/components/chat-interface"
import Sidebar from "@/components/sidebar"
import DetailsPanel from "@/components/details-panel"
import UserProfile from "@/components/user-profile"
import ReportLostItemModal from "@/components/report-lost-item-modal"
import ReportFoundItemModal from "@/components/report-found-item-modal"
import { Button } from "@/components/ui/button"
import LostItemsList from "@/components/lost-items-list"
import FoundItemsList from "@/components/found-items-list"
import SearchItemsInterface from "@/components/search-items-interface"

export default function LostFoundInterface() {
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("chat")
  const [isLostItemModalOpen, setIsLostItemModalOpen] = useState(false)
  const [isFoundItemModalOpen, setIsFoundItemModalOpen] = useState(false)

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleReportItem = () => {
    if (activeTab === "lost-items") {
      setIsLostItemModalOpen(true)
    } else if (activeTab === "found-items") {
      setIsFoundItemModalOpen(true)
    }
  }

  const getHeaderTitle = () => {
    switch (activeTab) {
      case "chat":
        return "LostFound Assistant"
      case "lost-items":
        return "Lost Items"
      case "found-items":
        return "Found Items"
      case "search":
        return "Search Items"
      default:
        return "LostFound AI"
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-14 border-b px-4 flex items-center justify-between">
          <h1 className="text-lg font-medium">{getHeaderTitle()}</h1>
          <div className="flex items-center gap-2">
            {(activeTab === "lost-items" || activeTab === "found-items") && (
              <Button onClick={handleReportItem} className="gap-1">
                <Plus className="h-4 w-4" />
                Report Item
              </Button>
            )}
            <button
              onClick={toggleTheme}
              className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted">
              <RefreshCw size={18} />
            </button>
          </div>
        </header>

        {/* Content based on active tab */}
        <div className="flex-1 flex">
          <div className="flex-1 flex flex-col">
            {activeTab === "chat" && <ChatInterface />}
            {activeTab === "lost-items" && <LostItemsList />}
            {activeTab === "found-items" && <FoundItemsList />}
            {activeTab === "search" && <SearchItemsInterface />}
          </div>

          {/* Right Panel */}
          <DetailsPanel />
        </div>

        {/* User Profile */}
        <UserProfile name="Guest User" email="guest@example.com" />
      </div>

      {/* Modals */}
      <ReportLostItemModal isOpen={isLostItemModalOpen} onClose={() => setIsLostItemModalOpen(false)} />
      <ReportFoundItemModal isOpen={isFoundItemModalOpen} onClose={() => setIsFoundItemModalOpen(false)} />
    </div>
  )
}
