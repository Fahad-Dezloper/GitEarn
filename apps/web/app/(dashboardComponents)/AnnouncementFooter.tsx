/* eslint-disable @next/next/no-img-element */
import { RocketIcon } from "@/components/ui/rocket";

export default function AnnouncementFooter() {
  return (
    <div className=" z-50 rounded-xl mb-8 relative shadow-lg px-4 pt-4 pb-6 bg-background border border-border max-w-md w-full">
      <div className="flex flex-col items-start gap-4">
        <div className="w-full max-h-[20vh] rounded-xl overflow-hidden">
          <img src="https://pbs.twimg.com/media/Gpt28bpXsAAY_22?format=jpg&name=medium" alt="GUMROAD" className="w-full h-full object-cover" />
        </div>
        <div className="text-sm flex flex-col items-center">
          {/* image */}
          <p className="font-medium text-center">
            Gumroad just went public on GitHub!
          </p>
          <p className="text-muted-foreground text-xs">
            Start contributing.
          </p>
        </div>
        <a href="https://github.com/antiwork/gumroad"
          className="bg-blue-600/90 cursor-pointer whitespace-nowrap -bottom-4 absolute left-1/2 -translate-x-1/2 flex gap-3 items-center text-xs text-white rounded-full px-4 py-2">
          <RocketIcon size={18} />
          Check out
        </a>
      </div>
    </div>
  );
}
