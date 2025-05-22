"use client"
import {
  SidebarInset
} from "@/components/ui/sidebar"
import MainPage from "../(dashboardComponents)/MainPage"
import Topbar from "../(dashboardComponents)/Topbar"


export default function Page() {

  return (
      <SidebarInset>
        <div className="w-full h-full">
        <Topbar />
          <MainPage />
        </div>
      </SidebarInset> 
  )
}
