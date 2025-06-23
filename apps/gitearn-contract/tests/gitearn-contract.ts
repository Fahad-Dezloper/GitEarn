import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { BountyVault } from "../target/types/bounty_vault";
import { expect } from "chai";
import { PublicKey, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";

describe("bounty-vault", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.BountyVault as Program<BountyVault>;
  
  // Test accounts
  let vaultPda: PublicKey;
  let vaultBump: number;
  let authority: Keypair;
  let depositor: Keypair;
  let contributor: Keypair;
  let tipper: Keypair;

  before(async () => {
    // Initialize test accounts
    authority = Keypair.generate();
    depositor = Keypair.generate();
    contributor = Keypair.generate();
    tipper = Keypair.generate();

    // Airdrop SOL to test accounts
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(authority.publicKey, 2 * LAMPORTS_PER_SOL)
    );
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(depositor.publicKey, 2 * LAMPORTS_PER_SOL)
    );
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(contributor.publicKey, 2 * LAMPORTS_PER_SOL)
    );
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(tipper.publicKey, 2 * LAMPORTS_PER_SOL)
    );

    // Find vault PDA
    [vaultPda, vaultBump] = await PublicKey.findProgramAddress(
      [Buffer.from("vault")],
      program.programId
    );
  });

  describe("Vault Initialization", () => {
    it("Should initialize vault successfully", async () => {
      await program.methods
        .initializeVault()
        .accounts({
          vault: vaultPda,
          authority: authority.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([authority])
        .rpc();

      const vaultAccount = await program.account.vault.fetch(vaultPda);
      expect(vaultAccount.authority.toString()).to.equal(authority.publicKey.toString());
      expect(vaultAccount.totalDeposited.toNumber()).to.equal(0);
      expect(vaultAccount.totalWithdrawn.toNumber()).to.equal(0);
      expect(vaultAccount.bump).to.equal(vaultBump);
    });

    it("Should fail to initialize vault twice", async () => {
      try {
        await program.methods
          .initializeVault()
          .accounts({
            vault: vaultPda,
            authority: authority.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([authority])
          .rpc();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.include("already in use");
      }
    });
  });

  describe("Bounty Management", () => {
    const issueId = "test-issue-123";
    const issueUrl = "https://github.com/user/repo/issues/123";
    const bountyAmount = 0.1 * LAMPORTS_PER_SOL;
    let bountyPda: PublicKey;

    before(async () => {
      [bountyPda] = await PublicKey.findProgramAddress(
        [Buffer.from("bounty"), Buffer.from(issueId)],
        program.programId
      );
    });

    it("Should deposit bounty successfully", async () => {
      const initialBalance = await provider.connection.getBalance(depositor.publicKey);
      
      await program.methods
        .depositBounty(new anchor.BN(bountyAmount), issueId, issueUrl)
        .accounts({
          vault: vaultPda,
          bounty: bountyPda,
          depositor: depositor.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([depositor])
        .rpc();

      const bountyAccount = await program.account.bounty.fetch(bountyPda);
      expect(bountyAccount.depositor.toString()).to.equal(depositor.publicKey.toString());
      expect(bountyAccount.amount.toNumber()).to.equal(bountyAmount);
      expect(bountyAccount.issueId).to.equal(issueId);
      expect(bountyAccount.issueUrl).to.equal(issueUrl);
      expect(bountyAccount.status).to.deep.equal({ active: {} });
      expect(bountyAccount.contributor).to.be.null;

      const finalBalance = await provider.connection.getBalance(depositor.publicKey);
      expect(initialBalance - finalBalance).to.be.greaterThan(bountyAmount);

      const vaultAccount = await program.account.vault.fetch(vaultPda);
      expect(vaultAccount.totalDeposited.toNumber()).to.equal(bountyAmount);
    });

    it("Should fail to deposit bounty with zero amount", async () => {
      const invalidIssueId = "invalid-issue";
      const [invalidBountyPda] = await PublicKey.findProgramAddress(
        [Buffer.from("bounty"), Buffer.from(invalidIssueId)],
        program.programId
      );

      try {
        await program.methods
          .depositBounty(new anchor.BN(0), invalidIssueId, issueUrl)
          .accounts({
            vault: vaultPda,
            bounty: invalidBountyPda,
            depositor: depositor.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([depositor])
          .rpc();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.include("Invalid amount");
      }
    });

    it("Should claim bounty successfully", async () => {
      await program.methods
        .claimBounty(contributor.publicKey)
        .accounts({
          bounty: bountyPda,
          depositor: depositor.publicKey,
        })
        .signers([depositor])
        .rpc();

      const bountyAccount = await program.account.bounty.fetch(bountyPda);
      expect(bountyAccount.status).to.deep.equal({ claimed: {} });
      expect(bountyAccount.contributor.toString()).to.equal(contributor.publicKey.toString());
    });

    it("Should fail to claim bounty with unauthorized depositor", async () => {
      try {
        await program.methods
          .claimBounty(contributor.publicKey)
          .accounts({
            bounty: bountyPda,
            depositor: authority.publicKey,
          })
          .signers([authority])
          .rpc();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.include("Unauthorized depositor");
      }
    });

    it("Should approve bounty successfully", async () => {
      await program.methods
        .approveBounty()
        .accounts({
          bounty: bountyPda,
          depositor: depositor.publicKey,
        })
        .signers([depositor])
        .rpc();

      const bountyAccount = await program.account.bounty.fetch(bountyPda);
      expect(bountyAccount.status).to.deep.equal({ approved: {} });
    });

    it("Should withdraw bounty successfully", async () => {
      const initialBalance = await provider.connection.getBalance(contributor.publicKey);
      
      await program.methods
        .withdrawBounty()
        .accounts({
          vault: vaultPda,
          bounty: bountyPda,
          contributor: contributor.publicKey,
        })
        .rpc();

      const bountyAccount = await program.account.bounty.fetch(bountyPda);
      expect(bountyAccount.status).to.deep.equal({ completed: {} });

      const finalBalance = await provider.connection.getBalance(contributor.publicKey);
      expect(finalBalance - initialBalance).to.equal(bountyAmount);

      const vaultAccount = await program.account.vault.fetch(vaultPda);
      expect(vaultAccount.totalWithdrawn.toNumber()).to.equal(bountyAmount);
    });

    it("Should fail to withdraw completed bounty", async () => {
      try {
        await program.methods
          .withdrawBounty()
          .accounts({
            vault: vaultPda,
            bounty: bountyPda,
            contributor: contributor.publicKey,
          })
          .rpc();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.include("Bounty is not approved");
      }
    });
  });

  describe("Bounty Cancellation", () => {
    const cancelIssueId = "cancel-issue-456";
    const cancelIssueUrl = "https://github.com/user/repo/issues/456";
    const cancelBountyAmount = 0.05 * LAMPORTS_PER_SOL;
    let cancelBountyPda: PublicKey;

    before(async () => {
      [cancelBountyPda] = await PublicKey.findProgramAddress(
        [Buffer.from("bounty"), Buffer.from(cancelIssueId)],
        program.programId
      );

      // Deposit bounty first
      await program.methods
        .depositBounty(new anchor.BN(cancelBountyAmount), cancelIssueId, cancelIssueUrl)
        .accounts({
          vault: vaultPda,
          bounty: cancelBountyPda,
          depositor: depositor.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([depositor])
        .rpc();
    });

    it("Should cancel bounty successfully", async () => {
      const initialBalance = await provider.connection.getBalance(depositor.publicKey);
      
      await program.methods
        .cancelBounty()
        .accounts({
          vault: vaultPda,
          bounty: cancelBountyPda,
          depositor: depositor.publicKey,
        })
        .signers([depositor])
        .rpc();

      const bountyAccount = await program.account.bounty.fetch(cancelBountyPda);
      expect(bountyAccount.status).to.deep.equal({ cancelled: {} });

      const finalBalance = await provider.connection.getBalance(depositor.publicKey);
      expect(finalBalance - initialBalance).to.equal(cancelBountyAmount);
    });

    it("Should fail to cancel already cancelled bounty", async () => {
      try {
        await program.methods
          .cancelBounty()
          .accounts({
            vault: vaultPda,
            bounty: cancelBountyPda,
            depositor: depositor.publicKey,
          })
          .signers([depositor])
          .rpc();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.include("Bounty is not active");
      }
    });
  });

  describe("Tip Management", () => {
    const tipAmount = 0.02 * LAMPORTS_PER_SOL;
    const tipMessage = "Great work on this issue!";
    let tipPda: PublicKey;

    before(async () => {
      [tipPda] = await PublicKey.findProgramAddress(
        [Buffer.from("tip"), tipper.publicKey.toBuffer(), contributor.publicKey.toBuffer()],
        program.programId
      );
    });

    it("Should deposit tip successfully", async () => {
      const initialBalance = await provider.connection.getBalance(tipper.publicKey);
      
      await program.methods
        .depositTip(new anchor.BN(tipAmount), contributor.publicKey, tipMessage)
        .accounts({
          vault: vaultPda,
          tip: tipPda,
          tipper: tipper.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([tipper])
        .rpc();

      const tipAccount = await program.account.tip.fetch(tipPda);
      expect(tipAccount.tipper.toString()).to.equal(tipper.publicKey.toString());
      expect(tipAccount.recipient.toString()).to.equal(contributor.publicKey.toString());
      expect(tipAccount.amount.toNumber()).to.equal(tipAmount);
      expect(tipAccount.message).to.equal(tipMessage);
      expect(tipAccount.status).to.deep.equal({ pending: {} });

      const finalBalance = await provider.connection.getBalance(tipper.publicKey);
      expect(initialBalance - finalBalance).to.be.greaterThan(tipAmount);
    });

    it("Should claim tip successfully", async () => {
      const initialBalance = await provider.connection.getBalance(contributor.publicKey);
      
      await program.methods
        .claimTip()
        .accounts({
          vault: vaultPda,
          tip: tipPda,
          recipient: contributor.publicKey,
        })
        .rpc();

      const tipAccount = await program.account.tip.fetch(tipPda);
      expect(tipAccount.status).to.deep.equal({ claimed: {} });

      const finalBalance = await provider.connection.getBalance(contributor.publicKey);
      expect(finalBalance - initialBalance).to.equal(tipAmount);
    });

    it("Should fail to claim already claimed tip", async () => {
      try {
        await program.methods
          .claimTip()
          .accounts({
            vault: vaultPda,
            tip: tipPda,
            recipient: contributor.publicKey,
          })
          .rpc();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.include("Tip is not pending");
      }
    });

    it("Should fail to claim tip with unauthorized recipient", async () => {
      const unauthorizedTipMessage = "Unauthorized tip";
      const [unauthorizedTipPda] = await PublicKey.findProgramAddress(
        [Buffer.from("tip"), tipper.publicKey.toBuffer(), authority.publicKey.toBuffer()],
        program.programId
      );

      // First deposit a tip
      await program.methods
        .depositTip(new anchor.BN(tipAmount), authority.publicKey, unauthorizedTipMessage)
        .accounts({
          vault: vaultPda,
          tip: unauthorizedTipPda,
          tipper: tipper.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([tipper])
        .rpc();

      // Try to claim with wrong recipient
      try {
        await program.methods
          .claimTip()
          .accounts({
            vault: vaultPda,
            tip: unauthorizedTipPda,
            recipient: contributor.publicKey,
          })
          .rpc();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.include("Unauthorized recipient");
      }
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("Should handle insufficient funds gracefully", async () => {
      const poorUser = Keypair.generate();
      const largeAmount = 10 * LAMPORTS_PER_SOL;
      const issueId = "poor-user-issue";
      const [poorUserBountyPda] = await PublicKey.findProgramAddress(
        [Buffer.from("bounty"), Buffer.from(issueId)],
        program.programId
      );

      try {
        await program.methods
          .depositBounty(new anchor.BN(largeAmount), issueId, "https://example.com")
          .accounts({
            vault: vaultPda,
            bounty: poorUserBountyPda,
            depositor: poorUser.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([poorUser])
          .rpc();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.include("insufficient");
      }
    });

    it("Should validate empty issue ID", async () => {
      const emptyIssueId = "";
      const [emptyBountyPda] = await PublicKey.findProgramAddress(
        [Buffer.from("bounty"), Buffer.from(emptyIssueId)],
        program.programId
      );

      try {
        await program.methods
          .depositBounty(new anchor.BN(LAMPORTS_PER_SOL * 0.1), emptyIssueId, "https://example.com")
          .accounts({
            vault: vaultPda,
            bounty: emptyBountyPda,
            depositor: depositor.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([depositor])
          .rpc();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.include("Invalid issue ID");
      }
    });

    it("Should validate empty issue URL", async () => {
      const validIssueId = "valid-issue-empty-url";
      const [validBountyPda] = await PublicKey.findProgramAddress(
        [Buffer.from("bounty"), Buffer.from(validIssueId)],
        program.programId
      );

      try {
        await program.methods
          .depositBounty(new anchor.BN(LAMPORTS_PER_SOL * 0.1), validIssueId, "")
          .accounts({
            vault: vaultPda,
            bounty: validBountyPda,
            depositor: depositor.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([depositor])
          .rpc();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.include("Invalid issue URL");
      }
    });
  });

  describe("Event Emissions", () => {
    it("Should emit BountyDeposited event", async () => {
      const eventIssueId = "event-test-issue";
      const eventIssueUrl = "https://github.com/test/events/issues/1";
      const eventAmount = 0.03 * LAMPORTS_PER_SOL;
      const [eventBountyPda] = await PublicKey.findProgramAddress(
        [Buffer.from("bounty"), Buffer.from(eventIssueId)],
        program.programId
      );

      const listener = program.addEventListener("BountyDeposited", (event) => {
        expect(event.bounty.toString()).to.equal(eventBountyPda.toString());
        expect(event.depositor.toString()).to.equal(depositor.publicKey.toString());
        expect(event.amount.toNumber()).to.equal(eventAmount);
        expect(event.issueId).to.equal(eventIssueId);
        expect(event.issueUrl).to.equal(eventIssueUrl);
      });

      await program.methods
        .depositBounty(new anchor.BN(eventAmount), eventIssueId, eventIssueUrl)
        .accounts({
          vault: vaultPda,
          bounty: eventBountyPda,
          depositor: depositor.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([depositor])
        .rpc();

      program.removeEventListener(listener);
    });

    it("Should emit TipDeposited event", async () => {
      const eventTipAmount = 0.01 * LAMPORTS_PER_SOL;
      const eventTipMessage = "Event test tip";
      const [eventTipPda] = await PublicKey.findProgramAddress(
        [Buffer.from("tip"), tipper.publicKey.toBuffer(), depositor.publicKey.toBuffer()],
        program.programId
      );

      const listener = program.addEventListener("TipDeposited", (event) => {
        expect(event.tip.toString()).to.equal(eventTipPda.toString());
        expect(event.tipper.toString()).to.equal(tipper.publicKey.toString());
        expect(event.recipient.toString()).to.equal(depositor.publicKey.toString());
        expect(event.amount.toNumber()).to.equal(eventTipAmount);
        expect(event.message).to.equal(eventTipMessage);
      });

      await program.methods
        .depositTip(new anchor.BN(eventTipAmount), depositor.publicKey, eventTipMessage)
        .accounts({
          vault: vaultPda,
          tip: eventTipPda,
          tipper: tipper.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([tipper])
        .rpc();

      program.removeEventListener(listener);
    });
  });

  describe("Vault State Management", () => {
    it("Should track total deposited and withdrawn correctly", async () => {
      const vaultAccount = await program.account.vault.fetch(vaultPda);
      
      // The exact values depend on all previous tests
      expect(vaultAccount.totalDeposited.toNumber()).to.be.greaterThan(0);
      expect(vaultAccount.totalWithdrawn.toNumber()).to.be.greaterThan(0);
      
      // Total deposited should be greater than or equal to total withdrawn
      expect(vaultAccount.totalDeposited.toNumber()).to.be.greaterThanOrEqual(
        vaultAccount.totalWithdrawn.toNumber()
      );
    });

    it("Should maintain correct vault balance", async () => {
      const vaultAccount = await program.account.vault.fetch(vaultPda);
      const vaultBalance = await provider.connection.getBalance(vaultPda);
      
      // Vault balance should reflect the difference between deposits and withdrawals
      const expectedBalance = vaultAccount.totalDeposited.toNumber() - vaultAccount.totalWithdrawn.toNumber();
      
      // Allow for small discrepancies due to rent and fees
      expect(Math.abs(vaultBalance - expectedBalance)).to.be.lessThan(0.01 * LAMPORTS_PER_SOL);
    });
  });
});