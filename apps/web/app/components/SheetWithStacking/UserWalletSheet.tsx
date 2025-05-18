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

import { Wallet, Copy, Check, ExternalLink } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import axios from "axios";
import { useSession } from "next-auth/react";
import { getSolanaWalletInfo } from "@/lib/getWalletBalance";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBountyDetails } from "@/app/context/BountyContextProvider";
import { withdrawMoney } from "@/lib/withDrawMoney";

const WalletStackingView = ({ usdBalance, solBalance, transactions }: { usdBalance: number, solBalance: number, transactions: any[] }) => {
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState(false);
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address;
  const {data: session} = useSession();
  const username = session?.user?.name;

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
            <div className="flex flex-col gap-3 p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-[#171717]">
              <div className="flex items-center justify-between">
                <div className="text-xl font-semibold dark:text-white">{username}&apos;s Wallet</div>
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
                <div className="text-4xl font-bold dark:text-white mb-1">${usdBalance.toFixed(2)} <span className="text-lg font-normal text-gray-500 dark:text-gray-400">USD</span></div>
                <div className="text-sm text-gray-400 dark:text-gray-500">BALANCE</div>
              </div>

              <div className="w-full flex flex-col gap-4">
                <SheetWithStackingRoot className="ExampleSheetWithStacking-nestedSheetRoot w-full">
                  <Sheet.Trigger className="w-full">
                    <button className="w-full bg-[#C7C6F4] dark:bg-[#2A2A4A] text-[#5B5B8C] dark:text-[#A1A1F4] px-6 py-3 rounded-xl font-semibold text-base flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                      Withdraw <span>↗</span>
                    </button>
                  </Sheet.Trigger>
                  <WithdrawStackingView usdBalance={usdBalance} solBalance={solBalance} />
                </SheetWithStackingRoot>

                <div className="text-sm text-[#7C7C7C] dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-gray-200 transition-colors flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  Transfer funds to your own wallet
                </div>
              </div>
            </div>

            {/* Activity Section */}
            <div className="px-6 pt-8 pb-4">
              <div className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6">Activity</div>
              
              <div className="overflow-auto rounded-md border border-gray-200 dark:border-gray-700/30">
                <Table>
                  {transactions && transactions.length > 0 && (
                    <TableCaption className="px-4 text-xs text-gray-500 dark:text-gray-500">
                      Showing recent transaction history.
                    </TableCaption>
                  )}
                  <TableHeader className="bg-gray-50/80 dark:bg-[#202020]">
                    <TableRow className="border-gray-200 dark:border-gray-800/30">
                      <TableHead className="w-[80px] text-xs uppercase text-gray-500 dark:text-gray-400">From</TableHead>
                      <TableHead className="w-[80px] text-xs uppercase text-gray-500 dark:text-gray-400">To</TableHead>
                      <TableHead className="hidden md:table-cell text-xs uppercase text-gray-500 dark:text-gray-400">Signature</TableHead>
                      <TableHead className="text-xs uppercase text-gray-500 dark:text-gray-400">Date</TableHead>
                      <TableHead className="text-xs uppercase w-[60px] text-gray-500 dark:text-gray-400">View</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="bg-white dark:bg-[#171717]">
                    {Array.isArray(transactions) && transactions.length > 0 ? (
                      transactions.map((tx: { signature: string; blockTime?: number; from?: string; to?: string }) => (
                        <TableRow key={tx.signature} className="border-gray-100 dark:border-gray-800/30 hover:bg-gray-50/50 dark:hover:bg-[#1A1A1A]">
                          <TableCell className="font-medium">
                            {tx.from ? (
                              <span className="text-xs text-gray-600 dark:text-gray-300" title={tx.from}>
                                {tx.from.substring(0, 4)}...{tx.from.substring(tx.from.length - 4)}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400 dark:text-gray-500">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {tx.to ? (
                              <span className="text-xs text-gray-600 dark:text-gray-300" title={tx.to}>
                                {tx.to.substring(0, 4)}...{tx.to.substring(tx.to.length - 4)}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400 dark:text-gray-500">—</span>
                            )}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <span className="text-xs text-gray-500 dark:text-gray-400" title={tx.signature}>
                              {tx.signature.substring(0, 6)}...{tx.signature.substring(tx.signature.length - 6)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {tx.blockTime ? new Date(tx.blockTime * 1000).toLocaleDateString() : "—"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <a
                              href={`https://explorer.solana.com/tx/${tx.signature}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors inline-flex items-center gap-1 text-xs"
                            >
                              <span className="sm:inline hidden">View</span>
                              <ExternalLink size={12} />
                            </a>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-40">
                          <div className="flex flex-col items-center justify-center text-center py-8">
                            <div className="mb-3 bg-gray-100 dark:bg-[#202020] p-2 rounded-full">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-400 dark:text-gray-500">
                                <path d="M16 12h4m0 0-3-3m3 3-3 3M8 12H4m0 0 3-3m-3 3 3 3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">No transactions yet</h3>
                            <p className="text-xs text-gray-400 dark:text-gray-500 max-w-md">
                              All earnings and withdrawals will show up here.
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Responsive additional information for small screens */}
              <div className="mt-3 md:hidden text-xs text-gray-400 dark:text-gray-500">
                <p>Tap on an address or signature to see full details.</p>
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

const WithdrawStackingView = ({usdBalance, solBalance}: {usdBalance: number, solBalance: number}) => {
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [isValidAddress, setIsValidAddress] = useState(true);
  const [amount, setAmount] = useState('');
  const [solAmount, setSolAmount] = useState(0);
  const [currentSolRate, setCurrentSolRate] = useState(0);
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address;
  const walletId = user?.id;

  useEffect(() => {
    const fetchSolRate = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
        const data = await response.json();
        const rate = data?.solana?.usd || 0;
        setCurrentSolRate(rate);
      } catch (error) {
        console.error('Failed to fetch SOL rate:', error);
      }
    };
  
    fetchSolRate(); // Initial fetch
    const intervalId = setInterval(fetchSolRate, 3000); // Update every 3s
  
    return () => clearInterval(intervalId);
  }, []);

  // Update SOL amount whenever USD amount or rate changes
  useEffect(() => {
    if (currentSolRate > 0 && amount) {
      const parsedAmount = parseFloat(amount);
      if (!isNaN(parsedAmount)) {
        setSolAmount(parsedAmount / currentSolRate);
      } else {
        setSolAmount(0);
      }
    } else {
      setSolAmount(0);
    }
  }, [amount, currentSolRate]);

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
    setIsValidAddress(address === '' || validateSolanaAddress(address));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and decimal point
    const value = e.target.value.replace(/[^\d.]/g, '');
    // Ensure only one decimal point
    const parts = value.split('.');
    const formattedValue = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : value;
    setAmount(formattedValue);
  };

  const handleWithdraw = async () => {
    if (!isValidAddress || !withdrawAddress || !walletId || Number(amount) <= 0 || Number(amount) > usdBalance) return;
    
    setIsLoading(true);
    try {
      const res = await withdrawMoney({
        walletId: walletId,
        from: walletAddress!,
        to: withdrawAddress,
        amount: Number(amount),
        network: 'devnet'
      });

      setWithdrawAddress('');
      setAmount('');
      setSolAmount(0);
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

  const parsedAmount = parseFloat(amount);
  const isValidAmount = !isNaN(parsedAmount) && parsedAmount > 0 && parsedAmount <= usdBalance;

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
                  <div className="text-3xl font-bold mb-1 dark:text-white">${usdBalance.toFixed(2)} <span className="text-base font-normal text-gray-500 dark:text-gray-400">USD</span></div>
                  <div className="text-xl font-medium mb-4 dark:text-white">{solBalance.toFixed(6)} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">SOL</span></div>
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

                      <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-4">
                        Amount to Withdraw (USD)
                      </label>
                      <input
                        type="text"
                        id="amount"
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder="Enter amount in USD"
                        className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 
                          ${!isValidAmount && amount ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-700'} 
                          focus:outline-none focus:ring-2 focus:ring-[#C7C6F4] dark:focus:ring-[#2A2A4A] focus:border-transparent`}
                      />
                      
                      {amount && !isNaN(parsedAmount) && parsedAmount > 0 && (
                        <div className="flex items-center mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            ≈ {solAmount.toFixed(6)} SOL
                          </span>
                          {currentSolRate > 0 && (
                            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                              (1 SOL ≈ ${currentSolRate.toFixed(2)})
                            </span>
                          )}
                        </div>
                      )}
                      
                      {amount && parsedAmount > usdBalance && (
                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                          Amount exceeds available balance
                        </p>
                      )}
                    </div>

                    <button
                      onClick={handleWithdraw}
                      disabled={!isValidAddress || !withdrawAddress || isLoading || !isValidAmount}
                      className={`w-full bg-[#C7C6F4] dark:bg-[#2A2A4A] text-[#5B5B8C] dark:text-[#A1A1F4] px-6 py-3 rounded-lg font-semibold text-base flex items-center justify-center gap-2 transition-all
                        ${(!isValidAddress || !withdrawAddress || isLoading || !isValidAmount) 
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
                    <li>• SOL price updates every 3 seconds to reflect market changes</li>
                  </ul>
                </div>
              </div>
            </div>
          </Scroll.Content>
        </Scroll.View>
      </Scroll.Root>

      {/* bottom bar */}
      <div className={`ExampleSheetWithStacking-bottomBar ${scrolled ? 'fullyVisible' : ''} px-6 py-4 border-t border-gray-200 dark:border-gray-800 dark:bg-[#171717]`}>
        <h3 className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Have questions? Reach out to us at <a href="mailto:support@gitearn.com" className="text-[#5B5B8C] dark:text-[#A1A1F4] hover:underline">support@gitearn.com</a>
        </h3>
      </div>
    </SheetWithStackingView>
  );
};

const UserWalletSheet = () => {
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address;
  const [usdBalance, setUsdBalance] = useState<number>(0);
  const [solBalance, setSolBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!walletAddress) return;
      
      try {
        const dets = await getSolanaWalletInfo(walletAddress.toString())
        setUsdBalance(dets.usd);
        setSolBalance(dets.sol);
        setTransactions(dets.transactions);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, [walletAddress]);


  return (
    <SheetWithStackingStack>
      <SheetWithStackingRoot>
        <Sheet.Trigger>
          <div className="md:px-4 md:bg-[#F5F5F5] md:flex font-sora md:dark:bg-[#262626] py-2.5 cursor-pointer rounded-full items-center gap-3 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <div className="relative">
            <Wallet className="md:text-[#A1A1A1] " />
              {walletAddress && (
                <div className="absolute -top-2 -right-2 bg-green-500 rounded-full w-4 h-4 flex items-center justify-center sm:hidden">
                  <span className="text-white text-[8px] font-semibold">${usdBalance > 999 ? '1k+' : usdBalance.toFixed(0)}</span>
                </div>
              )}
            </div>
            {walletAddress ? (
              <div className="hidden sm:flex flex-col whitespace-nowrap">
                <span className="text-sm font-medium text-[#A1A1A1] whitespace-nowrap">
                  ${usdBalance.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="hidden sm:inline-block text-sm text-[#737373] whitespace-nowrap">Connect Wallet</span>
            )}
          </div>
        </Sheet.Trigger>
        <WalletStackingView usdBalance={usdBalance} solBalance={solBalance} transactions={transactions} />
      </SheetWithStackingRoot>
    </SheetWithStackingStack>
  );
};

export { UserWalletSheet };