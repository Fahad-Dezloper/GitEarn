import { createRoot } from 'react-dom/client';
import { BountyProvider } from '../context/BountyContext';
import AddBountyButton from './components/BountyButton';
import { ThemeProvider } from './components/theme-provider';
import React, { FC, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

function App() {
  const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            new UnsafeBurnerWalletAdapter(),
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );
  // const [popupVisible, setPopupVisible] = useState(false);

  // const handleBountyClick = () => {
  //   // alert('Bounty button clicked!');
  //   setPopupVisible(!popupVisible);
  // };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
    <BountyProvider>
      <AddBountyButton />
    </BountyProvider>
    </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
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
    // console.log('Bounty Popup mounted.');
  }
}

export default App;
export { mountBountyButton, mountBountyPopup };
