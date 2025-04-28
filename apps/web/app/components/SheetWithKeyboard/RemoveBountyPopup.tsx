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
import BountyRemovePopup from "../BountyRemovePopup";
import { CursorClickIcon } from "@/components/ui/cursor-click";
import axios from "axios";
import { useBountyDetails } from "@/app/context/BountyContextProvider";


const RemoveBountyPopup = ({isAddingBounty, title, labels, repository, assignees, prRaise, issueLink, created, updated, status, latestComment, issueId}) => {
  // isAddingBounty={isAddingBounty} title={commonTitle} labels={issue.labels} repository={commonRepo} assignees={issue.assignees} prRaise={issue.prRaised} issueLink={issue.issueLink} created={issue.created_at} updated={issue.updated_at} status={issue.state} latestComment={issue.activityLog} issueId={issue.id}
  // console.log("labels", labels);
  // console.log("bounty repository", repository, assignees, prRaise);

  return (
    <SheetWithKeyboard
      presentTrigger={<Sheet.Trigger className="realtive cursor-pointer w-full h-full">
        <CursorClickIcon className="absolute top-0 bottom-0"/>
           <CursorClickIcon />
      </Sheet.Trigger>}
      sheetContent={
        <div className="w-full h-full !z-50">
          <BountyRemovePopup title={title} labels={labels} repository={repository} assignees={assignees} prRaise={prRaise} issueLink={issueLink} created={created} updated={updated} status={status} latestComment={latestComment} issueId={issueId} />
        </div>
      }
    />
  );
};

export { RemoveBountyPopup };
