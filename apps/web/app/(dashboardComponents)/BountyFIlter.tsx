/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { XIcon } from "@/components/ui/x"
import { Checkbox } from "@/components/ui/checkbox"
import { useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type FilterProps = {
  tagList: string[]
  onFilter: (filters: any) => void
  activeFilters: {
    title: string
    tags: string[]
    minAmount: number
    minStars: number
    posted: string
  }
}

export default function BountyFilter({ tagList, onFilter, activeFilters }: FilterProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>(activeFilters.tags)
  const [minAmount, setMinAmount] = useState(activeFilters.minAmount)
  const [searchTitle, setSearchTitle] = useState(activeFilters.title)
  
  useEffect(() => {
    setSelectedTags(activeFilters.tags);
    setMinAmount(activeFilters.minAmount);
    setSearchTitle(activeFilters.title);
  }, [activeFilters]);

  function toggleTag(tag: string) {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag]

    setSelectedTags(updatedTags)
    onFilter({ tags: updatedTags })
  }
  
  return (
    <div className="w-full flex items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 shadow-sm">
      
      <div className="w-full flex gap-6">
      {/* Title */}
      <Input
        placeholder="Search title"
        value={searchTitle}
        onChange={(e) => {
          setSearchTitle(e.target.value);
          onFilter({ title: e.target.value });
        }}
        className="w-[20vw]"
      />

      <Select 
        value={activeFilters.posted}
        onValueChange={(value) => onFilter({ posted: value })}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Last 7 days" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any">Anytime</SelectItem>
          <SelectItem value="7">Last 7 days</SelectItem>
          <SelectItem value="14">Last 14 days</SelectItem>
          <SelectItem value="30">Last 30 days</SelectItem>
        </SelectContent>
      </Select>

      <div>
        <div className="flex justify-between min-w-[10vw] text-sm text-muted-foreground mb-1">
          <span>${minAmount}</span>
        </div>
        <Slider
          value={[minAmount]}
          max={3000}
          step={50}
          onValueChange={(value) => {
            setMinAmount(value[0])
            onFilter({ minAmount: value[0] })
          }}
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            {selectedTags.length > 0 ? `${selectedTags.length} tags selected` : "Filter by tags"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60 max-h-64 overflow-y-auto">
          <div className="flex flex-col gap-2">
            {tagList.map((tag) => (
              <label key={tag} className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox
                  checked={selectedTags.includes(tag)}
                  onCheckedChange={() => toggleTag(tag)}
                />
                {tag}
              </label>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      </div>

      <button
        onClick={() => onFilter({ reset: true })}
        className=""
      >
        <XIcon size={22} />
      </button>
    </div>
  )
}