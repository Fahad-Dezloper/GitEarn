function injectGitEarnButton() {
  // Avoid duplicates
  if (document.getElementById('add-bounty-btn')) return;

  // Target the action container
  const actionsContainer = document.querySelector('.Box-sc-g0xbh4-0.bKeiGd.prc-PageHeader-Actions-ygtmj');
  if (!actionsContainer) return;

  // Find the inner flex div (where the buttons are)
  const flexDiv = actionsContainer.querySelector('div');
  if (!flexDiv) return;

  // Create the Git Earn button
  const button = document.createElement('button');
  button.id = 'add-bounty-btn';
  button.innerText = 'Add Bounty';
  button.style.cssText = `
    background-color: #2da44e;
    color: white;
    border: none;
    padding: 0px 12px;
    margin-left: 8px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
  `;

  button.onclick = () => {
    console.log('Git Earn button clicked!');
    alert('Git Earn: Button clicked!');
    createPopup('0x1234...abcd', '120.00 USDC');
  };

  // Add to the flex div
  flexDiv.appendChild(button);
}

// Observe for GitHub page load/changes (PJAX)
const observer = new MutationObserver(() => {
  injectGitEarnButton();
});

observer.observe(document.body, { childList: true, subtree: true });

// Try immediately
injectGitEarnButton();

function createPopup(walletAddress = '0x1234...abcd', balance = '120.00 USDC') {
  if (document.getElementById('git-earn-popup')) return;

  const popup = document.createElement('div');
  popup.id = 'git-earn-popup';
  popup.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  `;

  popup.innerHTML = `
    <div style="
      background: white;
      border-radius: 12px;
      width: 400px;
      padding: 24px;
      font-family: sans-serif;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      position: relative;
    ">
      <button style="
        position: absolute;
        top: 12px;
        right: 12px;
        background: transparent;
        border: none;
        font-size: 20px;
        cursor: pointer;
      " onclick="document.getElementById('git-earn-popup').remove()">×</button>

      <h2 style="margin-bottom: 8px;">Add Bounty to Issue</h2>
      <p style="color: #666;">Select a bounty amount to incentivize solving this issue.</p>

      <div style="margin: 16px 0; background: #f4f6f8; padding: 12px; border-radius: 8px;">
        <strong>Add Rag model for projects</strong><br/>
        <small style="color: #888;">ProjectHunt</small>
      </div>

      <div style="
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;
        gap: 8px;
      ">
        ${[10, 50, 100].map(amount => `
          <button style="
            flex: 1;
            background: #f0f0f0;
            border: none;
            border-radius: 20px;
            padding: 8px 0;
            cursor: pointer;
            font-weight: bold;
          ">${amount} USDC</button>
        `).join('')}
        <button style="
          flex: 1;
          background: #f0f0f0;
          border: none;
          border-radius: 20px;
          padding: 8px 0;
          cursor: pointer;
        ">Custom</button>
      </div>

      <div style="display: flex; justify-content: space-between; font-size: 14px; color: #444;">
        <span>Wallet: ${walletAddress}</span>
        <span>Balance: ${balance}</span>
      </div>

      <button style="
        margin-top: 24px;
        width: 100%;
        padding: 10px;
        background: #2d6cdf;
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
      ">Add Bounty</button>
    </div>
  `;

  document.body.appendChild(popup);
}

