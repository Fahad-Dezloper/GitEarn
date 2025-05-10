// src/app/(dashboardComponents)/IssueFilter.tsx
"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check, ChevronsUpDown, Filter } from "lucide-react";
import { cn } from "@/lib/utils"; // Your utility function for classnames
import { DateRange } from "react-day-picker";
import { XIcon } from "@/components/ui/x";
import { Badge } from "@/components/ui/badge";

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

  const FilterContent = () => (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-4">
        <Input
          placeholder="Search issues..."
          value={search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="w-full h-10"
        />

        <Select
          value={selectedRepo ?? 'all'}
          onValueChange={(value) => onFilterChange({ repository: value === 'all' ? null : value })}
        >
          <SelectTrigger className="w-full h-10">
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
              className="w-full h-10 justify-between"
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
          <PopoverContent className="w-[calc(100vw-4rem)] sm:w-[350px] p-0" align="start">
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
                "w-full h-10 justify-start text-left font-normal",
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
          <PopoverContent className="w-[calc(100vw-4rem)] sm:w-[350px] p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={(range) => onFilterChange({ dates: range })}
              numberOfMonths={1}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex justify-end pt-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onResetFilters} 
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
      <div className="hidden lg:flex flex-wrap items-center justify-between gap-4 p-4 border rounded-md bg-card">
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
            <PopoverContent className="w-[350px] p-0">
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

      {/* Mobile/Tablet View */}
      <div className="lg:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full h-12 px-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Filter size={18} className="text-zinc-500 dark:text-zinc-400" />
                <span className="font-medium">Filters</span>
                {selectedLabels.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedLabels.length}
                  </Badge>
                )}
              </span>
              <div className="flex items-center gap-2">
                {(search || selectedRepo || dateRange?.from) && (
                  <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                    Active
                  </Badge>
                )}
                <ChevronsUpDown className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-[calc(100vw-2rem)] p-0 border-zinc-200 dark:border-zinc-800 shadow-lg" 
            align="start"
            sideOffset={8}
          >
            <FilterContent />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}