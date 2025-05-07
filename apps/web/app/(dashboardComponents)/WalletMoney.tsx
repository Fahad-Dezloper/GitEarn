"use client";
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { Wallet } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useUserDetails } from '../context/UserDetailsProvider';

export default function WalletMoney() {
  const { walletAdd } = useUserDetails();
  const [usdBalance, setUsdBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

  useEffect(() => {
    const fetchBalance = async () => {
      if (!walletAdd) return;

      try {
        setLoading(true);
        setError(null);

        const wallet = new PublicKey(walletAdd); // safe now
        const lamports = await connection.getBalance(wallet);
        const sol = lamports / 1_000_000_000;

        const res = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
        );
        const data = await res.json();
        const solPrice = data.solana.usd;

        setUsdBalance(sol * solPrice);
      } catch (e) {
        console.error('Error fetching balance:', e);
        setError('Failed to load balance');
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [walletAdd]);

  // Show loading or placeholder while waiting for wallet address
  if (!walletAdd) {
    return (
      <div className="flex px-4 bg-gray-700 py-2 cursor-pointer border rounded-full items-center gap-2">
        <Wallet size={20} />
        Connecting...
      </div>
    );
  }

  return (
    <div className="flex px-4 bg-gray-700 py-2 cursor-pointer border rounded-full items-center gap-2">
      <Wallet size={20} />
      {loading
        ? 'Loading...'
        : error
        ? error
        : usdBalance !== null
        ? `$${usdBalance.toFixed(2)}`
        : 'N/A'}
    </div>
  );
}
