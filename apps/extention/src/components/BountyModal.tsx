import React from 'react';

type BountyModalProps = {
  onClose: () => void;
  walletAddress: string;
  balance: string;
};

const BountyModal: React.FC<BountyModalProps> = ({ onClose, walletAddress, balance }) => {
  return (
    <div id="git-earn-modal-wrapper" className="git-earn-modal-overlay">
      <div className="git-earn-modal">
        <button className="git-earn-close" onClick={onClose}>
          &times;
        </button>

        <h2 className="git-earn-title">Add Bounty</h2>

        <div className="git-earn-section">
          <p className="git-earn-label">Connected Wallet</p>
          <p className="git-earn-value">{walletAddress}</p>
        </div>

        <div className="git-earn-section">
          <p className="git-earn-label">Balance</p>
          <p className="git-earn-value">{balance} SOL</p>
        </div>

        <input
          type="number"
          className="git-earn-input"
          placeholder="Enter bounty amount"
        />

        <button className="git-earn-submit" onClick={() => alert('Bounty submitted')}>
          Submit Bounty
        </button>
      </div>
    </div>
  );
};

export default BountyModal;
