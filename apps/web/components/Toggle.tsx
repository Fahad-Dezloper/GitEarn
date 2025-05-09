"use client"

import * as React from "react"
import { Moon, Sun, LaptopMinimal } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    // <DropdownMenu>
    //   <DropdownMenuTrigger asChild>
    //     <Button variant="outline" size="icon">
    //       <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
    //       <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    //       <span className="sr-only">Toggle theme</span>
    //     </Button>
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent align="end">
    //     <DropdownMenuItem onClick={() => setTheme("light")}>
    //       Light
    //     </DropdownMenuItem>
    //     <DropdownMenuItem onClick={() => setTheme("dark")}>
    //       Dark
    //     </DropdownMenuItem>
    //     <DropdownMenuItem onClick={() => setTheme("system")}>
    //       System
    //     </DropdownMenuItem>
    //   </DropdownMenuContent>
    // </DropdownMenu>

<Tabs defaultValue="System" className="w-fit !z-0 rounded-full">
<TabsList className="rounded-full">
  <TabsTrigger onClick={() => setTheme("light")} value="Sun"><Sun size={18} /></TabsTrigger>
  <TabsTrigger onClick={() => setTheme("dark")} value="Moon"><Moon size={18} /></TabsTrigger>
  <TabsTrigger onClick={() => setTheme("system")} value="System"><LaptopMinimal size={18} /></TabsTrigger>
</TabsList>
</Tabs>
  )
}
