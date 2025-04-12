
"use client"
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { CheckIcon, FilterIcon } from "lucide-react";
import { useState } from "react";
import { 
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const TECH_OPTIONS = [
  "JavaScript",
  "TypeScript", 
  "React", 
  "Python", 
  "Rust", 
  "Go", 
  "Node.js", 
  "Vue", 
  "Ruby", 
  "PHP", 
  "Java",
  "C#",
  "C++",
  "C"
];

type FilterProps = {
  onFilterChange: (filters: {
    minAmount: number;
    maxAmount: number;
    selectedTechs: string[];
  }) => void;
};

const BountyFilter = ({ onFilterChange }: FilterProps) => {
  const [bountyRange, setBountyRange] = useState([0, 10000]);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  
  const handleBountyRangeChange = (value: number[]) => {
    setBountyRange(value);
    onFilterChange({
      minAmount: value[0],
      maxAmount: value[1],
      selectedTechs,
    });
  };

  const handleTechChange = (tech: string) => {
    const newSelectedTechs = selectedTechs.includes(tech)
      ? selectedTechs.filter(t => t !== tech)
      : [...selectedTechs, tech];
    
    setSelectedTechs(newSelectedTechs);
    onFilterChange({
      minAmount: bountyRange[0],
      maxAmount: bountyRange[1],
      selectedTechs: newSelectedTechs,
    });
  };

  const handleReset = () => {
    setBountyRange([0, 10000]);
    setSelectedTechs([]);
    onFilterChange({
      minAmount: 0,
      maxAmount: 10000,
      selectedTechs: [],
    });
  };

  return (
    <div className="space-y-6 p-4 border rounded-lg bg-card">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Bounty Amount</h3>
          <span className="text-sm text-muted-foreground">
            ${bountyRange[0]} - ${bountyRange[1] === 10000 ? '10,000+' : bountyRange[1]}
          </span>
        </div>
        <Slider
          defaultValue={bountyRange}
          min={0}
          max={10000}
          step={100}
          value={bountyRange}
          onValueChange={handleBountyRangeChange}
          className="my-4"
        />
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Tech Stack</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <FilterIcon className="h-4 w-4 mr-2" />
                {selectedTechs.length > 0 ? `${selectedTechs.length} selected` : 'Select technologies'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Technologies</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {TECH_OPTIONS.map((tech) => (
                <DropdownMenuCheckboxItem
                  key={tech}
                  checked={selectedTechs.includes(tech)}
                  onCheckedChange={() => handleTechChange(tech)}
                >
                  {tech}
                  {selectedTechs.includes(tech) && (
                    <CheckIcon className="h-4 w-4 ml-auto" />
                  )}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedTechs.length > 0 ? (
            selectedTechs.map((tech) => (
              <div 
                key={tech} 
                className="flex items-center bg-secondary text-secondary-foreground px-2 py-1 text-xs rounded-md"
              >
                {tech}
                <button
                  className="ml-1 hover:text-destructive"
                  onClick={() => handleTechChange(tech)}
                >
                  ×
                </button>
              </div>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">No technologies selected</span>
          )}
        </div>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full" 
        onClick={handleReset}
      >
        Reset Filters
      </Button>
    </div>
  );
};

export default BountyFilter;