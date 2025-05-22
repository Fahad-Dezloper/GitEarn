"use client"
import { BellIcon } from "@/components/ui/bell";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Notification() {
  const [showPopup, setShowPopup] = useState(false);
  const unreadCount = 3;

  const notifications = [
    {
      user: "System",
      message: "A new bounty has been added to Issue #1024 in `open-sol-pay`.",
      time: "2 minutes ago",
    },
    {
      user: "Alice",
      message: "claimed the bounty for Issue #1011 in `solana-analytics`.",
      time: "30 minutes ago",
    },
    {
      user: "MaintainerBot",
      message: "commented on Issue #1007 in `sol-pay-ui`.",
      time: "1 hour ago",
    },
    {
      user: "System",
      message: "Your payout of 1.5 SOL for Issue #0999 is complete.",
      time: "Yesterday",
    },
  ];
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setShowPopup(true)}
      onMouseLeave={() => setShowPopup(false)}
    >
      <div className="relative">
        <BellIcon size={24} className="text-gray-700 dark:text-white" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center">
            <span className="text-white text-[10px] font-semibold">{unreadCount}</span>
          </div>
        )}
      </div>
      <AnimatePresence>
        {showPopup && (
          <motion.div
            key="notification-popup"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute top-[125%] right-0 w-[280px] sm:w-[320px] md:w-[340px] bg-white dark:bg-[#10131A] text-gray-800 dark:text-white rounded-2xl shadow-lg z-50 min-h-[200px] max-h-[400px] overflow-y-auto border border-gray-200 dark:border-[#23262F]"
          >
            <div className="px-5 py-4 border-b border-gray-200 dark:border-[#23262F] font-semibold text-lg">
              Notifications
              <span className="bg-gray-100 dark:bg-[#23262F] rounded-xl px-2 py-0.5 text-xs ml-2 text-gray-700 dark:text-white">
                {unreadCount}
              </span>
            </div>
            {notifications.map((n, idx) => (
              <div
                key={idx}
                className={`flex flex-col gap-1 px-5 py-3.5 ${
                  idx === notifications.length - 1 ? "" : "border-b border-gray-200 dark:border-[#23262F]"
                }`}
              >
                <div className="leading-tight">
                  <strong className="text-gray-900 dark:text-white">{n.user}</strong>
                  <span className="text-gray-600 dark:text-[#D1D1D1] ml-1.5">{n.message}</span>
                </div>
                <span className="text-gray-500 dark:text-[#A3A3A3] text-xs">{n.time}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}