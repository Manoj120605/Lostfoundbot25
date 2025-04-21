"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

// Sample data - in a real app, this would come from an API or database
const lostItems = [
  {
    id: "1",
    category: "Smartphone",
    title: "iPhone 13",
    location: "UB, Floor 4 (Entrance Lobby)",
    date: "2023-04-15",
    description: "Black iPhone 13 with clear case and red popsocket",
    status: "OPEN",
  },
  {
    id: "2",
    category: "Wallet",
    title: "Brown Leather Wallet",
    location: "TP, Floor 7 (Near Computer Lab)",
    date: "2023-04-16",
    description: "Brown leather wallet with ID card and some cash",
    status: "OPEN",
  },
  {
    id: "3",
    category: "Laptop",
    title: "MacBook Pro",
    location: "UB, Floor 2 (Library)",
    date: "2023-04-14",
    description: "Silver MacBook Pro with stickers on the cover",
    status: "MATCHED",
  },
  {
    id: "4",
    category: "Keys",
    title: "Car Keys",
    location: "Java (Near Evergreen)",
    date: "2023-04-17",
    description: "Car keys with a black remote and 2 regular keys",
    status: "OPEN",
  },
]

export default function LostItemsList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const filteredItems = lostItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter ? item.category === categoryFilter : true

    return matchesSearch && matchesCategory
  })

  return (
    <div className="flex-1 flex flex-col p-4">
      <div className="mb-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search lost items..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-muted" : ""}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {showFilters && (
          <div className="mt-2 p-4 border rounded-md">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Smartphone">Smartphone</SelectItem>
                  <SelectItem value="Laptop">Laptop</SelectItem>
                  <SelectItem value="Tablet">Tablet</SelectItem>
                  <SelectItem value="Headphone">Headphone</SelectItem>
                  <SelectItem value="Smartwatch">Smartwatch</SelectItem>
                  <SelectItem value="Wallet">Wallet</SelectItem>
                  <SelectItem value="Keys">Keys</SelectItem>
                  <SelectItem value="Bag">Bag</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg">
                <div className="flex justify-between">
                  <h3 className="font-medium">{item.title}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      item.status === "OPEN"
                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                        : item.status === "MATCHED"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{item.location}</p>
                <p className="text-sm text-muted-foreground">Lost on: {new Date(item.date).toLocaleDateString()}</p>
                <p className="text-sm mt-2">{item.description}</p>
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  {item.status === "OPEN" && (
                    <Button variant="outline" size="sm">
                      Mark as Found
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No lost items found matching your criteria.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
