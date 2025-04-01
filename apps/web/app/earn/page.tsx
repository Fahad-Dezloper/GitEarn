import {
  SidebarInset
} from "@/components/ui/sidebar"
import MainPage from "../(dashboardComponents)/MainPage"

export default function Page() {
  return (
      <SidebarInset>
        <MainPage />
      </SidebarInset>
  )
}
