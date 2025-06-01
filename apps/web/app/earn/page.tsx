"use client"
import {
  SidebarInset
} from "@/components/ui/sidebar"
import MainPage from "../(dashboardComponents)/MainPage"


export default function Page() {

  return (
      <SidebarInset>
        <div className="w-full h-full">
          <MainPage />
        </div>
      </SidebarInset> 
  )
}
