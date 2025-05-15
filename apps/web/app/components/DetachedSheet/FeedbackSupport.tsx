/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Sheet } from "@silk-hq/components";
import { DetachedSheet } from "./DetachedSheet";
import "./ExampleDetachedSheet.css";
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";

interface SupportItem {
  title: string;
  url: string;
  icon: any;
}

interface SupportSheetProps {
  items: SupportItem[];
}

const typeActiveStyle: Record<string, string> = {
  Idea: "!data-[state=active]:bg-[#1e2a35] !data-[state=active]:border !data-[state=active]:border-[#0ff] !data-[state=active]:text-white",
  Issue: "!data-[state=active]:bg-red-600 !data-[state=active]:text-white",
  Compliment: "!data-[state=active]:bg-green-600 !data-[state=active]:text-white",
  Other: "!data-[state=active]:bg-gray-600 !data-[state=active]:text-white",
};


const FeedbackContent = () => {
  const [feedbackType, setFeedbackType] = useState("Issue");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const {data: session} = useSession(); 

  const email = session?.user?.email || "";

  const handleSubmit = async () => {
    if (!message.trim()) return;
    
    setIsSubmitting(true);
    setSubmitStatus("idle");
    
    try {
      const formData = new URLSearchParams();
      formData.append("email", email);
      formData.append("description", message);
      formData.append("type", feedbackType);
      
      await fetch(
        "https://script.google.com/macros/s/AKfycbyxGREE2nuIsOnlbIpXYl6MAZOe9beASFOSlbjgRan9LWKBSVODU1qDfai3MODZ-b01/exec", 
        {
          method: "POST",
          body: formData,
          mode: "no-cors",
        }
      );
      
      setSubmitStatus("success");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      setMessage("");
    }
  };

  return (
    <div className="!text-white !bg-[#171717] p-3 rounded-xl space-y-3 sm:space-y-4 h-full overflow-y-auto touch-manipulation">
      <Sheet.Title className="ExampleDetachedSheet-title text-center text-xl sm:text-2xl">
        Feedback
      </Sheet.Title>
      <Sheet.Description className="!text-slate-400 text-center text-sm sm:text-base">
        We value your feedback! Please let us know how we can improve your experience.
      </Sheet.Description>
      
      <Tabs value={feedbackType} onValueChange={setFeedbackType} className="w-full !rounded-md touch-manipulation">
        <TabsList className="w-full !rounded-md grid grid-cols-4 gap-1">
          {["Issue", "Idea", "Other", "Compliment"].map((type) => (
            <TabsTrigger 
              value={type}
              className={`!rounded-md w-full text-xs sm:text-sm py-1.5 touch-manipulation ${typeActiveStyle[type]}`}
              key={type}
            >
              {type}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="space-y-3 sm:space-y-4 touch-manipulation">
        <div>
          <label htmlFor="email" className="block text-xs sm:text-sm font-medium !text-slate-300 mb-1">
            Your Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            placeholder="your@email.com"
            readOnly
            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 !bg-[#2a2a2a] !text-white text-sm rounded-md !border !border-[#3a3a3a] focus:!outline-none focus:!border-blue-500 touch-manipulation"
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block text-xs sm:text-sm font-medium !text-slate-300 mb-1">
            Your Feedback
          </label>
          <textarea
            id="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what's on your mind..."
            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 !bg-[#2a2a2a] !text-white text-sm rounded-md !border !border-[#3a3a3a] focus:!outline-none focus:!border-blue-500 touch-manipulation"
          />
        </div>
        
        {submitStatus === "success" && (
          <p className="text-green-500 text-xs sm:text-sm">Your feedback has been submitted successfully!</p>
        )}
        
        {submitStatus === "error" && (
          <p className="text-red-500 text-xs sm:text-sm">Failed to submit feedback. Please try again.</p>
        )}
        
        <div className="flex justify-center sm:justify-start">
          <button
              className="ExampleDetachedSheet-validateTrigger w-fit flex items-center justify-center cursor-pointer px-4 py-1.5 sm:py-2 text-sm"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Got it"}
            </button>
        </div>
      </div>
    </div>
  );
};


const SupportContent = () => {
  return (
    <div className="!text-white !bg-[#171717] p-3 sm:p-6 rounded-xl space-y-4 sm:space-y-6 overflow-y-auto max-h-[80vh] sm:max-h-none">
      <Sheet.Title className="ExampleDetachedSheet-title text-center text-xl sm:text-2xl">Support</Sheet.Title>

      <Sheet.Description className="!text-slate-400 text-center text-sm sm:text-base">
        Our support team is here to assist you with any questions or issues you may have.
      </Sheet.Description>

      <div className="!bg-[#1f1f1f] !p-3 sm:!p-5 !rounded-lg !border !border-[#2a2a2a]">
        <h3 className="!text-base sm:!text-lg !font-medium !text-white mb-1 sm:mb-2">
          Have a question or facing a bug?
        </h3>
        <p className="!text-slate-400 mb-2 sm:mb-3 text-xs sm:text-sm">
          Reach out! We usually reply within a day.
        </p>
        <div className="flex gap-2 flex-wrap">
          <a
            href="mailto:support@gitearn.com"
            className="flex items-center gap-1 !bg-[#2a2a2a] hover:!bg-[#333] !text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[14px] sm:h-[14px]">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <span>Email Us</span>
          </a>
          <a
            href="https://github.com/gitearn/feedback/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 !bg-[#2a2a2a] hover:!bg-[#333] !text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[14px] sm:h-[14px]">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            <span>GitHub Issue</span>
          </a>
        </div>
      </div>

      <div className="flex w-full items-center justify-center flex-wrap gap-2 sm:gap-3">
        <a
          href="/docs"
          className="!bg-[#2a2a2a] !text-white hover:!bg-[#333] px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm"
        >
          View Docs
        </a>
        <a
          href="https://discord.gg/gitearn"
          className="!bg-[#2a2a2a] !text-white hover:!bg-[#333] px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm"
        >
          Join Discord
        </a>
        <a
          href="https://twitter.com/gitearn"
          className="!bg-[#2a2a2a] !text-white hover:!bg-[#333] px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm"
        >
          Twitter
        </a>
      </div>
    </div>
  );
};

const SupportSheet = ({ items }: SupportSheetProps) => {
  const [selectedItem, setSelectedItem] = useState<SupportItem | null>(null);

  const currentItem = selectedItem;

  return (
    <DetachedSheet
      presentTrigger={
        <SidebarGroup>
          <SidebarGroupContent className="flex">
            <SidebarMenu className="flex flex-row justify-between">
              {items.map((item: SupportItem) => (
                <Sheet.Trigger key={item.title} onClick={() => setSelectedItem(item)}>
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
        <div className={"ExampleDetachedSheet-root"}>
          <Sheet.Handle   
            className="ExampleDetachedSheet-handle "
            action="dismiss"
          />
          {currentItem && currentItem.title === "Feedback" ? <FeedbackContent /> : <SupportContent /> }
        </div>
      }
    />
  );
};

export { SupportSheet };
