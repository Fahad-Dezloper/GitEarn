"use client";
import { Sheet } from "@silk-hq/components";
import { DetachedSheet } from "./DetachedSheet";
import "./ExampleDetachedSheet.css";
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { useState } from "react";

const SupportSheet = ({items}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  return (
    <DetachedSheet
      presentTrigger={
        <SidebarGroup>
          <SidebarGroupContent className="flex">
            <SidebarMenu className="flex flex-row justify-between">
              {items.map((item: SupportItem) => (
                <Sheet.Trigger key={item.title} onClick={() => setSelectedItem(item.title === "Feedback" ? "Feedback" : "Support")}>
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
          {selectedItem === "Feedback" ? (
            <>
            <Sheet.Handle
            className="ExampleDetachedSheet-handle"
            action="dismiss"
          />
          <div className="ExampleDetachedSheet-illustration" />
          <div className="ExampleDetachedSheet-information">
            <Sheet.Title className="ExampleDetachedSheet-title">
              Your Meal is Coming Feedback
            </Sheet.Title>
            <Sheet.Description className="ExampleDetachedSheet-description">
              Your food is on its way and will arrive soon! Sit back and get
              ready to enjoy your meal.
            </Sheet.Description>
          </div>
          <Sheet.Trigger
            className="ExampleDetachedSheet-validateTrigger"
            action="dismiss"
          >
            Got it
          </Sheet.Trigger>
          </>
          ) : (
            <>
            <Sheet.Handle
            className="ExampleDetachedSheet-handle"
            action="dismiss"
          />
          <div className="ExampleDetachedSheet-illustration" />
          <div className="ExampleDetachedSheet-information">
            <Sheet.Title className="ExampleDetachedSheet-title">
              Your Meal is Coming Support
            </Sheet.Title>
            <Sheet.Description className="ExampleDetachedSheet-description">
              Your food is on its way and will arrive soon! Sit back and get
              ready to enjoy your meal.
            </Sheet.Description>
          </div>
          <Sheet.Trigger
            className="ExampleDetachedSheet-validateTrigger"
            action="dismiss"
          >
            Got it
          </Sheet.Trigger>
          </>
          )}
        </div>
      }
    />
  );
};

export { SupportSheet };
