"use client";
import { useState } from "react";
import {
  Sheet,
  Scroll,
  VisuallyHidden,
  useClientMediaQuery,
} from "@silk-hq/components";
import { SheetWithKeyboard } from "./SheetWithKeyboard";
import { ExternalLink, RefreshCw } from "lucide-react";
import "./ExampleSheetWithKeyboard.css";
import BountyPopup from "../BountyPopup";
import { CursorClickIcon } from "@/components/ui/cursor-click";


const ExampleSheetWithKeyboard = () => {

  return (
    <SheetWithKeyboard
      presentTrigger={<Sheet.Trigger className="realtive cursor-pointer w-full h-full">
        <CursorClickIcon className="absolute top-0 bottom-0"/>
          <CursorClickIcon />
      </Sheet.Trigger>}
      sheetContent={
        <div className="w-full h-full !z-50">
        <BountyPopup />
        {/* <h1>Hi there</h1> */}
        </div>
      }
    />
  );
};

export { ExampleSheetWithKeyboard };
