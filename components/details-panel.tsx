import { Button } from "@/components/ui/button"

export default function DetailsPanel() {
  return (
    <div className="w-80 border-l hidden md:block">
      <div className="h-14 border-b px-4 flex items-center">
        <h2 className="font-medium">Item Details</h2>
      </div>
      <div className="p-4">
        <div className="flex gap-4 border-b pb-4">
          <Button variant="secondary" size="sm" className="rounded-full">
            Details
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full">
            Actions
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full">
            History
          </Button>
        </div>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Select an item to view details or start a conversation to report a lost or found item.
          </p>
        </div>
      </div>
    </div>
  )
}
