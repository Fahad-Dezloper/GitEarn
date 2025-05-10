"use client"

import * as React from "react"
import { Moon, Sun, LaptopMinimal } from "lucide-react"
import { useTheme } from "next-themes"

import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (

<Tabs defaultValue="System" className="w-full !z-0 rounded-full">
<TabsList className="rounded-full w-full flex justify-between">
  <TabsTrigger onClick={() => setTheme("light")} value="Sun"><Sun size={18} /></TabsTrigger>
  <TabsTrigger onClick={() => setTheme("dark")} value="Moon"><Moon size={18} /></TabsTrigger>
  <TabsTrigger onClick={() => setTheme("system")} value="System"><LaptopMinimal size={18} /></TabsTrigger>
</TabsList>
</Tabs>
  )
}
