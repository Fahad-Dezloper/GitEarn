"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils";
import { XIcon } from "@/components/ui/x";


type Props = {
  repositories: string[];
  labels: string[];
  filters: {
    search: string;
    repo: string;
    label: string;
    date: string;
  };
  onFilterChange: (filters: Props["filters"]) => void;
};

export default function IssueFilter({
  repositories,
  labels,
  filters,
  handleChange,
}: Props) {
  const [date, setDate] = useState<Date>();
  const resetFilters = () => {
    handleChange({
      search: "",
      repo: "",
      label: "",
      date: "",
    });
  };

  // console.log("")

  return (
    <div className="w-full flex items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 shadow-sm">
      {/* Search */}
      <div className="flex gap-2">
      <Input
        placeholder="Search issue..."
        value={filters.search}
        className="w-[20vw]"
        onChange={(e) => handleChange((prev) => ({ ...prev, search: e.target.value }))}
      />


      <Select onValueChange={(value) =>
            handleChange((prev) => ({ ...prev, repo: value }))} value={filters.repo}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="All Repositories" />
        </SelectTrigger>
        <SelectContent>
        {repositories.map((repo) => (
          <SelectItem key={repo} value={repo}>{repo}</SelectItem>
        ))}
        </SelectContent>
      </Select>

      <Select
          onValueChange={(value) =>
          handleChange((prev) => ({ ...prev, label: value }))}
          value={filters.label}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="All Labels" />
        </SelectTrigger>
        <SelectContent>
        {labels.map((label) => (
          <SelectItem key={label} value={label}>
            {label}
          </SelectItem>
        ))}
        </SelectContent>
      </Select>

{/* <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => selectedDate && handleChange("date", format(selectedDate, "yyyy-MM-dd"))}
          initialFocus
        />
      </PopoverContent>
    </Popover> */}
    </div>

    <button
        onClick={resetFilters}
        className=""
      >
        <XIcon size={22} />
      </button>

    </div>
  );
}
