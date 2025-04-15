import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BountyProvider } from '../context/BountyContext';
import BountyButton from '../components/BountyButton'
import BountyPopup from '../components/BountyPopup'
// import './App.css';

// function BountyButton({ onClick }: { onClick: () => void }) {
//   return (
//     <BountyPopup />
//   );
// }

// function BountyPopup({ isVisible }: { isVisible: boolean }) {
//   return isVisible ? (
//     <BountyPopup />
//   ) : null;
// }

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
