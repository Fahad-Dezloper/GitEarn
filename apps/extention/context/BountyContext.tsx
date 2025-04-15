/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useState, useContext } from 'react';

const BountyContext = createContext<BountyContextType | undefined>(undefined);

interface BountyContextType {
  isPopupOpen: boolean;
  openPopup: () => void;
  closePopup: () => void;
  issueData: { title: string; repo: string; number: number } | null;
  addBounty: (amount: number) => Promise<{ success: boolean; message: string }>;
}

export function BountyProvider({ children }: React.PropsWithChildren<object>) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [issueData, setIssueData] = useState<{ title: string; repo: string; number: number; url: string } | null>(null);

  // Function to open the popup
  const openPopup = () => {
    // Extract issue data
    const issueTitleElement = document.querySelector('.js-issue-title');
    const issueTitle = issueTitleElement && issueTitleElement.textContent ? issueTitleElement.textContent.trim() : '';
    const issueNumber = window.location.pathname.split('/').pop();
    const repoPath = window.location.pathname.split('/').slice(1, 3).join('/');
    
    setIssueData({
      title: issueTitle,
      number: issueNumber ? parseInt(issueNumber, 10) : 0,
      repo: repoPath,
      url: window.location.href
    });
    
    setIsPopupOpen(true);
  };

  // Function to close the popup
  const closePopup = () => {
    setIsPopupOpen(false);
  };

  // Make API call to add bounty (placeholder for now)
  const addBounty = async (bountyAmount: any) => {
    try {
      // This is where you would make your backend call
      if (issueData) {
        console.log(`Adding bounty of ${bountyAmount} to issue ${issueData.number}`);
      } else {
        console.error('Cannot add bounty: issueData is null');
      }
      
      // Placeholder for API call
      // const response = await fetch('your-api-endpoint', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     issueUrl: issueData.url,
      //     amount: bountyAmount
      //   }),
      // });
      
      // For now, just return a mock success
      return {
        success: true,
        message: `Successfully added bounty of $${bountyAmount}`
      };
    } catch (error) {
      console.error('Error adding bounty:', error);
      return {
        success: false,
        message: 'Failed to add bounty'
      };
    }
  };

  return (
    <BountyContext.Provider value={{
      isPopupOpen,
      openPopup,
      closePopup,
      issueData,
      addBounty
    }}>
      {children}
    </BountyContext.Provider>
  );
}

export function useBounty() {
  return useContext(BountyContext);
}