/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
"use client";
import {
  Sheet
} from "@silk-hq/components";
import { SheetWithKeyboard } from "./SheetWithKeyboard";
import "./ExampleSheetWithKeyboard.css";
import BountyRemovePopup from "../BountyRemovePopup";
import { CursorClickIcon } from "@/components/ui/cursor-click";


interface RemoveBountyPopupProps {
  bounty: number;
  isAddingBounty: boolean;
  title: string;
  labels: string[];
  repository: string;
  assignees: string[];
  prRaise: boolean;
  issueLink: string;
  created: string;
  updated: string;
  status: string;
  latestComment: string;
  issueId: string;
  lamports: any;
  languages: string[];
}

const RemoveBountyPopup = ({isAddingBounty, title, labels, repository, assignees, prRaise, issueLink, created, updated, status, latestComment, issueId, lamports, languages}: RemoveBountyPopupProps) => {
  // console.log("again la", lamports);
  return (
    <SheetWithKeyboard
      presentTrigger={<Sheet.Trigger className="realtive cursor-pointer w-full h-full">
        <CursorClickIcon className="absolute top-0 bottom-0"/>
           <CursorClickIcon />
      </Sheet.Trigger>}
      sheetContent={
        <div className="w-full h-full !z-50">
          <BountyRemovePopup title={title} labels={labels} repository={repository} assignees={assignees} prRaise={prRaise} issueLink={issueLink} created={created} updated={updated} status={status} latestComment={latestComment} issueId={issueId} isAddingBounty={undefined} bounty={undefined} lamports={lamports} languages={languages} />
        </div>
      }
    />
  );
};

export { RemoveBountyPopup };
