"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

// Sample data - in a real app, this would come from an API or database
const foundItems = [
  {
    id: "1",
    category: "Keys",
    title: "Set of Keys",
    location: "UB, Floor 6 (Near Lift)",
    date: "2023-04-16",
    description: "Set of 3 keys with a blue keychain",
    status: "OPEN",
  },
  {
    id: "2",
    category: "Smartphone",
    title: "Samsung Galaxy",
    location: "Architecture, Floor 2 (Inside the Classroom)",
    date: "2023-04-15",
    description: "Black Samsung Galaxy with cracked screen protector",
    status: "OPEN",
  },
  {
    id: "3",
    category: "Headphone",
    title: "AirPods Pro",
    location: "Meenakshi, Ground (Infront of sofa)",
    date: "2023-04-17",
    description: "White AirPods Pro in charging case",
    status: "MATCHED",
  },
  {
    id: "4",
    category: "Wallet",
    title: "Black Wallet",
    location: "BEL, Floor 3 (Infront of FittingLab)",
    date: "2023-04-18",
    description: "Small black wallet with student ID inside",
    status: "OPEN",
  },
]

export default function FoundItemsList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const filteredItems = foundItems.filter((item) => {
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
              placeholder="Search found items..."
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
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                        : item.status === "MATCHED"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{item.location}</p>
                <p className="text-sm text-muted-foreground">Found on: {new Date(item.date).toLocaleDateString()}</p>
                <p className="text-sm mt-2">{item.description}</p>
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  {item.status === "OPEN" && (
                    <Button variant="outline" size="sm">
                      Match to Owner
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No found items matching your criteria.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
