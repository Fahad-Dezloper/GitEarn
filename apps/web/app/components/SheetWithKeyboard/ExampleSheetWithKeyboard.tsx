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


const ExampleSheetWithKeyboard = () => {

  return (
    <SheetWithKeyboard
      presentTrigger={<Sheet.Trigger>Add Bounty</Sheet.Trigger>}
      sheetContent={
        <div className="w-full h-full">
        <BountyPopup />
        {/* <h1>Hi there</h1> */}
        </div>
      }
    />
  );
};

export { ExampleSheetWithKeyboard };
