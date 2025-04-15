import React from 'react'
import "./bounty-styles.css"
import { useState } from 'react'

const BountyPopup = ({isVisible}: { isVisible: boolean }) => {
    const [selectedAmount, setSelectedAmount] = useState("10 USDC")
    if(isVisible === false) return null;
  return (
    <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">Add Bounty to Issue</h2>
                <button className="close-button">
                  ×
                </button>
              </div>

              <p className="modal-description">Select a bounty amount to incentivize solving this issue.</p>

              <div className="issue-container">
                <h3 className="issue-title">Add Rag model for projects</h3>
                <p className="issue-project">ProjectHunt</p>
              </div>

              <div className="amount-options">
                {["10 USDC", "50 USDC", "100 USDC", "Custom"].map((amount) => (
                  <button
                    key={amount}
                    className={`amount-button ${selectedAmount === amount ? "selected" : ""}`}
                    onClick={() => setSelectedAmount(amount)}
                  >
                    {amount}
                  </button>
                ))}
              </div>

              <div className="action-buttons">
                <button className="add-bounty-button">Add Bounty</button>
              </div>
            </div>
          </div>
        </div>
  )
}

export default BountyPopup