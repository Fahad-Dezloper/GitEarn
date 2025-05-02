"use client"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format, isWithinInterval } from "date-fns"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { CalendarIcon, X } from "lucide-react"
import { useEffect, useState } from "react"
import { XIcon } from "@/components/ui/x"

type Bounty = {
  bounty: number
  createdAt: string
  repo: string
  technologies: string[]
  title: string
}

export default function BountyFilter({
  originalBounties,
  onFilterChange,
}: {
  originalBounties: Bounty[]
  onFilterChange: (filtered: Bounty[]) => void
}) {
  const allTechs = Array.from(
    new Set(originalBounties.flatMap((b) => b.technologies))
  )

  const [minAmount, setMinAmount] = useState(0)
  const [selectedTechs, setSelectedTechs] = useState<string[]>([])
  const [search, setSearch] = useState("")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let filtered = [...originalBounties]

    if (minAmount > 0) {
      filtered = filtered.filter((b) => b.bounty >= minAmount)
    }

    if (selectedTechs.length > 0) {
      filtered = filtered.filter((b) =>
        selectedTechs.every((t) => b.technologies.includes(t))
      )
    }

    if (search) {
      const s = search.toLowerCase()
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(s) ||
          b.repo.toLowerCase().includes(s)
      )
    }

    if (dateRange?.from && dateRange?.to) {
      filtered = filtered.filter((b) =>
        isWithinInterval(new Date(b.createdAt), {
          start: dateRange.from!,
          end: dateRange.to!,
        })
      )
    }

    onFilterChange(filtered)
  }, [minAmount, selectedTechs, search, dateRange, originalBounties, onFilterChange])

  function Managetech(tech: string){
    setSelectedTechs((prev) => prev.filter((t) => t !== tech))
  }

  const resetFilters = () => {
    setMinAmount(0)
    setSelectedTechs([])
    setSearch("")
    setDateRange({})
  }

  return (
    <div className="flex flex-wrap items-end justify-between gap-4 p-4 border rounded-md bg-card">
      <div className="flex items-end gap-4">
      <div className="flex flex-col gap-1">
          <Input
            type="text"
            placeholder="Search issues..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-grow min-w-[23vw]"
          />
        </div>

        <div className="flex flex-col gap-3">
        <span className="text-xs text-muted-foreground">Min Bounty ${minAmount}</span>
          <Slider
            min={0}
            max={1000}
            step={50}
            value={[minAmount]}
            onValueChange={(val) => setMinAmount(val[0])}
            className="w-48"
          />
        </div>

        <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
  <PopoverTrigger asChild>
    <Button
      variant="outline"
      className="w-fit justify-start text-left"
      onClick={() => setOpen(!open)}
    >
      {selectedTechs.length === 0
        ? "Select technologies"
        : `${selectedTechs.length} selected`}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="p-0 w-64">
    <Command>
      <CommandInput placeholder="Search techs..." />
      <CommandEmpty>No match found.</CommandEmpty>
      <CommandGroup>
        {allTechs.map((tech) => (
          <CommandItem
            key={tech}
            value={tech}
            onSelect={() => {
              setSelectedTechs((prev) =>
                prev.includes(tech)
                  ? prev.filter((t) => t !== tech)
                  : [...prev, tech]
              );
              setOpen(false);
            }}
          >
            {tech}
          </CommandItem>
        ))}
      </CommandGroup>
    </Command>
  </PopoverContent>
</Popover>
          <div className="flex gap-1 max-w-[10vw] overflow-x-auto scrolll">
            {selectedTechs.map((tech) => (
              <Badge
                key={tech}
                variant="default"
                className="flex items-center gap-1"
              >
                {tech}
                <XIcon
                size={13}
                className="cursor-pointer hover:bg-transparent"
                onClick={(e) => {
                  e.stopPropagation(); // prevent parent handlers from firing
                  Managetech(tech);
                }}
              />
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[240px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange && dateRange.from && dateRange.to ? (
                  <>
                    {format(dateRange.from, "MMM d")} – {format(dateRange.to, "MMM d")}
                  </>
                ) : (
                  <span>Pick a date range</span>
                )}

              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                initialFocus
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={1}
                defaultMonth={new Date("2025-04-01")}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

        <Button variant="ghost" size="icon" onClick={resetFilters} title="Reset Filters" >
          <XIcon size={24} />
        </Button>
    </div>
  )
}
