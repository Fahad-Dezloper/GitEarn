// import React from 'react';
import ReactDOM from 'react-dom/client';
import BountyModal from './components/BountyModal';
import './index.css';

function showBountyModal() {
  const id = 'git-earn-modal-root';

  // Avoid duplicate modals
  if (document.getElementById(id)) return;

  const modalRoot = document.createElement('div');
  modalRoot.id = id;
  document.body.appendChild(modalRoot);

  const root = ReactDOM.createRoot(modalRoot);
  root.render(
    <BountyModal
      onClose={() => {
        root.unmount();
        modalRoot.remove();
      }}
      walletAddress="FAHAD123abc...xyz"
      balance="3.25"
    />
  );
}

function injectGitEarnButton() {
  // Avoid duplicate button
  if (document.getElementById('add-bounty-btn')) return;

  // Target the GitHub header actions container
  const actionsContainer = document.querySelector('.Box-sc-g0xbh4-0.bKeiGd.prc-PageHeader-Actions-ygtmj');
  if (!actionsContainer) return;

  const flexDiv = actionsContainer.querySelector('div');
  if (!flexDiv) return;

  // Create the "Add Bounty" button
  const button = document.createElement('button');
  button.id = 'add-bounty-btn';
  button.innerText = 'Add Bounty';
  button.style.cssText = `
    background-color: #2da44e;
    color: white;
    border: none;
    padding: 6px 14px;
    margin-left: 8px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
  `;

  button.onclick = () => {
    showBountyModal();
  };

  // Append the button to the flex container
  flexDiv.appendChild(button);
}

// Observe GitHub DOM changes (PJAX navigation)
const observer = new MutationObserver(() => {
  injectGitEarnButton();
});
observer.observe(document.body, { childList: true, subtree: true });

// Try once on load
injectGitEarnButton();
