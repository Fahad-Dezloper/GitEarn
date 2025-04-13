import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
// import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FilterIcon, 
  CheckIcon, 
  XIcon,
  DollarSignIcon 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// Available technologies for filtering
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
  "C",
];

type FiltersProps = {
  onFilterChange: (filters: {
    minAmount: number;
    maxAmount: number;
    selectedTechs: string[];
    onlyWithBounty: boolean;
  }) => void;
};

const BountyFilters = ({ onFilterChange }: FiltersProps) => {
  const [bountyRange, setBountyRange] = useState<[number, number]>([0, 10000]);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [onlyWithBounty, setOnlyWithBounty] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  // Apply filters when they change
  useEffect(() => {
    onFilterChange({
      minAmount: bountyRange[0],
      maxAmount: bountyRange[1],
      selectedTechs,
      onlyWithBounty,
    });
  }, [bountyRange, selectedTechs, onlyWithBounty, onFilterChange]);

  const handleBountyRangeChange = (value: number[]) => {
    setBountyRange([value[0], value[1]]);
  };

  const handleTechChange = (tech: string) => {
    setSelectedTechs((prev) =>
      prev.includes(tech)
        ? prev.filter((t) => t !== tech)
        : [...prev, tech]
    );
  };

  const handleBountyToggle = (checked: boolean) => {
    setOnlyWithBounty(checked);
  };

  const resetFilters = () => {
    setBountyRange([0, 10000]);
    setSelectedTechs([]);
    setOnlyWithBounty(true);
  };

  const removeTech = (tech: string) => {
    setSelectedTechs((prev) => prev.filter((t) => t !== tech));
  };

  return (
    <div className="w-full">
      
    </div>
  );
};

export default BountyFilters;