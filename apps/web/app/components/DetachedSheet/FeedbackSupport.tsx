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
  Idea: "data-[state=active]:bg-cyan-100 dark:data-[state=active]:bg-[#1e2a35] data-[state=active]:text-black dark:data-[state=active]:text-white data-[state=active]:border-cyan-400",
  Issue: "data-[state=active]:bg-red-600 data-[state=active]:text-white",
  Compliment: "data-[state=active]:bg-green-600 data-[state=active]:text-white",
  Other: "data-[state=active]:bg-gray-300 dark:data-[state=active]:bg-gray-600 data-[state=active]:text-black dark:data-[state=active]:text-white",
};

const FeedbackContent = () => {
  const [feedbackType, setFeedbackType] = useState("Issue");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const { data: session } = useSession();

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
    <div className="bg-white dark:bg-[#171717] text-black dark:text-white p-3 rounded-xl space-y-4 h-full overflow-y-auto">
      <Sheet.Title className="text-center text-xl sm:text-2xl">Feedback</Sheet.Title>
      <Sheet.Description className="text-center text-sm sm:text-base text-gray-600 dark:text-slate-400">
        We value your feedback! Let us know how we can improve your experience.
      </Sheet.Description>

      <Tabs value={feedbackType} onValueChange={setFeedbackType} className="w-full">
        <TabsList className="w-full grid grid-cols-4 gap-1 rounded-md">
          {["Issue", "Idea", "Other", "Compliment"].map((type) => (
            <TabsTrigger
              key={type}
              value={type}
              className={`rounded-md w-full text-xs sm:text-sm py-1.5 ${typeActiveStyle[type]}`}
            >
              {type}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
            Your Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            readOnly
            placeholder="your@email.com"
            className="w-full px-3 py-2 !z-[50] bg-gray-100 dark:bg-[#2a2a2a] text-black dark:text-white border border-gray-300 dark:border-[#3a3a3a] rounded-md focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
            Your Feedback
          </label>
          <textarea
            id="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what's on your mind..."
            className="w-full px-3 py-2 flex !z-[52] !relative bg-gray-100 dark:bg-[#2a2a2a] text-black dark:text-white border border-gray-300 dark:border-[#3a3a3a] rounded-md focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>

        {submitStatus === "success" && (
          <p className="text-green-600 dark:text-green-400 text-sm">Your feedback has been submitted successfully!</p>
        )}

        {submitStatus === "error" && (
          <p className="text-red-600 dark:text-red-400 text-sm">Failed to submit feedback. Please try again.</p>
        )}

        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`bg-blue-600 ${isSubmitting ? '!cursor-not-allowed' : ''} ExampleDetachedSheet-validateTrigger text-white hover:bg-blue-700 w-fit flex items-center justify-center cursor-pointer px-4 py-1.5 sm:py-2 text-sm`}
          >
            {isSubmitting ? "Submitting..." : "Got it"}
          </button>
        </div>
      </div>
    </div>
  );
};

const SupportContent = () => (
  <div className="bg-white dark:bg-[#171717] text-black dark:text-white p-3 sm:p-6 rounded-xl space-y-6 overflow-y-auto max-h-[80vh]">
    <Sheet.Title className="text-center text-xl sm:text-2xl">Support</Sheet.Title>
    <Sheet.Description className="text-center text-sm sm:text-base text-gray-600 dark:text-slate-400">
      Our support team is here to assist you with any questions or issues you may have.
    </Sheet.Description>

    <div className="bg-gray-100 dark:bg-[#1f1f1f] p-4 sm:p-5 rounded-lg border border-gray-200 dark:border-[#2a2a2a]">
      <h3 className="text-base sm:text-lg font-medium text-black dark:text-white mb-2">Have a question or facing a bug?</h3>
      <p className="text-gray-700 dark:text-slate-400 mb-3 text-sm">Reach out! We usually reply within a day.</p>
      <div className="flex gap-2 flex-wrap">
        <a href="mailto:support@gitearn.com" className="bg-gray-200 dark:bg-[#2a2a2a] hover:bg-gray-300 dark:hover:bg-[#333] text-black dark:text-white px-3 py-2 rounded-md text-sm transition">
          📧 Email Us
        </a>
        <a href="https://github.com/gitearn/feedback/issues/new" target="_blank" rel="noopener noreferrer" className="bg-gray-200 dark:bg-[#2a2a2a] hover:bg-gray-300 dark:hover:bg-[#333] text-black dark:text-white px-3 py-2 rounded-md text-sm transition">
          🐛 GitHub Issue
        </a>
      </div>
    </div>

    <div className="flex justify-center flex-wrap gap-3">
      <a href="/docs" className="bg-gray-200 dark:bg-[#2a2a2a] hover:bg-gray-300 dark:hover:bg-[#333] text-black dark:text-white px-4 py-2 rounded-md text-sm">View Docs</a>
      <a href="https://discord.gg/gitearn" className="bg-gray-200 dark:bg-[#2a2a2a] hover:bg-gray-300 dark:hover:bg-[#333] text-black dark:text-white px-4 py-2 rounded-md text-sm">Join Discord</a>
      <a href="https://twitter.com/gitearn" className="bg-gray-200 dark:bg-[#2a2a2a] hover:bg-gray-300 dark:hover:bg-[#333] text-black dark:text-white px-4 py-2 rounded-md text-sm">Twitter</a>
    </div>
  </div>
);

const SupportSheet = ({ items }: SupportSheetProps) => {
  const [selectedItem, setSelectedItem] = useState<SupportItem | null>(null);

  return (
    <DetachedSheet
      presentTrigger={
        <SidebarGroup>
          <SidebarGroupContent className="flex">
            <SidebarMenu className="flex flex-row justify-between">
              {items.map((item) => (
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
        <div className="ExampleDetachedSheet-root">
          <Sheet.Handle className="ExampleDetachedSheet-handle" action="dismiss" />
          {selectedItem?.title === "Feedback" ? <FeedbackContent /> : <SupportContent />}
        </div>
      }
    />
  );
};

export { SupportSheet };
