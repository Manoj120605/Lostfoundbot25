"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Paperclip } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  role: "assistant" | "user"
  content: string
  timestamp: Date
}

export default function ChatInterface() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello! I'm your LostFound AI assistant. I can help you:

• Report lost items
• Report found items
• Search for existing reports
• Match lost and found items

How can I assist you today?`,
      timestamp: new Date(),
    },
  ])

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate AI response
    setTimeout(() => {
      let responseContent = ""

      if (input.toLowerCase().includes("lost") || input.toLowerCase().includes("missing")) {
        responseContent =
          "I'm sorry to hear you've lost something. You can report a lost item by clicking on 'Lost Items' in the sidebar, or I can help you report it here. What kind of item did you lose?"
      } else if (input.toLowerCase().includes("found")) {
        responseContent =
          "Thank you for finding an item! You can report a found item by clicking on 'Found Items' in the sidebar, or I can help you report it here. What kind of item did you find?"
      } else if (input.toLowerCase().includes("search") || input.toLowerCase().includes("looking")) {
        responseContent =
          "You can search for items by clicking on 'Search Items' in the sidebar. You can filter by category, location, and date range to find what you're looking for."
      } else {
        responseContent =
          "I'm here to help with lost and found items. You can report lost items, report found items, or search for existing reports. How can I assist you today?"
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    }, 1000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex-1 flex flex-col">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map((message, index) => (
            <div key={index} className={cn("flex gap-3 max-w-[85%]", message.role === "user" ? "ml-auto" : "")}>
              {message.role === "assistant" && (
                <div className="h-8 w-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-primary-foreground">
                  AI
                </div>
              )}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{message.role === "assistant" ? "LostFound AI" : "You"}</span>
                  <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                </div>
                <div
                  className={cn(
                    "p-3 rounded-lg",
                    message.role === "assistant" ? "bg-muted" : "bg-primary text-primary-foreground",
                  )}
                >
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <Button variant="outline" size="icon" className="shrink-0">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="min-h-[44px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
          />
          <Button onClick={handleSendMessage} size="icon" className="shrink-0" disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
