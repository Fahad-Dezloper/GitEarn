"use client"
import { BellIcon } from "@/components/ui/bell";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Notification() {
  const [showPopup, setShowPopup] = useState(false);

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
    <div style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setShowPopup(true)}
      onMouseLeave={() => setShowPopup(false)}
    >
      <BellIcon size={24} />
      <AnimatePresence>
        {showPopup && (
          <motion.div
            key="notification-popup"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: "125%",
              right: 0,
              width: 340,
              background: "#181A20",
              color: "#fff",
              borderRadius: 16,
              boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
              zIndex: 100,
              padding: 0,
              minHeight: 200,
              maxHeight: 400,
              overflowY: "auto",
            }}
          >
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #23262F", fontWeight: 600, fontSize: 18 }}>
              Notifications
              <span style={{
                background: "#23262F",
                borderRadius: 12,
                padding: "2px 8px",
                fontSize: 12,
                marginLeft: 8,
              }}>3</span>
            </div>
            {notifications.map((n, idx) => (
                <div
                    key={idx}
                    style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    padding: "14px 20px",
                    borderBottom: idx === notifications.length - 1 ? "none" : "1px solid #23262F",
                    }}
                >
                    <div style={{ lineHeight: 1.4 }}>
                    <strong style={{ color: "#ffffff" }}>{n.user}</strong>
                    <span style={{ color: "#D1D1D1", marginLeft: 6 }}>{n.message}</span>
                    </div>
                    <span style={{ color: "#A3A3A3", fontSize: 12 }}>{n.time}</span>
                </div>
                ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}