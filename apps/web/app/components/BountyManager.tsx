'use client';

import { useState } from 'react';
import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { createCreateBountyInstruction, createCancelBountyInstruction } from '@/utils/generated'; // assuming you generated your IDL client

const PROGRAM_ID = new PublicKey('7iVCYAvwKHvoYxGJHNMUrpLYTJt3f6bacY6iAiJRZ5D2'); // your deployed program ID
const USDC_MINT = new PublicKey('9WAVXbbcF8x2NT4ZyVhn5kjohyPbwhrcqyvgXnpwmA3f'); // your created token mint address

export default function Bounty() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [issueId, setIssueId] = useState('');
  const [amount, setAmount] = useState('');

  const createBounty = async () => {
    if (!publicKey) return alert('Connect wallet first');

    const bountySeed = `${issueId}_bounty`;
    const [bountyPDA] = await PublicKey.findProgramAddressSync(
      [Buffer.from(bountySeed)],
      PROGRAM_ID
    );

    const [bountyVaultPDA] = await PublicKey.findProgramAddressSync(
      [Buffer.from('vault'), bountyPDA.toBuffer()],
      PROGRAM_ID
    );

    const userUSDCAccount = await getAssociatedTokenAddress(USDC_MINT, publicKey);

    const tx = new Transaction();

    const ix = createCreateBountyInstruction(
      {
        creator: publicKey,
        bounty: bountyPDA,
        bountyVault: bountyVaultPDA,
        creatorUsdcAccount: userUSDCAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
      {
        issueId,
        amount: BigInt(Number(amount) * 1_000_000_000), // 1 USDC = 1_000_000_000 (9 decimals)
      }
    );

    tx.add(ix);

    const signature = await sendTransaction(tx, connection);
    await connection.confirmTransaction(signature, 'confirmed');

    alert(`Bounty Created! Tx: ${signature}`);
  };

  const cancelBounty = async () => {
    if (!publicKey) return alert('Connect wallet first');

    const bountySeed = `${issueId}_bounty`;
    const [bountyPDA] = await PublicKey.findProgramAddressSync(
      [Buffer.from(bountySeed)],
      PROGRAM_ID
    );

    const [bountyVaultPDA] = await PublicKey.findProgramAddressSync(
      [Buffer.from('vault'), bountyPDA.toBuffer()],
      PROGRAM_ID
    );

    const userUSDCAccount = await getAssociatedTokenAddress(USDC_MINT, publicKey);

    const tx = new Transaction();

    const ix = createCancelBountyInstruction(
      {
        creator: publicKey,
        bounty: bountyPDA,
        bountyVault: bountyVaultPDA,
        creatorUsdcAccount: userUSDCAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      }
    );

    tx.add(ix);

    const signature = await sendTransaction(tx, connection);
    await connection.confirmTransaction(signature, 'confirmed');

    alert(`Bounty Cancelled! Tx: ${signature}`);
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Create or Cancel Bounty</h1>
      <input
        type="text"
        className="border w-full p-2 rounded"
        placeholder="Issue ID"
        value={issueId}
        onChange={(e) => setIssueId(e.target.value)}
      />
      <input
        type="number"
        className="border w-full p-2 rounded"
        placeholder="Amount (USDC)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button
        onClick={createBounty}
        className="bg-green-500 text-white w-full p-2 rounded hover:bg-green-600"
      >
        Create Bounty
      </button>
      <button
        onClick={cancelBounty}
        className="bg-red-500 text-white w-full p-2 rounded hover:bg-red-600"
      >
        Cancel Bounty
      </button>
    </div>
  );
}
