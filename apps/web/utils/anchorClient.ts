import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program, web3 } from "@project-serum/anchor";
import idl from "./idl.json"; // Import your IDL file

const programID = new PublicKey("7iVCYAvwKHvoYxGJHNMUrpLYTJt3f6bacY6iAiJRZ5D2"); // Replace with your Program ID
const network = "https://api.devnet.solana.com"; // Devnet RPC
const connection = new Connection(network, "processed");

export const getProvider = (wallet) => {
  if (!wallet) throw new Error("Wallet not found");

  return new AnchorProvider(
    connection,
    wallet,
    AnchorProvider.defaultOptions()
  );
};

export const getProgram = (wallet) => {
  const provider = getProvider(wallet);
  return new Program(idl, programID, provider);
};
