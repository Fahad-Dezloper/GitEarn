import React from 'react';
import { createRoot } from 'react-dom/client';
import { BountyProvider } from '../context/BountyContext';
import AddBountyButton from './components/BountyButton';
import { ThemeProvider } from './components/theme-provider';

function App() {
  // const [popupVisible, setPopupVisible] = useState(false);

  // const handleBountyClick = () => {
  //   // alert('Bounty button clicked!');
  //   setPopupVisible(!popupVisible);
  // };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <BountyProvider>
      <AddBountyButton />
    </BountyProvider>
    </ThemeProvider>
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
