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
import { MultiSelect } from "./MultiSelect" // assumes you have or will create a custom multi-select component
import { XIcon } from "@/components/ui/x"
import { Checkbox } from "@/components/ui/checkbox"
import {useState} from 'react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type FilterProps = {
  tagList: string[]
  onFilter: (filters: any) => void
}

export default function BountyFilter({ tagList, onFilter }: FilterProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [minAmount, setMinAmount] = useState(0)

  function toggleTag(tag: string) {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag]

    setSelectedTags(updatedTags)
    onFilter({ tags: updatedTags }) // pass array
  }
  return (
    <div className="w-full flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 shadow-sm">
      
      {/* Title */}
      <Input
        placeholder="Search title"
        onChange={(e) => onFilter({ title: e.target.value })}
        className="w-[20vw]"
      />

            {/* Posted Within */}
            <Select onValueChange={(value) => onFilter({ posted: value })}>
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

      {/* Min Bounty Slider */}
      <div>
  <div className="flex justify-between text-sm text-muted-foreground mb-1">
    <span>Minimum Amount</span>
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

      {/* Min Stars Slider */}
      {/* <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-300">Stars</span>
        <Slider
          defaultValue={[0]}
          max={4000}
          step={100}
          className="w-[120px]"
          onValueChange={(value) => onFilter({ minStars: value[0] })}
        />
      </div> */}


      {/* Tags Multi-Select */}
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

      {/* Reset Button */}
      <button
        onClick={() => onFilter({ reset: true })}
        className=""
      >
        <XIcon size={22} />
      </button>
    </div>
  )
}
