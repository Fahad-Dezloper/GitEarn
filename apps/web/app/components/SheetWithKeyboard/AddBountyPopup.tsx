/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Sheet
} from "@silk-hq/components";
import { SheetWithKeyboard } from "./SheetWithKeyboard";
import "./ExampleSheetWithKeyboard.css";
import BountyPopup from "../BountyPopup";
import { CursorClickIcon } from "@/components/ui/cursor-click";



interface AddBountyPopupProps {
  title: string;
  isAddingBounty: boolean;
  description: string;
  labels: any;
  repository: string;
  assignees: any;
  prRaise: boolean;
  issueLink: string;
  created: string;
  updated: string;
  status: string;
  latestComment: any;
  issueId: string;
}

const AddBountyPopup = ({title, isAddingBounty, description, labels, repository, assignees, prRaise, issueLink, created, updated, status, latestComment, issueId}: AddBountyPopupProps) => {
  return (
    <SheetWithKeyboard
      presentTrigger={<Sheet.Trigger className="realtive cursor-pointer w-full h-full">
        <CursorClickIcon className="absolute top-0 bottom-0"/>
           <CursorClickIcon />
      </Sheet.Trigger>}
      sheetContent={
        <div className="w-full h-full">
          <BountyPopup isAddingBounty={isAddingBounty} title={title} description={description} labels={labels} repository={repository} assignees={assignees} prRaise={prRaise} issueLink={issueLink} created={created} updated={updated} status={status} latestComment={latestComment} issueId={issueId} />
        </div>
      }
    />
  );
};

export { AddBountyPopup };
