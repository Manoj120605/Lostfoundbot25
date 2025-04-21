// This is a simplified version of the C++ backend logic

export type ItemCategory =
  | "Smartphone"
  | "Laptop"
  | "Tablet"
  | "Headphone"
  | "Smartwatch"
  | "Wallet"
  | "Keys"
  | "Bag"
  | "Other"

export interface ItemDetails {
  [key: string]: string
}

export interface Item {
  id: string
  personName: string
  contactInfo: string
  category: ItemCategory
  eventTime: string
  location: string
  reportTime: string
  details: ItemDetails
  additionalInfo: string
  status: "OPEN" | "CLOSED" | "MATCHED"
}

export interface Location {
  name: string
  roomNumber?: string
  description?: string
}

// Category-specific attributes
const categoryAttributes: Record<ItemCategory, string[]> = {
  Smartphone: ["brand", "model", "color", "case_description", "has_lock_screen"],
  Laptop: ["brand", "model", "color", "has_stickers", "laptop_bag"],
  Tablet: ["brand", "model", "color", "has_case", "screen_size"],
  Headphone: ["brand", "model", "color", "wired_wireless", "has_case"],
  Smartwatch: ["brand", "model", "color", "band_type"],
  Wallet: ["color", "size", "distinguishing_features"],
  Keys: ["color", "size", "distinguishing_features", "number_of_keys", "keychain_description"],
  Bag: ["color", "size", "distinguishing_features", "brand", "type"],
  Other: ["color", "size", "distinguishing_features", "description"],
}

// Mock data storage
let lostItems: Item[] = []
let foundItems: Item[] = []
const predefinedLocations: Location[] = [
  { name: "Main Building", roomNumber: "101", description: "First floor lobby" },
  { name: "Main Building", roomNumber: "204", description: "Second floor classroom" },
  { name: "Library", description: "Main reading area" },
  { name: "Cafeteria", description: "Dining area" },
  { name: "Gym", description: "Sports facility" },
  { name: "Parking Lot", description: "North side parking" },
]

// Generate a random ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 12)
}

// Get current timestamp
function getCurrentTimestamp(): string {
  return new Date().toISOString()
}

// Report a lost item
export function reportLostItem(
  reporterName: string,
  contactInfo: string,
  category: ItemCategory,
  lostTime: string,
  location: string,
  itemDetails: ItemDetails,
  additionalDetails: string,
): Item {
  const item: Item = {
    id: generateId(),
    personName: reporterName,
    contactInfo,
    category,
    eventTime: lostTime,
    location,
    details: itemDetails,
    additionalInfo: additionalDetails,
    reportTime: getCurrentTimestamp(),
    status: "OPEN",
  }

  lostItems.push(item)
  return item
}

// Report a found item
export function reportFoundItem(
  finderName: string,
  contactInfo: string,
  category: ItemCategory,
  foundTime: string,
  location: string,
  itemDetails: ItemDetails,
  additionalDetails: string,
): Item {
  const item: Item = {
    id: generateId(),
    personName: finderName,
    contactInfo,
    category,
    eventTime: foundTime,
    location,
    details: itemDetails,
    additionalInfo: additionalDetails,
    reportTime: getCurrentTimestamp(),
    status: "OPEN",
  }

  foundItems.push(item)
  return item
}

// Calculate match score between two items
function calculateMatchScore(item1: Item, item2: Item): number {
  if (item1.category !== item2.category) {
    return 0 // Different categories, no match
  }

  let score = 0

  // Compare details
  for (const [key, value1] of Object.entries(item1.details)) {
    const value2 = item2.details[key]
    if (value2) {
      // Convert to lowercase for comparison
      const lowerValue1 = value1.toLowerCase()
      const lowerValue2 = value2.toLowerCase()

      if (lowerValue1 === lowerValue2) {
        score += 10 // Exact match
      } else if (lowerValue1.includes(lowerValue2) || lowerValue2.includes(lowerValue1)) {
        score += 5 // Partial match
      }
    }
  }

  // Check location for similarity
  const loc1 = item1.location.toLowerCase()
  const loc2 = item2.location.toLowerCase()

  if (loc1 === loc2) {
    score += 10 // Same location
  } else if (loc1.includes(loc2) || loc2.includes(loc1)) {
    score += 5 // Similar location
  }

  return score
}

// Search for matching items
export function searchForMatches(
  isLostItem: boolean,
  category: ItemCategory,
  searchDetails: ItemDetails,
): Array<{ item: Item; score: number }> {
  const searchIn = isLostItem ? foundItems : lostItems

  // Create temporary item for comparison
  const searchItem: Partial<Item> = {
    category,
    details: searchDetails,
  }

  // Find potential matches
  const matches: Array<{ item: Item; score: number }> = []

  for (const item of searchIn) {
    if (item.category === category && item.status === "OPEN") {
      const score = calculateMatchScore(searchItem as Item, item)
      if (score > 0) {
        matches.push({ item, score })
      }
    }
  }

  // Sort by score (highest first)
  return matches.sort((a, b) => b.score - a.score)
}

// Get attributes for a category
export function getAttributesForCategory(category: ItemCategory): string[] {
  return categoryAttributes[category] || []
}

// Get all predefined locations
export function getLocations(): Location[] {
  return [...predefinedLocations]
}

// Search for items
export function searchItems(
  isLost: boolean,
  category?: ItemCategory,
  location?: string,
  dateFrom?: string,
  dateTo?: string,
): Item[] {
  const items = isLost ? lostItems : foundItems

  return items.filter((item) => {
    // Filter by category if provided
    if (category && item.category !== category) {
      return false
    }

    // Filter by location if provided
    if (location && !item.location.toLowerCase().includes(location.toLowerCase())) {
      return false
    }

    // Filter by date range if provided
    if (dateFrom || dateTo) {
      const itemDate = new Date(item.eventTime)

      if (dateFrom && itemDate < new Date(dateFrom)) {
        return false
      }

      if (dateTo && itemDate > new Date(dateTo)) {
        return false
      }
    }

    return true
  })
}

// Initialize with some sample data
export function initializeSampleData() {
  // Sample lost items
  lostItems = [
    {
      id: generateId(),
      personName: "John Doe",
      contactInfo: "john@example.com",
      category: "Smartphone",
      eventTime: "2023-04-15T14:30:00Z",
      location: "Main Building, Room 204",
      reportTime: "2023-04-15T15:45:00Z",
      details: {
        brand: "Apple",
        model: "iPhone 13",
        color: "Black",
        case_description: "Clear case with red popsocket",
        has_lock_screen: "Yes",
      },
      additionalInfo: "The phone has a photo of a dog as the lock screen",
      status: "OPEN",
    },
    {
      id: generateId(),
      personName: "Sarah Johnson",
      contactInfo: "sarah@example.com",
      category: "Wallet",
      eventTime: "2023-04-16T09:15:00Z",
      location: "Cafeteria",
      reportTime: "2023-04-16T10:30:00Z",
      details: {
        color: "Brown",
        size: "Medium",
        distinguishing_features: "Has a small butterfly logo",
      },
      additionalInfo: "Contains ID card and some cash",
      status: "OPEN",
    },
  ]

  // Sample found items
  foundItems = [
    {
      id: generateId(),
      personName: "Mike Smith",
      contactInfo: "mike@example.com",
      category: "Keys",
      eventTime: "2023-04-16T13:45:00Z",
      location: "Main Building",
      reportTime: "2023-04-16T14:20:00Z",
      details: {
        color: "Silver",
        size: "Small",
        distinguishing_features: "Blue keychain",
        number_of_keys: "3",
      },
      additionalInfo: "Found near the entrance",
      status: "OPEN",
    },
    {
      id: generateId(),
      personName: "Emily Davis",
      contactInfo: "emily@example.com",
      category: "Smartphone",
      eventTime: "2023-04-15T16:30:00Z",
      location: "Library",
      reportTime: "2023-04-15T17:00:00Z",
      details: {
        brand: "Apple",
        model: "iPhone 13",
        color: "Black",
        case_description: "Clear case",
        has_lock_screen: "Yes",
      },
      additionalInfo: "Found on a study table",
      status: "OPEN",
    },
  ]
}

// Initialize sample data
initializeSampleData()
