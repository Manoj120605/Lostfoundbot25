export interface Location {
  buildingName: string
  floorNumber: string
  description: string
}

// Fixed the JSON syntax error in the Java building entry (added missing comma)
export const predefinedLocations: Location[] = [
  {
    buildingName: "UB",
    floorNumber: "4",
    description: "Entrance Lobby",
  },
  {
    buildingName: "UB",
    floorNumber: "6",
    description: "Near Lift",
  },
  {
    buildingName: "TP",
    floorNumber: "7",
    description: "Near Computer Lab",
  },
  {
    buildingName: "Architecture",
    floorNumber: "2",
    description: "Inside the Classroom",
  },
  {
    buildingName: "Java",
    floorNumber: "",
    description: "Near Evergreen",
  },
  {
    buildingName: "BEL",
    floorNumber: "3",
    description: "Infront of FittingLab",
  },
  {
    buildingName: "Meenakshi",
    floorNumber: "Ground",
    description: "Infront of sofa",
  },
  {
    buildingName: "Auditorium",
    floorNumber: "1",
    description: "Inside Restroom",
  },
  {
    buildingName: "UB",
    floorNumber: "2",
    description: "Library",
  },
  {
    buildingName: "UB",
    floorNumber: "1",
    description: "Own Book Reading Room",
  },
]

export function getFormattedLocation(location: Location): string {
  let formatted = location.buildingName

  if (location.floorNumber) {
    formatted += `, Floor ${location.floorNumber}`
  }

  if (location.description) {
    formatted += ` (${location.description})`
  }

  return formatted
}

export function getAllBuildings(): string[] {
  const buildings = new Set<string>()

  predefinedLocations.forEach((location) => {
    buildings.add(location.buildingName)
  })

  return Array.from(buildings).sort()
}

export function getFloorsByBuilding(buildingName: string): string[] {
  const floors = new Set<string>()

  predefinedLocations
    .filter((location) => location.buildingName === buildingName)
    .forEach((location) => {
      if (location.floorNumber) {
        floors.add(location.floorNumber)
      }
    })

  return Array.from(floors).sort((a, b) => {
    // Sort floors numerically, with "Ground" at the beginning
    if (a === "Ground") return -1
    if (b === "Ground") return 1
    return Number.parseInt(a) - Number.parseInt(b)
  })
}

export function getLocationsByBuildingAndFloor(buildingName: string, floorNumber: string): Location[] {
  return predefinedLocations.filter(
    (location) => location.buildingName === buildingName && location.floorNumber === floorNumber,
  )
}
