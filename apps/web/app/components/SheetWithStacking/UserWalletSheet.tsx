/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useCallback, useEffect, useState } from "react";
import { Sheet, Scroll } from "@silk-hq/components";
import "./ExampleSheetWithStacking.css";
import {
  SheetWithStackingStack,
  SheetWithStackingRoot,
  SheetWithStackingView,
} from "./SheetWithStacking";

import { Wallet, Copy, Check } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import axios from "axios";

const WalletStackingView = () => {
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState(false);
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address;

  const handleCopyAddress = async () => {
    if (walletAddress) {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const travelStatusChangeHandler = useCallback((travelStatus: string) => {
    if (travelStatus === "idleOutside")
      setTimeout(() => setScrolled(false), 10);
  }, []);

  return (
    <SheetWithStackingView className="relative !overflow-hidden" onTravelStatusChange={travelStatusChangeHandler}>
      <Scroll.Root className="ExampleSheetWithStacking-scrollView !dark:bg-[#171717]" asChild>
        <Scroll.View
          scrollGestureTrap={{ yEnd: true }}
          onScroll={({ distance }) => setScrolled(distance > 0)}
        >
          <Scroll.Content className="ExampleSheetWithStacking-scrollContent">
            {/* Wallet Header */}
            <div className="flex flex-col gap-3 p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-[#171717]">
              <div className="flex items-center justify-between">
                <div className="text-xl font-semibold dark:text-white">Fahad&apos;s Wallet</div>
                <button 
                  onClick={handleCopyAddress}
                  className="text-sm text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group"
                >
                  <span>{walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'No wallet'}</span>
                  {copied ? (
                    <Check size={14} className="text-green-500" />
                  ) : (
                    <Copy size={14} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                  )}
                </button>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl">You will receive payments in this wallet each time you win.<br/><a href="#" className="underline dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Learn more</a> about what you can do with your rewards.</div>
            </div>

            {/* Balance Section */}
            <div className="flex flex-col items-start gap-4 px-6 py-8 border-b border-gray-200 dark:border-gray-800">
              <div className="w-full">
                <div className="text-4xl font-bold dark:text-white mb-1">$0 <span className="text-lg font-normal text-gray-500 dark:text-gray-400">USD</span></div>
                <div className="text-sm text-gray-400 dark:text-gray-500">BALANCE</div>
              </div>

              <div className="w-full flex flex-col gap-4">
                <SheetWithStackingRoot className="ExampleSheetWithStacking-nestedSheetRoot w-full">
                  <Sheet.Trigger className="w-full">
                    <button className="w-full bg-[#C7C6F4] dark:bg-[#2A2A4A] text-[#5B5B8C] dark:text-[#A1A1F4] px-6 py-3 rounded-xl font-semibold text-base flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                      Withdraw <span>↗</span>
                    </button>
                  </Sheet.Trigger>
                  <WithdrawStackingView />
                </SheetWithStackingRoot>

                <div className="text-sm text-[#7C7C7C] dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-gray-200 transition-colors flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  Edit Two Factor Authentication
                </div>
              </div>
            </div>

            {/* Assets Section */}
            <div className="px-6 pt-8 pb-4">
              <div className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6">Assets</div>
              <div className="flex flex-col items-center justify-center py-12 text-center border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                <div className="mb-4">
                  <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto text-gray-300 dark:text-gray-600">
                    <ellipse cx="12" cy="12" rx="8" ry="3"/>
                  </svg>
                </div>
                <div className="text-xl font-medium text-gray-400 dark:text-gray-500 mb-2">Your wallet is empty</div>
                <div className="text-sm text-gray-400 dark:text-gray-500 max-w-md">Your rewards will show up here when you&apos;re paid by a maintainer</div>
              </div>
            </div>

            {/* Activity Section */}
            <div className="px-6 pt-8 pb-4">
              <div className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6">Activity</div>
              <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                <div className="mb-4">
                  <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto text-gray-300 dark:text-gray-600">
                    <path d="M16 12h4m0 0-3-3m3 3-3 3M8 12H4m0 0 3-3m-3 3 3 3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="text-xl font-medium text-gray-400 dark:text-gray-500 mb-2">No activity yet</div>
                <div className="text-sm text-gray-400 dark:text-gray-500 max-w-md">All earnings and withdrawals from your Earn wallet will show up here.</div>
              </div>
            </div>
          </Scroll.Content>
        </Scroll.View>
      </Scroll.Root>

      {/* bottom bar */}
      <div
        className={`ExampleSheetWithStacking-bottomBar fullyVisible-${scrolled} dark:bg-[#171717] px-6 py-4 border-t border-gray-200 dark:border-gray-800`}
      >
        <h3 className="text-sm text-gray-500 dark:text-gray-400 text-center">Have questions? Reach out to us at <a href="mailto:support@gitearn.com" className="text-[#5B5B8C] dark:text-[#A1A1F4] hover:underline">support@gitearn.com</a></h3>
      </div>
    </SheetWithStackingView>
  )
};

const WithdrawStackingView = () => {
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [isValidAddress, setIsValidAddress] = useState(true);
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address;

  const handleCopyAddress = async () => {
    if (walletAddress) {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const validateSolanaAddress = (address: string) => {
    // Basic Solana address validation (44 characters, base58)
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    setWithdrawAddress(address);
    setIsValidAddress(validateSolanaAddress(address));
  };

  const handleWithdraw = async () => {
    if (!isValidAddress || !withdrawAddress) return;
    
    setIsLoading(true);
    try {
      // Add your withdrawal logic here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated API call
      // Reset form after successful withdrawal
      setWithdrawAddress('');
    } catch (error) {
      console.error('Withdrawal failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const travelStatusChangeHandler = useCallback((travelStatus: string) => {
    if (travelStatus === "idleOutside")
      setTimeout(() => setScrolled(false), 10);
  }, []);

  return (
    <SheetWithStackingView className="relative !overflow-hidden" onTravelStatusChange={travelStatusChangeHandler}>
      <Scroll.Root className="ExampleSheetWithStacking-scrollView !dark:bg-[#171717]" asChild>
        <Scroll.View
          scrollGestureTrap={{ yEnd: true }}
          onScroll={({ distance }) => setScrolled(distance > 0)}
        >
          <Scroll.Content className="ExampleSheetWithStacking-scrollContent">
            {/* Wallet Header */}
            <div className="flex flex-col">
            <div className="flex flex-col gap-2 p-6 h-fit border-b border-gray-200 dark:border-gray-800 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-[#171717]">
              <div className="text-lg font-semibold dark:text-white">Withdraw Funds</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Enter the Solana wallet address where you want to receive your funds.</div>
            </div>

            {/* Withdrawal Form */}
            <div className="flex flex-col items-start gap-4 px-6 py-6 border-b border-gray-200 dark:border-gray-800">
              <div className="w-full">
                <div className="text-3xl font-bold mb-4 dark:text-white">$0 <span className="text-base font-normal text-gray-500 dark:text-gray-400">USD</span></div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mb-4">AVAILABLE BALANCE</div>

                <div className="w-full space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="withdrawAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Withdrawal Address
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="withdrawAddress"
                        value={withdrawAddress}
                        onChange={handleAddressChange}
                        placeholder="Enter Solana wallet address"
                        className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                          ${isValidAddress 
                            ? 'border-gray-300 dark:border-gray-700 focus:border-[#C7C6F4] dark:focus:border-[#2A2A4A]' 
                            : 'border-red-500 dark:border-red-400'
                          } focus:outline-none focus:ring-2 focus:ring-[#C7C6F4] dark:focus:ring-[#2A2A4A] focus:border-transparent`}
                      />
                      {!isValidAddress && withdrawAddress && (
                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">Please enter a valid Solana address</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleWithdraw}
                    disabled={!isValidAddress || !withdrawAddress || isLoading}
                    className={`w-full bg-[#C7C6F4] dark:bg-[#2A2A4A] text-[#5B5B8C] dark:text-[#A1A1F4] px-6 py-3 rounded-lg font-semibold text-base flex items-center justify-center gap-2 transition-all
                      ${(!isValidAddress || !withdrawAddress || isLoading) 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:opacity-90 dark:hover:bg-[#32325A]'}`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-[#5B5B8C] dark:text-[#A1A1F4]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>Withdraw <span className="ml-1">↗</span></>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="px-6 py-4">
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Important Information</h3>
                <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-2">
                  <li>• Withdrawals are processed within 24-48 hours</li>
                  <li>• Make sure to enter a valid Solana wallet address</li>
                  <li>• Double-check the address before confirming</li>
                  <li>• Minimum withdrawal amount is $10</li>
                </ul>
              </div>
            </div>
            </div>

          </Scroll.Content>
        </Scroll.View>
      </Scroll.Root>

      {/* bottom bar */}
      <div className={`ExampleSheetWithStacking-bottomBar fullyVisible-${scrolled} px-6 py-4 border-t border-gray-200 dark:border-gray-800 dark:bg-[#171717]`}>
        <h3 className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Have questions? Reach out to us at <a href="mailto:support@gitearn.com" className="text-[#5B5B8C] dark:text-[#A1A1F4] hover:underline">support@gitearn.com</a>
        </h3>
      </div>
    </SheetWithStackingView>
  )
};

const UserWalletSheet = () => {
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address;
  const [balance, setBalance] = useState<number>(0);
  const [solPrice, setSolPrice] = useState<number>(0);
  
  // Format wallet address to show only first 6 and last 4 characters
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Fetch SOL price in USD
  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
        setSolPrice(response.data.solana.usd);
      } catch (error) {
        console.error("Error fetching SOL price:", error);
      }
    };

    fetchSolPrice();
    // Refresh price every 5 minutes
    const interval = setInterval(fetchSolPrice, 300000);
    return () => clearInterval(interval);
  }, []);

  // Fetch wallet balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (!walletAddress) return;
      
      try {
        const response = await axios.post(
          "https://solana-devnet.g.alchemy.com/v2/8liAO-lmQabNLQ0We92gFQy_cJYOULew",
          {
            jsonrpc: "2.0",
            id: 1,
            method: "getBalance",
            params: [walletAddress],
          }
        );
        
        // Convert lamports to SOL (1 SOL = 1,000,000,000 lamports)
        const balanceInSol = response.data.result.value / 1_000_000_000;
        setBalance(balanceInSol);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchBalance();
    // Refresh balance every 30 seconds
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, [walletAddress]);

  // Calculate USD value
  const usdValue = balance * solPrice;

  return (
    <SheetWithStackingStack>
      <SheetWithStackingRoot>
        <Sheet.Trigger>
          <div className="md:px-4 md:bg-[#F5F5F5] md:flex font-sora md:dark:bg-[#262626] py-2.5 cursor-pointer rounded-full items-center gap-3 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <div className="relative">
            <Wallet className="md:text-[#A1A1A1] " />
              {walletAddress && (
                <div className="absolute -top-2 -right-2 bg-green-500 rounded-full w-4 h-4 flex items-center justify-center sm:hidden">
                  <span className="text-white text-[8px] font-semibold">${usdValue > 999 ? '1k+' : usdValue.toFixed(0)}</span>
                </div>
              )}
            </div>
            {walletAddress ? (
              <div className="hidden sm:flex flex-col whitespace-nowrap">
                <span className="text-sm font-medium text-[#A1A1A1] whitespace-nowrap">
                  ${usdValue.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="hidden sm:inline-block text-sm text-[#737373] whitespace-nowrap">Connect Wallet</span>
            )}
          </div>
        </Sheet.Trigger>
        <WalletStackingView />
      </SheetWithStackingRoot>
    </SheetWithStackingStack>
  );
};

export { UserWalletSheet };

{/* <span className="text-sm font-medium text-[#A1A1A1]">
                  {formatAddress(walletAddress)}
                </span> */}
