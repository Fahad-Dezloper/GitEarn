// This is a suggested implementation/fix for your wallet generation function
// Replace your existing implementation with this if the issue is related to the wallet keypair

import crypto from 'crypto';

export interface WalletKeypair {
  publicKey: string;
  secretKey: string; // Make sure this is a string to avoid toString() issues
}

export function generateWalletKeypair(): WalletKeypair {
  try {
    // Generate a keypair using crypto
    const keyPair = crypto.generateKeyPairSync('ed25519', {
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });

    // Extract the keys
    const publicKey = keyPair.publicKey
      .replace('-----BEGIN PUBLIC KEY-----\n', '')
      .replace('\n-----END PUBLIC KEY-----', '')
      .replace(/\n/g, '');
    
    const secretKey = keyPair.privateKey
      .replace('-----BEGIN PRIVATE KEY-----\n', '')
      .replace('\n-----END PRIVATE KEY-----', '')
      .replace(/\n/g, '');

    // Return as strings to avoid toString() issues
    return {
      publicKey,
      secretKey
    };
  } catch (error) {
    console.error('Error generating wallet keypair:', error);
    throw new Error(`Failed to generate wallet keypair: ${error}`);
  }
}