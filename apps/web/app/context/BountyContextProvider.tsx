"use client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Keypair,
  PublicKey,
  Connection,
  clusterApiUrl,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction as SolanaTransaction,
} from "@solana/web3.js";
import axios from "axios";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import bs58 from "bs58";
import { toast } from "sonner";

interface BountyIssue {
  id: string;
  userId: string;
  githubId: bigint;
  htmlUrl: string;
  status: 'PENDING' | 'ACTIVE' | 'CLAIMING' | 'CLAIMED' | 'APPROVED' | 'CANCELLING' | 'CANCELED' | 'FAILED' | 'TIPPING' | 'TIPPED';
  contributorId?: string;
  contributorClaimedAdd?: string;
  bountyAmount: number;
  bountyAmountInLamports: number;
  createdAt: Date;
  updatedAt: Date;
}

interface BountyTransaction {
  id: string;
  bountyIssueId: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'PAYOUT' | 'CLAIM';
  status: 'PENDING' | 'CONFIRMED' | 'FAILED';
  txnHash?: string;
  bountyAmount: number;
  bountyAmountInLamports: number;
  createdAt: Date;
}

interface BountyContextType {
  issuesRepo: BountyIssue[];
  setIssuesRepo: React.Dispatch<React.SetStateAction<BountyIssue[]>>;
  addBounty: (
    bountyAmt: number,
    issueId: string,
    issueLink: string,
    lamports: number,
    title?: string,
    transactionId?: string
  ) => Promise<void>;
  approveBounty: (
    issueId: string,
    issueLink: string,
    contributorId: string,
    contributorUserName: string
  ) => Promise<void>;
  bountyIssues: BountyIssue[];
  setBountyIssues: React.Dispatch<React.SetStateAction<BountyIssue[]>>;
  userBountyIssue: BountyIssue[];
  removeBounty: ({
    txnId,
    issueId,
    issueLink,
    lamports,
  }: {
    txnId?: string;
    issueId: string;
    issueLink: string;
    lamports: number;
  }) => Promise<void>;
  claimMoney: (
    contributorId: string,
    walletAdd: string,
    bountyAmountInLamports: number,
    githubId: string,
    htmlUrl: string,
    status: string
  ) => Promise<void>;
  bountiesCreated: BountyTransaction[];
  bountiesClaimed: BountyTransaction[];
  isLoading: boolean;
  claimBounties: BountyIssue[];
  tip: (
    bountyAmt: number,
    issueId: string,
    issueLink: string,
    lamports: number,
    title?: string,
    transactionId?: string
  ) => Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const BountyDetailsContext = createContext<BountyContextType | undefined>(
  undefined
);

export function BountyContextProvder({ children }: { children: ReactNode }) {
  const [issuesRepo, setIssuesRepo] = useState<BountyIssue[]>([]);
  const [bountyIssues, setBountyIssues] = useState<BountyIssue[]>([]);
  const [userBountyIssue, setUserBountyIssue] = useState<BountyIssue[]>([]);
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [bountiesCreated, setBountiesCreated] = useState<BountyTransaction[]>([]);
  const [bountiesClaimed, setBountiesClaimed] = useState<BountyTransaction[]>([]);
  const [claimBounties, setClaimBounties] = useState<BountyIssue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function getIssues() {
    try {
      const res = await axios.get(`/api/issues/get`);
      const reposWithIssues = res.data.filter(
        (repo: { issues: BountyIssue[] }) =>
          repo.issues && repo.issues.length > 0
      );
      setIssuesRepo(reposWithIssues);
    } catch {
      toast.error("Error fetching issues");
    }
  }

  async function getUserBountyIssues() {
    try {
      const res = await axios.get("/api/user/bountyIssues");
      setUserBountyIssue(res.data.UsersBountyIssues);
    } catch {
      toast.error("Error fetching user bounty issues");
    }
  }

  async function getBountyIssues() {
    try {
      if (bountyIssues.length === 0) {
        setIsLoading(true);
      }
      const res = await axios.get(
        `${window.location.origin}/api/issues/bounty`
      );
      setBountyIssues(res.data.BountyIssues);
    } catch {
      toast.error("Error fetching bounty issues");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getIssues();
    getUserBountyIssues();
    getBountyIssues();
    getBountiesCreated();
    getBountiesClaimed();
    fetchUserMoneyClaimed();

    const interval = setInterval(() => {
      if (bountyIssues.length > 0) {
        getBountyIssues();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [bountyIssues?.length]);

  async function addBounty(
    bountyAmt: number,
    issueId: string,
    issueLink: string,
    lamports: number,
    title?: string,
    transactionId?: string
  ) {
    try {
      if (transactionId) {
        if (!publicKey) {
          toast.error("Wallet not connected");
          return;
        }

        const transaction = new SolanaTransaction();
        const sendSolInstruction = SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(
            "6ZDPeVxyRyxQubevCKTM56tUhFq1PRib2BZ66kEp8zrz"
          ),
          lamports: lamports,
        });

        transaction.add(sendSolInstruction);

        const signature = await sendTransaction(transaction, connection);

        try {
          const commitment = "confirmed";
          const latestBlockHash =
            await connection.getLatestBlockhash(commitment);

          const confirmationResult = await connection.confirmTransaction(
            {
              signature: signature,
              blockhash: latestBlockHash.blockhash,
              lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            },
            commitment
          );

          if (confirmationResult.value.err) {
            toast.error(`Transaction failed: ${confirmationResult.value.err}`);
            return;
          } else {
            const confirm = await axios.post("/api/bounty/confirm", {
              bountyAmt,
              issueId,
              issueLink,
              signature,
              from: publicKey.toString(),
              lamports,
              transactionId,
            });

            setBountyIssues(confirm.data.bountyIssues);
            getIssues();
            getUserBountyIssues();
            getBountiesCreated();
            toast.success("Bounty added successfully");
          }
        } catch {
          toast.error("Error confirming transaction");
          return;
        }
      } else {
        if (!publicKey) {
          toast.error("Wallet not connected");
          return;
        }

        const add = await axios.post("/api/bounty/add", {
          bountyAmt,
          issueId,
          issueLink,
          lamports: lamports,
        });

        const transactionIdd = add.data.transaction.id;

        const transaction = new SolanaTransaction();
        const sendSolInstruction = SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(
            "6ZDPeVxyRyxQubevCKTM56tUhFq1PRib2BZ66kEp8zrz"
          ),
          lamports: lamports,
        });

        transaction.add(sendSolInstruction);

        const signature = await sendTransaction(transaction, connection);

        try {
          const commitment = "confirmed";
          const latestBlockHash =
            await connection.getLatestBlockhash(commitment);

          const confirmationResult = await connection.confirmTransaction(
            {
              signature: signature,
              blockhash: latestBlockHash.blockhash,
              lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            },
            commitment
          );

          if (confirmationResult.value.err) {
            toast.error(`Transaction failed: ${confirmationResult.value.err}`);
            return;
          } else {
            const confirm = await axios.post("/api/bounty/confirm", {
              bountyAmt,
              issueId,
              issueLink,
              signature,
              from: publicKey.toString(),
              lamports,
              transactionId: transactionIdd,
            });

            setBountyIssues(confirm.data.bountyIssues);
            getIssues();
            getUserBountyIssues();
            toast.success("Bounty added successfully");
          }
        } catch {
          toast.error("Error confirming transaction");
          return;
        }
      }
    } catch {
      toast.error("Error adding bounty to the issue");
    }
  }

  async function tip(
    bountyAmt: number,
    issueId: string,
    issueLink: string,
    lamports: number,
    title?: string,
    transactionId?: string
  ) {
    try {
      if (transactionId) {
        if (!publicKey) {
          toast.error("Wallet not connected");
          return;
        }

        const transaction = new SolanaTransaction();
        const sendSolInstruction = SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(
            "6ZDPeVxyRyxQubevCKTM56tUhFq1PRib2BZ66kEp8zrz"
          ),
          lamports: lamports,
        });

        transaction.add(sendSolInstruction);

        const signature = await sendTransaction(transaction, connection);

        try {
          const commitment = "confirmed";
          const latestBlockHash =
            await connection.getLatestBlockhash(commitment);

          const confirmationResult = await connection.confirmTransaction(
            {
              signature: signature,
              blockhash: latestBlockHash.blockhash,
              lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            },
            commitment
          );

          if (confirmationResult.value.err) {
            toast.error(`Transaction failed: ${confirmationResult.value.err}`);
            return;
          } else {
            const confirm = await axios.post("/api/bounty/tip", {
              signature,
              transactionId,
            });

            setBountyIssues(confirm.data.bountyIssues);
            getIssues();
            getUserBountyIssues();
            getBountiesCreated();
            toast.success("Tip sent successfully");
          }
        } catch {
          toast.error("Error confirming transaction");
          return;
        }
      } else {
        toast.error("No transaction created for this tip");
        return;
      }
    } catch {
      toast.error("Error tipping to the issue");
    }
  }

  async function removeBounty({
    txnId,
    issueId,
    issueLink,
    lamports,
  }: {
    txnId?: string;
    issueId: string;
    issueLink: string;
    lamports: number;
  }) {
    if (!process.env.NEXT_PUBLIC_PRIMARY_WALLET_ADD) {
      toast.error("PRIMARY_WALLET_ADD public key not available");
      return;
    }
    if (!process.env.NEXT_PUBLIC_PRIMARY_WALLET_PRIVATE_KEY) {
      toast.error("PRIMARY_WALLET_ADD private key not available");
      return;
    }

    try {
      if (txnId) {
        const transactionIdd = txnId;

        if (!publicKey) {
          toast.error("Wallet not connected");
          return;
        }

        const keypair = Keypair.fromSecretKey(
          bs58.decode(process.env.NEXT_PUBLIC_PRIMARY_WALLET_PRIVATE_KEY)
        );

        const transaction = new SolanaTransaction().add(
          SystemProgram.transfer({
            fromPubkey: keypair.publicKey,
            toPubkey: publicKey,
            lamports: lamports,
          })
        );

        const signature = await sendAndConfirmTransaction(
          connection,
          transaction,
          [keypair]
        );

        await axios.post("/api/bounty/remove", {
          issueId,
          issueLink,
          signature,
          lamports,
          to: publicKey,
          transactionId: transactionIdd,
        });

        getIssues();
        getUserBountyIssues();
        toast.success("Bounty removed successfully");
      } else {
        const remove = await axios.post("/api/bounty/remove/pending", {
          issueId,
          issueLink,
          lamports,
        });

        const transactionIdd = remove.data.transaction.id;

        if (!publicKey) {
          toast.error("Wallet not connected");
          return;
        }

        const keypair = Keypair.fromSecretKey(
          bs58.decode(process.env.NEXT_PUBLIC_PRIMARY_WALLET_PRIVATE_KEY)
        );

        const transaction = new SolanaTransaction().add(
          SystemProgram.transfer({
            fromPubkey: keypair.publicKey,
            toPubkey: publicKey,
            lamports: lamports,
          })
        );

        const signature = await sendAndConfirmTransaction(
          connection,
          transaction,
          [keypair]
        );

        await axios.post("/api/bounty/remove", {
          issueId,
          issueLink,
          signature,
          lamports,
          to: publicKey,
          transactionId: transactionIdd,
        });

        getIssues();
        getUserBountyIssues();
        toast.success("Bounty removed successfully");
      }
    } catch {
      toast.error("Error removing bounty");
    }
  }

  async function approveBounty(
    issueId: string,
    issueLink: string,
    contributorId: string,
    contributorUserName: string
  ) {
    try {
      await axios.post("/api/bounty/approve", {
        issueId,
        issueLink,
        contributorId,
        contributorUserName,
      });

      getIssues();
      getUserBountyIssues();
      toast.success("Bounty approved successfully");
    } catch {
      toast.error("Error approving the transaction");
    }
  }

  async function claimMoney(
    contributorId: string,
    walletAdd: string,
    bountyAmountInLamports: number,
    githubId: string,
    htmlUrl: string,
    status: string
  ) {
    try {
      if (!process.env.NEXT_PUBLIC_PRIMARY_WALLET_ADD) {
        toast.error("PRIMARY_WALLET_ADD public key not available");
        return;
      }
      if (!process.env.NEXT_PUBLIC_PRIMARY_WALLET_PRIVATE_KEY) {
        toast.error("PRIMARY_WALLET_ADD private key not available");
        return;
      }

      const claiming = await axios.post("/api/user/claim/pending", {
        contributorId,
        walletAdd,
        bountyAmountInLamports,
        githubId,
        htmlUrl,
        status,
      });

      const transactionIdd = claiming.data.transaction.id;

      const keypair = Keypair.fromSecretKey(
        bs58.decode(process.env.NEXT_PUBLIC_PRIMARY_WALLET_PRIVATE_KEY)
      );

      const transaction = new SolanaTransaction().add(
        SystemProgram.transfer({
          fromPubkey: keypair.publicKey,
          toPubkey: new PublicKey(walletAdd),
          lamports: bountyAmountInLamports,
        })
      );

      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [keypair]
      );

      try {
        const commitment = "confirmed";
        const latestBlockHash = await connection.getLatestBlockhash(commitment);

        const confirmationResult = await connection.confirmTransaction(
          {
            signature: signature,
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          },
          commitment
        );

        if (confirmationResult.value.err) {
          toast.error(`Transaction failed: ${confirmationResult.value.err}`);
          return;
        } else {
          if (status === "TIPPED") {
            await axios.post("/api/user/claim/tip", {
              transactionId: transactionIdd,
              to: walletAdd,
              signature: signature,
              lamports: bountyAmountInLamports,
              issueLink: htmlUrl,
              issueId: githubId,
            });
            toast.success("Tip claimed successfully");
          } else {
            await axios.post("/api/user/claim/approve", {
              transactionId: transactionIdd,
              to: walletAdd,
              signature: signature,
              lamports: bountyAmountInLamports,
              issueLink: htmlUrl,
              issueId: githubId,
            });
            toast.success("Bounty claimed successfully");
          }

          getBountiesCreated();
          getBountiesClaimed();
          fetchUserMoneyClaimed();
        }
      } catch {
        toast.error("Error confirming transaction");
        return;
      }
    } catch {
      toast.error("Error claiming bounty");
    }
  }

  async function fetchUserMoneyClaimed() {
    try {
      const res = await axios.get("/api/user/claim");
      setClaimBounties(res.data.claimBounties);
    } catch {
      toast.error("Error fetching claimed money");
    }
  }

  async function getBountiesCreated() {
    try {
      const res = await axios.get("/api/user/transaction/created");
      setBountiesCreated(res.data.data);
    } catch {
      toast.error("Error fetching created bounties");
    }
  }

  async function getBountiesClaimed() {
    try {
      const res = await axios.get("/api/user/transaction/claimed");
      setBountiesClaimed(res.data.data);
    } catch {
      toast.error("Error fetching claimed bounties");
    }
  }

  return (
    <BountyDetailsContext.Provider
      value={{
        issuesRepo,
        setIssuesRepo,
        addBounty,
        bountyIssues,
        setBountyIssues,
        userBountyIssue,
        removeBounty,
        approveBounty,
        claimMoney,
        bountiesCreated,
        bountiesClaimed,
        claimBounties,
        isLoading,
        tip,
      }}
    >
      {children}
    </BountyDetailsContext.Provider>
  );
}

export function useBountyDetails() {
  const context = useContext(BountyDetailsContext);
  if (context === undefined) {
    throw new Error(
      "useBountyDetails must be used within a BountyContextProvder"
    );
  }
  return context;
}
