import { Settings } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface UserProfileProps {
  name: string
  email: string
}

export default function UserProfile({ name, email }: UserProfileProps) {
  return (
    <div className="p-4 border-t flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">{email}</p>
        </div>
      </div>
      <button className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted">
        <Settings size={16} />
      </button>
    </div>
  )
}
