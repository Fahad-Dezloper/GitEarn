"use client";
import { Sheet } from "@silk-hq/components";
import { DetachedSheet } from "./DetachedSheet";
import "./ExampleDetachedSheet.css";
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { useState } from "react";
import { LucideIcon } from "lucide-react";

interface SupportItem {
  title: string;
  url: string;
  icon: LucideIcon;
  description?: string;
}

interface SupportSheetProps {
  items: SupportItem[];
}

const SupportSheet = ({ items }: SupportSheetProps) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  return (
    <DetachedSheet
      presentTrigger={
        <SidebarGroup>
          <SidebarGroupContent className="flex">
            <SidebarMenu className="flex flex-row justify-between">
              {items.map((item: SupportItem) => (
                <Sheet.Trigger key={item.title} onClick={() => setSelectedItem(item.title)}>
                  <SidebarMenuItem className="w-full">
                    <SidebarMenuButton asChild size="sm">
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </Sheet.Trigger>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      }
      sheetContent={
        <div className={"ExampleDetachedSheet-root !z-[999]"}>
          <Sheet.Handle
            className="ExampleDetachedSheet-handle"
            action="dismiss"
          />
          <div className="ExampleDetachedSheet-illustration" />
          <div className="ExampleDetachedSheet-information">
            <Sheet.Title className="ExampleDetachedSheet-title">
              {selectedItem || items[0].title}
            </Sheet.Title>
            <Sheet.Description className="ExampleDetachedSheet-description">
              {selectedItem === "Feedback" 
                ? "We value your feedback! Please let us know how we can improve your experience."
                : "Need help? Our support team is here to assist you with any questions or issues you may have."}
            </Sheet.Description>
          </div>
          <Sheet.Trigger
            className="ExampleDetachedSheet-validateTrigger"
            action="dismiss"
          >
            Got it
          </Sheet.Trigger>
        </div>
      }
    />
  );
};

export { SupportSheet };
