// IssuesSolved.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

const mockIssues = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Issue #${i + 1}: ${"Fix a bug that causes unexpected crashes in complex workflows ".repeat((i % 3) + 1)}`,
  bounty: `$${(Math.random() * 100 + 50).toFixed(2)}`
}));

const UserIssuesSolved = () => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-4 font-sora">Issues Solved</h2>
      <ScrollArea className="max-h-[30vh] overflow-y-auto rounded-xl border shadow-sm">
        <div className="flex flex-col gap-2 p-2">
          {mockIssues.map((issue, idx) => (
            <motion.div
              key={issue.id}
              initial={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.03 }}
            >
              <Card className="bg-background transition-colors">
                <CardContent className="px-4 flex flex-col sm:flex-row sm:justify-between gap-9">
                  <p className="text-xs font-medium break-words max-w-full text-muted-foreground">
                    {issue.title}
                  </p>
                  <span className="font-sora text-sm text-green-500 font-semibold whitespace-nowrap">
                    {issue.bounty}
                  </span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default UserIssuesSolved;
