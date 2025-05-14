"use server"
import {
    Connection,
    PublicKey,
    SystemProgram,
    Transaction,
    LAMPORTS_PER_SOL,
    clusterApiUrl,
  } from '@solana/web3.js';
  import crypto from 'crypto';
  
  const PRIVY_API_URL = 'https://api.privy.io/v1/wallets';
  
  type SendSolanaTxProps = {
    walletId: string;
    from: string; 
    to: string; 
    amount: number; 
    network?: 'devnet' | 'mainnet' | 'testnet';
  };

// withdraw bounty amount to personal wallet
export async function withdrawMoney({
    walletId,
    from,
    to,
    amount,
    network = 'devnet' as 'devnet' | 'mainnet' | 'testnet',
  }: SendSolanaTxProps) {
    const apiKey = process.env.PRIVY_API_KEY!;
    const apiSecret = process.env.PRIVY_CLIENT_SECRET!;
    const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID!;
    if (!apiKey || !apiSecret || !privyAppId) {
      throw new Error('Missing required environment variables: PRIVY_API_KEY, PRIVY_CLIENT_SECRET, or NEXT_PUBLIC_PRIVY_APP_ID');
    }
      
    console.log(`api key ${apiKey} api secret ${apiSecret} privyAppId ${privyAppId}`);
  
    // Auth header
    const authHeader = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
  
    // Signature
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = crypto
      .createHmac('sha256', apiSecret)
      .update(timestamp)
      .digest('hex');
    
    const connection = new Connection(clusterApiUrl(network), 'confirmed');
    const senderPubkey = new PublicKey(from);
    const recipientPubkey = new PublicKey(to);
  
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderPubkey,
        toPubkey: recipientPubkey,
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );
  
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = senderPubkey;
  
    const serializedTx = transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    });
  
    const base64Tx = Buffer.from(serializedTx).toString('base64');
  
    const caip2Map = {
      devnet: 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1',
      mainnet: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
      testnet: 'solana:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z',
    };
  
    const response = await fetch(`${PRIVY_API_URL}/${walletId}/rpc`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${authHeader}`,
        'Content-Type': 'application/json',
        'privy-app-id': privyAppId,
        'privy-authorization-signature': signature,
        'privy-authorization-timestamp': timestamp,
      },
      body: JSON.stringify({
        method: 'signAndSendTransaction',
        caip2: caip2Map[network],
        params: {
          transaction: base64Tx,
          encoding: 'base64',
        },
      }),
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Privy Error: ${JSON.stringify(error)}`);
    }
  
    const data = await response.json();
    return data;
  }