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
import axios from "axios";
import { useBountyDetails } from "@/app/context/BountyContextProvider";


const ExampleSheetWithKeyboard = ({title, description, labels, repository, assignees, prRaise, issueLink, created, updated, status, latestComment, issueId}) => {

  // console.log("labels", labels);
  // console.log("bounty popup", title, description, labels, repository, assignees, prRaise, issueLink, created, updated, status, latestComment, issueId)

  return (
    <SheetWithKeyboard
      presentTrigger={<Sheet.Trigger className="realtive cursor-pointer w-full h-full">
        <CursorClickIcon className="absolute top-0 bottom-0"/>
          <CursorClickIcon />
      </Sheet.Trigger>}
      sheetContent={
        <div className="w-full h-full !z-50">
        <BountyPopup title={title} description={description} labels={labels} repository={repository} assignees={assignees} prRaise={prRaise} issueLink={issueLink} created={created} updated={updated} status={status} latestComment={latestComment} issueId={issueId} />
        {/* <h1>Hi there</h1> */}
        </div>
      }
    />
  );
};

export { ExampleSheetWithKeyboard };
