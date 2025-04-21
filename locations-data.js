// Location data
const predefinedLocations = [
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

// Helper functions
function getAllBuildings() {
  const buildings = new Set()

  predefinedLocations.forEach((location) => {
    buildings.add(location.buildingName)
  })

  return Array.from(buildings).sort()
}

function getFloorsByBuilding(buildingName) {
  const floors = new Set()

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

function getLocationsByBuildingAndFloor(buildingName, floorNumber) {
  return predefinedLocations.filter(
    (location) => location.buildingName === buildingName && location.floorNumber === floorNumber,
  )
}
