"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Smartphone, Laptop, Tablet, Headphones, Watch, Wallet, Key, Briefcase, HelpCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { getAllBuildings, getFloorsByBuilding, getLocationsByBuildingAndFloor } from "@/lib/locations-data"

interface ReportLostItemModalProps {
  isOpen: boolean
  onClose: () => void
}

type ItemCategory =
  | "Smartphone"
  | "Laptop"
  | "Tablet"
  | "Headphone"
  | "Smartwatch"
  | "Wallet"
  | "Keys"
  | "Bag"
  | "Other"

interface CategoryOption {
  value: ItemCategory
  label: string
  icon: React.ElementType
}

const categories: CategoryOption[] = [
  { value: "Smartphone", label: "Smartphone", icon: Smartphone },
  { value: "Laptop", label: "Laptop", icon: Laptop },
  { value: "Tablet", label: "Tablet", icon: Tablet },
  { value: "Headphone", label: "Headphone", icon: Headphones },
  { value: "Smartwatch", label: "Smartwatch", icon: Watch },
  { value: "Wallet", label: "Wallet", icon: Wallet },
  { value: "Keys", label: "Keys", icon: Key },
  { value: "Bag", label: "Bag", icon: Briefcase },
  { value: "Other", label: "Other", icon: HelpCircle },
]

export default function ReportLostItemModal({ isOpen, onClose }: ReportLostItemModalProps) {
  const [step, setStep] = useState(1)
  const [category, setCategory] = useState<ItemCategory | null>(null)
  const [building, setBuilding] = useState("")
  const [floor, setFloor] = useState("")
  const [locationDescription, setLocationDescription] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [itemDetails, setItemDetails] = useState({
    brand: "",
    model: "",
    color: "",
    description: "",
  })
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    phone: "",
    additionalInfo: "",
  })

  const buildings = getAllBuildings()
  const floors = building ? getFloorsByBuilding(building) : []
  const locations = building && floor ? getLocationsByBuildingAndFloor(building, floor) : []

  const resetForm = () => {
    setStep(1)
    setCategory(null)
    setBuilding("")
    setFloor("")
    setLocationDescription("")
    setDate("")
    setTime("")
    setItemDetails({
      brand: "",
      model: "",
      color: "",
      description: "",
    })
    setPersonalInfo({
      name: "",
      email: "",
      phone: "",
      additionalInfo: "",
    })
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1)
    } else {
      // Submit form
      console.log({
        category,
        location: {
          building,
          floor,
          description: locationDescription,
        },
        dateTime: `${date} ${time}`,
        itemDetails,
        personalInfo,
      })

      // Close modal and reset form
      handleClose()

      // Show success message (in a real app, this would be a toast notification)
      alert("Lost item reported successfully!")
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const isNextDisabled = () => {
    switch (step) {
      case 1:
        return !category
      case 2:
        return !building || !floor
      case 3:
        return !date || !time
      case 4:
        return !itemDetails.color || !itemDetails.description
      case 5:
        return !personalInfo.name || !personalInfo.email
      default:
        return false
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Report a Lost Item</DialogTitle>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>Fill out the form below to report an item you've lost.</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <h2 className="text-xl font-semibold mb-6">Lost Item Report</h2>

          {/* Progress Steps */}
          <div className="flex justify-between mb-8">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center mb-1",
                    step === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  {s}
                </div>
                <span className="text-xs text-muted-foreground">
                  {s === 1 ? "Category" : s === 2 ? "Location" : s === 3 ? "Time" : s === 4 ? "Details" : "Personal"}
                </span>
              </div>
            ))}
          </div>

          {/* Step 1: Category */}
          {step === 1 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Item Category</h3>
              <div className="grid grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    className={cn(
                      "flex flex-col items-center justify-center p-4 rounded-lg border",
                      category === cat.value ? "border-primary bg-primary/10" : "border-border hover:bg-muted",
                    )}
                    onClick={() => setCategory(cat.value)}
                  >
                    <cat.icon className="h-8 w-8 mb-2" />
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-4">Where did you lose the item?</h3>

              <div className="space-y-2">
                <Label htmlFor="building">Building</Label>
                <Select value={building} onValueChange={setBuilding}>
                  <SelectTrigger id="building">
                    <SelectValue placeholder="Select building" />
                  </SelectTrigger>
                  <SelectContent>
                    {buildings.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="floor">Floor</Label>
                <Select value={floor} onValueChange={setFloor} disabled={!building}>
                  <SelectTrigger id="floor">
                    <SelectValue placeholder={building ? "Select floor" : "Select building first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {floors.map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location-description">Specific Location</Label>
                <Select
                  value={locationDescription}
                  onValueChange={setLocationDescription}
                  disabled={!building || !floor}
                >
                  <SelectTrigger id="location-description">
                    <SelectValue
                      placeholder={building && floor ? "Select specific location" : "Select building and floor first"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc.description} value={loc.description}>
                        {loc.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 3: Time */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-4">When did you lose the item?</h3>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Approximate Time</Label>
                <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
              </div>
            </div>
          )}

          {/* Step 4: Item Details */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-4">Item Details</h3>

              <div className="space-y-2">
                <Label htmlFor="brand">Brand (if applicable)</Label>
                <Input
                  id="brand"
                  value={itemDetails.brand}
                  onChange={(e) => setItemDetails({ ...itemDetails, brand: e.target.value })}
                  placeholder="e.g., Apple, Samsung, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model (if applicable)</Label>
                <Input
                  id="model"
                  value={itemDetails.model}
                  onChange={(e) => setItemDetails({ ...itemDetails, model: e.target.value })}
                  placeholder="e.g., iPhone 13, Galaxy S21, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  value={itemDetails.color}
                  onChange={(e) => setItemDetails({ ...itemDetails, color: e.target.value })}
                  placeholder="e.g., Black, White, Blue, etc."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea
                  id="description"
                  value={itemDetails.description}
                  onChange={(e) => setItemDetails({ ...itemDetails, description: e.target.value })}
                  placeholder="Describe any distinguishing features, case, stickers, etc."
                  rows={4}
                  required
                />
              </div>
            </div>
          )}

          {/* Step 5: Personal Information */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-4">Your Information</h3>

              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={personalInfo.name}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={personalInfo.phone}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional-info">Additional Information</Label>
                <Textarea
                  id="additional-info"
                  value={personalInfo.additionalInfo}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, additionalInfo: e.target.value })}
                  placeholder="Any other details that might help identify your item"
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <div className="flex gap-2">
              {step > 1 && (
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
              )}
              <Button onClick={handleNext} disabled={isNextDisabled()}>
                {step === 5 ? "Submit" : "Next"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
