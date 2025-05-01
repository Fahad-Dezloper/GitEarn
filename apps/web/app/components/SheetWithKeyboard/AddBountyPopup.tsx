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
}

const AddBountyPopup = ({title, isAddingBounty, description, labels, repository, assignees, prRaise, issueLink, created, updated, status, latestComment, issueId}: AddBountyPopupProps) => {
  return (
    <SheetWithKeyboard
      presentTrigger={<Sheet.Trigger className="realtive cursor-pointer w-full h-full">
        <CursorClickIcon className="absolute top-0 bottom-0"/>
           <CursorClickIcon />
      </Sheet.Trigger>}
      sheetContent={
        <div className="w-full h-full !z-50">
          <BountyPopup isAddingBounty={isAddingBounty} title={title} description={description} labels={labels} repository={repository} assignees={assignees} prRaise={prRaise} issueLink={issueLink} created={created} updated={updated} status={status} latestComment={latestComment} issueId={issueId} />
        </div>
      }
    />
  );
};

export { AddBountyPopup };
