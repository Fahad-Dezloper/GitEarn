/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { CalendarIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { XIcon } from "@/components/ui/x" 
import { DateRange } from "react-day-picker"
import { Filter } from "lucide-react"

type Bounty = {
  bounty: number
  createdAt: string
  repo: string
  technologies: { name: string; color: string }[]
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
    new Map(
      originalBounties
        .flatMap((b) => b.technologies)
        .map((t) => [t.name, t])
    ).values()
  )

  const [minAmount, setMinAmount] = useState(0)
  const [selectedTechs, setSelectedTechs] = useState<{ name: string; color: string }[]>([])
  const [search, setSearch] = useState("")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [open, setOpen] = useState(false);

  function hexToRgba(hex: string, alpha: number) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  useEffect(() => {
    let filtered = [...originalBounties]

    if (minAmount > 0) {
      filtered = filtered.filter((b) => b.bounty >= minAmount)
    }

    if (selectedTechs.length > 0) {
      filtered = filtered.filter((b) =>
        selectedTechs.every((t) =>
          b.technologies.some((bt) => bt.name === t.name)
        )
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

  function Managetech(tech: { name: string; color: string }) {
    setSelectedTechs((prev) => prev.filter((t) => t.name !== tech.name))
  }

  const resetFilters = () => {
    setMinAmount(0)
    setSelectedTechs([])
    setSearch("")
    setDateRange({})
  }

  const FilterContent = () => (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
          <Input
            type="text"
            placeholder="Search issues..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
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
            className="w-full"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
                onClick={() => setOpen(!open)}
              >
                {selectedTechs.length === 0
                  ? "Select technologies"
                  : `${selectedTechs.length} selected`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[280px]">
              <Command>
                <CommandInput placeholder="Search techs..." />
                <CommandEmpty>No match found.</CommandEmpty>
                <CommandGroup>
                  {allTechs.map((tech, i) => (
                    <CommandItem
                      key={i}
                      value={tech.name}
                      onSelect={() => {
                        setSelectedTechs((prev) =>
                          prev.some((t) => t.name === tech.name)
                            ? prev.filter((t) => t.name !== tech.name)
                            : [...prev, { name: tech.name, color: tech.color }]
                        );
                        setOpen(false);
                      }}
                    >
                      {tech.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <div className="flex flex-wrap gap-1 w-full overflow-x-auto scrolll">
            {selectedTechs.map((tech, i) => (
              <Badge
                key={tech.name}
                variant="default"
                className="flex items-center gap-1 text-white"
                style={{backgroundColor: hexToRgba(tech.color, 0.4)}}
              >
                {tech.name}
                <XIcon
                  size={13}
                  className="cursor-pointer hover:bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTechs((prev) => prev.filter((t) => t.name !== tech.name));
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
                className="w-full justify-start text-left font-normal"
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
                selected={dateRange as DateRange}
                onSelect={(range: DateRange | undefined) => setDateRange(range || {})}
                numberOfMonths={1}
                defaultMonth={new Date("2025-04-01")}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={resetFilters} 
          title="Reset Filters"
          className="flex items-center gap-2"
        >
          <XIcon size={16} />
          Reset Filters
        </Button>
      </div>
    </div>
  )

  return (
    <div className="w-full">
      {/* Desktop View */}
      <div className="hidden sm:flex flex-row flex-wrap items-end justify-between gap-4 p-4 border rounded-md bg-card">
        <div className="flex flex-row items-end gap-4">
          <div className="flex flex-col gap-1">
            <Input
              type="text"
              placeholder="Search issues..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-w-[200px] md:min-w-[23vw]"
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
        {allTechs.map((tech, i) => (
          <CommandItem
          key={i}
          value={tech.name}
          onSelect={() => {
            setSelectedTechs((prev) =>
              prev.some((t) => t.name === tech.name)
                ? prev.filter((t) => t.name !== tech.name)
                : [...prev, { name: tech.name, color: tech.color }]
            );
            setOpen(false);
          }}
        >
          {tech.name}
        </CommandItem>
        ))}
      </CommandGroup>
    </Command>
  </PopoverContent>
</Popover>
          <div className="flex gap-1 max-w-[10vw] overflow-x-auto scrolll">
            {selectedTechs.map((tech, i) => (
              <Badge
              key={tech.name}
              variant="default"
              className="flex items-center gap-1 text-white"
                  style={{backgroundColor: hexToRgba(tech.color, 0.4)}}
            >
              {tech.name}
              <XIcon
                size={13}
                className="cursor-pointer hover:bg-transparent"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTechs((prev) => prev.filter((t) => t.name !== tech.name));
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
                selected={dateRange as DateRange}
                onSelect={(range: DateRange | undefined) => setDateRange(range || {})}
                numberOfMonths={1}
                defaultMonth={new Date("2025-04-01")}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={resetFilters} 
          title="Reset Filters"
        >
          <XIcon size={24} />
        </Button>
      </div>

      {/* Mobile View */}
      <div className="sm:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Filter size={16} />
                Filters
                {selectedTechs.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedTechs.length}
                  </Badge>
                )}
              </span>
              {(minAmount > 0 || search || (dateRange?.from && dateRange?.to)) && (
                <Badge variant="secondary">Active</Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[calc(100vw-2rem)] p-0">
            <FilterContent />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
