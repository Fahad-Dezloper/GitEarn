/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useBounty } from '../context/BountyContext';
import './BountyPopup.css';

function BountyPopup() {
  const { isPopupOpen, closePopup, issueData, addBounty } = useBounty();
  const [bountyAmount, setBountyAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  if (!isPopupOpen) return null;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    // Add validation
    if (!bountyAmount || isNaN(Number(bountyAmount)) || parseFloat(bountyAmount) <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount' });
      setIsSubmitting(false);
      return;
    }

    // Call the addBounty function from context
    const result = await addBounty(parseFloat(bountyAmount));
    
    setIsSubmitting(false);
    
    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      // Reset form
      setBountyAmount('');
      // Close popup after success (optional)
      setTimeout(closePopup, 2000);
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  return (
    <div className="bounty-overlay" onClick={(e) => {
      if ((e.target as HTMLElement).className === 'bounty-overlay') closePopup();
    }}>
      <div className="bounty-popup">
        <h2>Add Bounty</h2>
        
        {issueData && (
          <div className="issue-info">
            <p><strong>Issue:</strong> {issueData.title}</p>
            <p><strong>Repo:</strong> {issueData.repo}#{issueData.number}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="bounty-amount">Bounty Amount ($)</label>
            <input
              type="number"
              id="bounty-amount"
              value={bountyAmount}
              onChange={(e) => setBountyAmount(e.target.value)}
              placeholder="Enter amount"
              min="0"
              step="0.01"
              disabled={isSubmitting}
            />
          </div>
          
          {message && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}
          
          <div className="popup-buttons">
            <button 
              type="button" 
              className="btn" 
              onClick={closePopup}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Click Me'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BountyPopup;