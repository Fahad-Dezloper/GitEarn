"use client"

import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X } from "lucide-react"

type MultiSelectProps = {
  options: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelect({
  options,
  onChange,
  placeholder = "Select...",
  className,
}: MultiSelectProps) {
  const [selected, setSelected] = React.useState<string[]>([])
  const [open, setOpen] = React.useState(false)

  const toggleOption = (option: string) => {
    const updated = selected.includes(option)
      ? selected.filter((v) => v !== option)
      : [...selected, option]
    setSelected(updated)
    onChange(updated)
  }

  const removeTag = (tag: string) => {
    const updated = selected.filter((v) => v !== tag)
    setSelected(updated)
    onChange(updated)
  }

  return (
    <div className={`w-full ${className}`}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start overflow-hidden whitespace-nowrap text-ellipsis"
          >
            {selected.length > 0 ? (
              <div className="flex gap-2 flex-wrap">
                {selected.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                  >
                    {tag}
                    <X
                      size={12}
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeTag(tag)
                      }}
                    />
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-64 p-2 space-y-1">
          <ScrollArea className="h-48 pr-2">
            {options.map((option) => (
              <div
                key={option}
                className="flex items-center space-x-2 px-2 py-1 hover:bg-muted rounded-md cursor-pointer"
                onClick={() => toggleOption(option)}
              >
                <Checkbox checked={selected.includes(option)} />
                <span className="text-sm">{option}</span>
              </div>
            ))}
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  )
}
