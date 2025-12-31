import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { useTranslation } from "react-i18next"

export interface Option {
  label: string
  value: string
  disabled?: boolean
}

interface MultiSelectFieldProps {
  label?: string
  options: Option[]
  value?: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  error?: { message?: string }
  disabled?: boolean
  maxSelected?: number
  className?: string
}

export function MultiSelectField({
  label,
  options,
  value = [],
  onChange,
  placeholder = "Select...",
  error,
  disabled = false,
  className,
}: MultiSelectFieldProps) {
  const [open, setOpen] = React.useState(false)
  const { t } = useTranslation()

  const handleUnselect = (item: string) => {
    onChange(value.filter((i) => i !== item))
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between min-h-10 h-auto",
              !value.length && "text-muted-foreground",
              error && "border-destructive",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
            onClick={() => !disabled && setOpen(!open)}
          >
            <div className="flex flex-wrap gap-1 items-center">
              {value.length > 0 ? (
                value.map((item) => {
                  const option = options.find((o) => o.value === item)
                  return (
                    <Badge
                      key={item}
                      variant="secondary"
                      className="mr-1 mb-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!disabled) handleUnselect(item)
                      }}
                    >
                      {option?.label || item}
                      <button
                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleUnselect(item)
                          }
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleUnselect(item)
                        }}
                      >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </button>
                    </Badge>
                  )
                })
              ) : (
                <span>{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder={t('common.search')} />
            <CommandList className="max-h-[300px] overflow-y-auto">
              <CommandEmpty>{t('common.noResults')}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = value.includes(option.value)
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        if (option.disabled && !isSelected) return;

                        const newValue = isSelected
                          ? value.filter((v) => v !== option.value)
                          : [...value, option.value]
                        onChange(newValue)
                      }}
                      disabled={option.disabled}
                      className={cn(option.disabled && "opacity-50 cursor-not-allowed")}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-xs text-destructive">{error.message}</p>
      )}
    </div>
  )
}
