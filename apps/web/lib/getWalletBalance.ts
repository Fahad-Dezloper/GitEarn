import axios from "axios";

const ALCHEMY_RPC_URL = `https://solana-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`;

export async function getSolanaWalletInfo(walletAddress: string) {
  try {
    const balanceRes = await axios.post(ALCHEMY_RPC_URL, {
      jsonrpc: "2.0",
      id: 1,
      method: "getBalance",
      params: [walletAddress],
    });

    const lamports = balanceRes.data.result.value;
    const solBalance = lamports / 1e9;

    const txHistoryRes = await axios.post(ALCHEMY_RPC_URL, {
      jsonrpc: "2.0",
      id: 1,
      method: "getSignaturesForAddress",
      params: [walletAddress, { limit: 10 }],
    });

    const transactions = txHistoryRes.data.result;

    const priceRes = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
    );

    const solPriceUSD = priceRes.data.solana.usd;
    const usdBalance = solBalance * solPriceUSD;

    return {
      sol: solBalance,
      usd: usdBalance,
      transactions,
    };
  } catch (error) {
    console.error("Failed to fetch wallet info:", error);
    throw error;
  }
}