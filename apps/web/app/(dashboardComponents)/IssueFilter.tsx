// src/app/(dashboardComponents)/IssueFilter.tsx
"use client";

import * as React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils"; // Your utility function for classnames
import { DateRange } from "react-day-picker";
import { XIcon } from "@/components/ui/x";

interface IssueFilterProps {
  repositories: string[];
  labels: string[];
  onFilterChange: (filters: {
    search?: string;
    labels?: string[];
    repository?: string | null;
    dates?: DateRange | undefined;
  }) => void;
  onResetFilters: () => void;
  currentFilters: {
    search: string;
    selectedLabels: string[];
    selectedRepo: string | null;
    dateRange?: DateRange | undefined;
  };
}

export default function IssueFilter({
  repositories,
  labels,
  onFilterChange,
  onResetFilters,
  currentFilters,
}: IssueFilterProps) {

  const { search, selectedLabels, selectedRepo, dateRange } = currentFilters;
  const [labelPopoverOpen, setLabelPopoverOpen] = useState(false);


  const handleLabelSelect = (label: string) => {
    const newLabels = selectedLabels.includes(label)
      ? selectedLabels.filter((l) => l !== label)
      : [...selectedLabels, label];
    onFilterChange({ labels: newLabels });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 border rounded-md bg-card">
      <div className="flex items-center gap-4">
      <Input
        placeholder="Search issues..."
        value={search}
        onChange={(e) => onFilterChange({ search: e.target.value })}
        className="flex-grow min-w-[25vw]"
      />

      <Select
        value={selectedRepo ?? 'all'}
        onValueChange={(value) => onFilterChange({ repository: value === 'all' ? null : value })}
      >
        <SelectTrigger className="w-auto min-w-[180px]">
          <SelectValue placeholder="Filter by repository" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Repositories</SelectItem>
          {repositories.map((repo, i) => (
            <SelectItem key={i} value={repo}>
              {repo}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover open={labelPopoverOpen} onOpenChange={setLabelPopoverOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={labelPopoverOpen}
                    className="w-auto min-w-[200px] justify-between"
                >
                    <span className="truncate">
                        {selectedLabels.length === 0
                            ? "Filter by labels"
                            : selectedLabels.length === 1
                            ? selectedLabels[0]
                            : `${selectedLabels.length} labels selected`}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0">
                <Command>
                    <CommandInput placeholder="Search labels..." />
                    <CommandList>
                        <CommandEmpty>No labels found.</CommandEmpty>
                        <CommandGroup>
                            {labels.map((label) => {
                                const isSelected = selectedLabels.includes(label);
                                return (
                                    <CommandItem
                                        key={label}
                                        value={label}
                                        onSelect={() => handleLabelSelect(label)}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                isSelected ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {label}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                        {selectedLabels.length > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem
                                        onSelect={() => onFilterChange({ labels: [] })}
                                        className="justify-center text-center text-xs text-muted-foreground"
                                    >
                                        Clear selection
                                    </CommandItem>
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>

        <Popover>
            <PopoverTrigger asChild>
                <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                        "w-auto min-w-[260px] justify-start text-left font-normal",
                        !dateRange && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                        dateRange.to ? (
                            <>
                                {format(dateRange.from, "LLL dd, y")} -{" "}
                                {format(dateRange.to, "LLL dd, y")}
                            </>
                        ) : (
                            format(dateRange.from, "LLL dd, y")
                        )
                    ) : (
                        <span>Filter by date</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={(range) => onFilterChange({ dates: range })}
                    numberOfMonths={2}
                />
            </PopoverContent>
        </Popover>
        </div>


      <Button variant="ghost" size="icon" onClick={onResetFilters} title="Reset Filters">
        <XIcon />
      </Button>
    </div>
  );
}