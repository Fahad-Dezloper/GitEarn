// src/App.tsx (or keep as src/content.tsx if you prefer)

import React from 'react';
import { createRoot } from 'react-dom/client';
import BountyButton from '../components/BountyButton'; // Adjust path if needed
import BountyPopup from '../components/BountyPopup';   // Adjust path if needed
import { BountyProvider } from '../context/BountyContext'; // Adjust path if needed
import './App.css'; // Assuming App.css is in the same directory or adjust path

/**
 * The main App component that renders the Bounty UI elements.
 * It includes the necessary context provider.
 */
function App() {
  return (
    <BountyProvider>
      {/* Render both components within the main App structure */}
      {/* Their visibility and positioning would be controlled by their internal logic or CSS */}
      <BountyButton />
      <BountyPopup />
    </BountyProvider>
  );
}

// --- Functions for potentially mounting components individually ---
// These might be used by a content script to inject UI into specific parts
// of an existing page, separate from the main App rendering in Main.tsx.

/**
 * Function to mount only the BountyButton component into a specific container.
 * Checks if the container exists and is empty before mounting.
 */
function mountBountyButton() {
  console.log("button is here");
  const buttonContainer = document.getElementById('github-bounty-button-container');
  // Check if container exists and doesn't already have React content mounted by us
  // (hasChildNodes is a basic check; a more robust check might involve data attributes)
  if (buttonContainer && !buttonContainer.hasChildNodes()) {
    const root = createRoot(buttonContainer);
    root.render(
      <React.StrictMode>
        <BountyProvider> {/* Button still needs provider */}
          <BountyButton />
        </BountyProvider>
      </React.StrictMode>
    );
    console.log('Bounty Button mounted.'); // Optional: for debugging
    // Optionally return the root for potential unmounting
    // return root;
  } else if (buttonContainer?.hasChildNodes()) {
    console.log('Bounty Button container already has content.'); // Optional
  } else {
    console.log('Bounty Button container not found.'); // Optional
  }
}

/**
 * Function to mount only the BountyPopup component into a specific container.
 * Checks if the container exists and is empty before mounting.
 */
function mountBountyPopup() {
  const popupContainer = document.getElementById('github-bounty-popup-container');
  // Check if container exists and doesn't already have React content mounted by us
  if (popupContainer && !popupContainer.hasChildNodes()) {
    const root = createRoot(popupContainer);
    root.render(
      <React.StrictMode>
        <BountyProvider> {/* Popup still needs provider */}
          <BountyPopup />
        </BountyProvider>
      </React.StrictMode>
    );
    console.log('Bounty Popup mounted.'); // Optional: for debugging
     // Optionally return the root for potential unmounting
    // return root;
  } else if (popupContainer?.hasChildNodes()) {
    console.log('Bounty Popup container already has content.'); // Optional
  } else {
    console.log('Bounty Popup container not found.'); // Optional
  }
}

// Default export the App component for use in Main.tsx
export default App;

// Named export the mounting functions if they are needed elsewhere
// (e.g., directly called by a content script)
export { mountBountyButton, mountBountyPopup };

// You might remove the immediate calls here if Main.tsx is now responsible
// for rendering the <App /> component, or if another part of your
// extension logic calls mountBountyButton/mountBountyPopup when appropriate.
// mountBountyButton();
// mountBountyPopup();