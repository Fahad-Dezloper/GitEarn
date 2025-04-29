"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useUserDetails } from "../context/UserDetailsProvider";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import { ed25519 } from "@noble/curves/ed25519";
import bs58 from "bs58";
import { CopyIcon } from "@/components/ui/copy";
import axios from "axios";

export default function AddWallet() {
  const { publicKey, signMessage, connected } = useWallet();
  const { userDetailss, addWalletAdd, walletAdd } = useUserDetails();
  const [copied, setCopied] = useState(false);

  // console.log("user details here", walletAdd);

  const [dbWallet, setDbWallet] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (walletAdd) {
      setDbWallet(walletAdd);
    }
  }, [walletAdd]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDbWallet(e.target.value);
  };

  const handleAddWalletAddress = async () => {
    if (!publicKey || !signMessage || !dbWallet) {
      alert("Ensure wallet is connected and input is filled.");
      return;
    }

    try {
      setLoading(true);

      const message = "verify-wallet"; // or generate a random nonce
        const encodedMessage = new TextEncoder().encode(message);
        const signature = await signMessage(encodedMessage);

        const isValid = ed25519.verify(
          signature,
          encodedMessage,
          publicKey.toBytes()
        );

      if (!isValid) {
        alert("Invalid signature");
        return;
      }

      // console.log("sending this", dbWallet);
      const res = await addWalletAdd({dbWallet});

      alert("Wallet address saved!");
      setIsEditing(false);
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Connected Wallet */}
      <div className="flex items-center gap-2">
  {connected && publicKey ? (
    <>
      <Input value={publicKey.toBase58()} disabled />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              navigator.clipboard.writeText(publicKey.toBase58());
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          >
            <CopyIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{copied ? "Copied!" : "Copy"}</p>
        </TooltipContent>
      </Tooltip>
    </>
  ) : (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center">
          <Input
            value="Not Connected"
            disabled
            className="cursor-not-allowed"
          />
          <span className="ml-2 text-gray-400">ⓘ</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>Connect your wallet</p>
      </TooltipContent>
    </Tooltip>
  )}
</div>

      {/* Permanent Wallet from DB */}
      <div className="flex items-center gap-2">
        <Input
          value={dbWallet ?? ""}
          onChange={handleInputChange}
          disabled={!isEditing && !!dbWallet}
          placeholder="Permanent Wallet Address"
        />
        {!dbWallet && connected && (
          <Button onClick={handleAddWalletAddress} disabled={loading}>
            {loading ? "Saving..." : "+"}
          </Button>
        )}
        {dbWallet && !isEditing && (
          <Button onClick={handleEdit}>Edit</Button>
        )}
        {dbWallet && isEditing && (
          <Button onClick={handleAddWalletAddress} disabled={loading}>
            {loading ? "Confirming..." : "Confirm"}
          </Button>
        )}
      </div>
    </div>
  );
}
