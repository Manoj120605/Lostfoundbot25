"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Calendar, MapPin } from "lucide-react"
import { getAllBuildings, getFloorsByBuilding } from "@/lib/locations-data"

// Combined sample data
const allItems = [
  {
    id: "l1",
    type: "lost",
    category: "Smartphone",
    title: "iPhone 13",
    location: "UB, Floor 4 (Entrance Lobby)",
    date: "2023-04-15",
    description: "Black iPhone 13 with clear case and red popsocket",
    status: "OPEN",
  },
  {
    id: "l2",
    type: "lost",
    category: "Wallet",
    title: "Brown Leather Wallet",
    location: "TP, Floor 7 (Near Computer Lab)",
    date: "2023-04-16",
    description: "Brown leather wallet with ID card and some cash",
    status: "OPEN",
  },
  {
    id: "f1",
    type: "found",
    category: "Keys",
    title: "Set of Keys",
    location: "UB, Floor 6 (Near Lift)",
    date: "2023-04-16",
    description: "Set of 3 keys with a blue keychain",
    status: "OPEN",
  },
  {
    id: "f2",
    type: "found",
    category: "Smartphone",
    title: "Samsung Galaxy",
    location: "Architecture, Floor 2 (Inside the Classroom)",
    date: "2023-04-15",
    description: "Black Samsung Galaxy with cracked screen protector",
    status: "OPEN",
  },
]

export default function SearchItemsInterface() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [buildingFilter, setBuildingFilter] = useState("")
  const [floorFilter, setFloorFilter] = useState("")
  const [dateFromFilter, setDateFromFilter] = useState("")
  const [dateToFilter, setDateToFilter] = useState("")

  const buildings = getAllBuildings()
  const floors = buildingFilter ? getFloorsByBuilding(buildingFilter) : []

  const filteredItems = allItems.filter((item) => {
    // Filter by search query
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by tab
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "lost" && item.type === "lost") ||
      (activeTab === "found" && item.type === "found")

    // Filter by category
    const matchesCategory = categoryFilter ? item.category === categoryFilter : true

    // Filter by building
    const matchesBuilding = buildingFilter ? item.location.includes(buildingFilter) : true

    // Filter by floor
    const matchesFloor = floorFilter ? item.location.includes(`Floor ${floorFilter}`) : true

    // Filter by date range
    let matchesDateRange = true
    const itemDate = new Date(item.date)

    if (dateFromFilter) {
      const fromDate = new Date(dateFromFilter)
      matchesDateRange = matchesDateRange && itemDate >= fromDate
    }

    if (dateToFilter) {
      const toDate = new Date(dateToFilter)
      matchesDateRange = matchesDateRange && itemDate <= toDate
    }

    return matchesSearch && matchesTab && matchesCategory && matchesBuilding && matchesFloor && matchesDateRange
  })

  return (
    <div className="flex-1 flex flex-col p-4">
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for lost or found items..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="lost">Lost Items</TabsTrigger>
          <TabsTrigger value="found">Found Items</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            Location
          </label>
          <Select
            value={buildingFilter}
            onValueChange={(value) => {
              setBuildingFilter(value)
              setFloorFilter("")
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Buildings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Buildings</SelectItem>
              {buildings.map((building) => (
                <SelectItem key={building} value={building}>
                  {building}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {buildingFilter && (
            <Select value={floorFilter} onValueChange={setFloorFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Floors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Floors</SelectItem>
                {floors.map((floor) => (
                  <SelectItem key={floor} value={floor}>
                    {floor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

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

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            Date Range
          </label>
          <div className="flex gap-2">
            <Input
              type="date"
              placeholder="From"
              value={dateFromFilter}
              onChange={(e) => setDateFromFilter(e.target.value)}
            />
            <Input
              type="date"
              placeholder="To"
              value={dateToFilter}
              onChange={(e) => setDateToFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        item.type === "lost"
                          ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}
                    >
                      {item.type === "lost" ? "LOST" : "FOUND"}
                    </span>
                    <h3 className="font-medium">{item.title}</h3>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(item.date).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{item.location}</p>
                <p className="text-sm mt-2">{item.description}</p>
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  {item.type === "lost" && item.status === "OPEN" && (
                    <Button variant="outline" size="sm">
                      I Found This
                    </Button>
                  )}
                  {item.type === "found" && item.status === "OPEN" && (
                    <Button variant="outline" size="sm">
                      This is Mine
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No items found matching your criteria.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
