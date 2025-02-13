import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin">
            <Loader2 className="h-12 w-12 text-primary" />
          </div>
          <p className="text-lg font-medium text-muted-foreground animate-pulse">Loading...</p>
        </div>
      </div>
    </div>
  )
}

