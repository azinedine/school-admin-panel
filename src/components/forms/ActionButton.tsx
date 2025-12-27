import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  loadingText?: string
  children: React.ReactNode
}

export function ActionButton({
  isLoading,
  loadingText,
  children,
  className,
  disabled,
  ...props
}: ActionButtonProps) {
  return (
    <Button disabled={disabled || isLoading} className={className} {...props}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText || "Processing..."}
        </>
      ) : (
        children
      )}
    </Button>
  )
}
