import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BountyProvider } from '../context/BountyContext';
import './App.css';

function BountyButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="bounty-button" onClick={onClick}>
      💰 Create Bounty
    </button>
  );
}

function BountyPopup({ isVisible }: { isVisible: boolean }) {
  return isVisible ? (
    <div className="bounty-popup">
      <p>Bounty Popup is open!</p>
    </div>
  ) : null;
}

function App() {
  const [popupVisible, setPopupVisible] = useState(false);

  const handleBountyClick = () => {
    alert('Bounty button clicked!');
    setPopupVisible(true);
  };

  return (
    <BountyProvider>
      <BountyButton onClick={handleBountyClick} />
      <BountyPopup isVisible={popupVisible} />
    </BountyProvider>
  );
}

function mountBountyButton() {
  const buttonContainer = document.getElementById('github-bounty-button-container');
  if (buttonContainer && !buttonContainer.hasChildNodes()) {
    const root = createRoot(buttonContainer);
    root.render(
      <React.StrictMode>
        <BountyProvider>
          <App />
        </BountyProvider>
      </React.StrictMode>
    );
    console.log('Bounty Button mounted.');
  }
}

function mountBountyPopup() {
  const popupContainer = document.getElementById('github-bounty-popup-container');
  if (popupContainer && !popupContainer.hasChildNodes()) {
    const root = createRoot(popupContainer);
    root.render(
      <React.StrictMode>
        <BountyProvider>
          <App />
        </BountyProvider>
      </React.StrictMode>
    );
    console.log('Bounty Popup mounted.');
  }
}

export default App;
export { mountBountyButton, mountBountyPopup };
