/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { CopyIcon } from "@/components/ui/copy";

export default function AddWallet({walletAddress}: {walletAddress: string}) {
  const { publicKey, signMessage, connected } = useWallet();
  const [copied, setCopied] = useState(false);

  const [dbWallet, setDbWallet] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleAddWalletAddress = async () => {
    if (!publicKey || !signMessage || !dbWallet) {
      alert("Ensure wallet is connected and input is filled.");
      return;
    }

    try {
      setLoading(true);

      const message = "verify-wallet";
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

      <div className="flex items-center gap-2">
        <Input
            value={walletAddress ?? ""}
          disabled={!isEditing && !!walletAddress}
          placeholder="Permanent Wallet Address"
        />
        {!walletAddress && connected && (
          <Button onClick={handleAddWalletAddress} disabled={loading}>
            {loading ? "Saving..." : "+"}
          </Button>
        )}
        {!walletAddress && !isEditing && (
          <Button onClick={handleEdit}>Edit</Button>
        )}
        {walletAddress && isEditing && (
          <Button onClick={handleAddWalletAddress} disabled={loading}>
            {loading ? "Confirming..." : "Confirm"}
          </Button>
        )}
      </div>
    </div>
  );
}
