use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("AWcoqxvobj3YsotaSmpDisbrs7eBFQDKEUG4yqjZ4Zdk");

#[program]
pub mod bounty_vault {
    use super::*;

    pub fn initialize_vault(ctx: Context<InitializeVault>) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.authority = ctx.accounts.authority.key();
        vault.total_deposited = 0;
        vault.total_withdrawn = 0;
        vault.bump = ctx.bumps.vault;
        
        msg!("Vault initialized with authority: {}", vault.authority);
        Ok(())
    }

    pub fn deposit_bounty(
        ctx: Context<DepositBounty>,
        amount: u64,
        issue_id: String,
        issue_url: String,
    ) -> Result<()> {
        require!(amount > 0, BountyError::InvalidAmount);
        require!(!issue_id.is_empty(), BountyError::InvalidIssueId);
        require!(!issue_url.is_empty(), BountyError::InvalidIssueUrl);

        let vault = &mut ctx.accounts.vault;
        let bounty = &mut ctx.accounts.bounty;

        // Transfer SOL from user to vault
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.depositor.key(),
            &vault.key(),
            amount,
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.depositor.to_account_info(),
                vault.to_account_info(),
            ],
        )?;

        // Initialize bounty account
        bounty.depositor = ctx.accounts.depositor.key();
        bounty.amount = amount;
        bounty.issue_id = issue_id;
        bounty.issue_url = issue_url;
        bounty.status = BountyStatus::Active;
        bounty.contributor = None;
        bounty.created_at = Clock::get()?.unix_timestamp;
        bounty.updated_at = Clock::get()?.unix_timestamp;

        vault.total_deposited = vault.total_deposited.checked_add(amount).unwrap();

        emit!(BountyDeposited {
            bounty: bounty.key(),
            depositor: bounty.depositor,
            amount: bounty.amount,
            issue_id: bounty.issue_id.clone(),
            issue_url: bounty.issue_url.clone(),
        });

        Ok(())
    }

    pub fn claim_bounty(
        ctx: Context<ClaimBounty>,
        contributor_wallet: Pubkey,
    ) -> Result<()> {
        let bounty = &mut ctx.accounts.bounty;
        
        require!(bounty.status == BountyStatus::Active, BountyError::BountyNotActive);
        require!(bounty.depositor == ctx.accounts.depositor.key(), BountyError::UnauthorizedDepositor);

        bounty.contributor = Some(contributor_wallet);
        bounty.status = BountyStatus::Claimed;
        bounty.updated_at = Clock::get()?.unix_timestamp;

        Ok(())
    }

    pub fn approve_bounty(ctx: Context<ApproveBounty>) -> Result<()> {
        let bounty = &mut ctx.accounts.bounty;
        
        require!(bounty.status == BountyStatus::Claimed, BountyError::BountyNotClaimed);
        require!(bounty.depositor == ctx.accounts.depositor.key(), BountyError::UnauthorizedDepositor);

        bounty.status = BountyStatus::Approved;
        bounty.updated_at = Clock::get()?.unix_timestamp;

        Ok(())
    }

    pub fn withdraw_bounty(ctx: Context<WithdrawBounty>) -> Result<()> {
        let bounty = &mut ctx.accounts.bounty;
        let vault = &mut ctx.accounts.vault;
        
        require!(bounty.status == BountyStatus::Approved, BountyError::BountyNotApproved);
        require!(bounty.contributor.is_some(), BountyError::NoContributor);
        require!(bounty.contributor.unwrap() == ctx.accounts.contributor.key(), BountyError::UnauthorizedContributor);

        let amount = bounty.amount;
        
        // Transfer SOL from vault to contributor
        **vault.to_account_info().try_borrow_mut_lamports()? -= amount;
        **ctx.accounts.contributor.to_account_info().try_borrow_mut_lamports()? += amount;

        bounty.status = BountyStatus::Completed;
        bounty.updated_at = Clock::get()?.unix_timestamp;
        vault.total_withdrawn = vault.total_withdrawn.checked_add(amount).unwrap();

        emit!(BountyWithdrawn {
            bounty: bounty.key(),
            contributor: ctx.accounts.contributor.key(),
            amount,
        });

        Ok(())
    }

    pub fn cancel_bounty(ctx: Context<CancelBounty>) -> Result<()> {
        let bounty = &mut ctx.accounts.bounty;
        let vault = &mut ctx.accounts.vault;
        
        require!(bounty.status == BountyStatus::Active, BountyError::BountyNotActive);
        require!(bounty.depositor == ctx.accounts.depositor.key(), BountyError::UnauthorizedDepositor);

        let amount = bounty.amount;
        
        // Transfer SOL back from vault to depositor
        **vault.to_account_info().try_borrow_mut_lamports()? -= amount;
        **ctx.accounts.depositor.to_account_info().try_borrow_mut_lamports()? += amount;

        bounty.status = BountyStatus::Cancelled;
        bounty.updated_at = Clock::get()?.unix_timestamp;

        emit!(BountyCancelled {
            bounty: bounty.key(),
            depositor: ctx.accounts.depositor.key(),
            amount,
        });

        Ok(())
    }

    pub fn deposit_tip(
        ctx: Context<DepositTip>,
        amount: u64,
        recipient: Pubkey,
        message: String,
    ) -> Result<()> {
        require!(amount > 0, BountyError::InvalidAmount);

        let vault = &mut ctx.accounts.vault;
        let tip = &mut ctx.accounts.tip;

        // Transfer SOL from tipper to vault
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.tipper.key(),
            &vault.key(),
            amount,
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.tipper.to_account_info(),
                vault.to_account_info(),
            ],
        )?;

        tip.tipper = ctx.accounts.tipper.key();
        tip.recipient = recipient;
        tip.amount = amount;
        tip.message = message;
        tip.status = TipStatus::Pending;
        tip.created_at = Clock::get()?.unix_timestamp;

        emit!(TipDeposited {
            tip: tip.key(),
            tipper: tip.tipper,
            recipient: tip.recipient,
            amount: tip.amount,
            message: tip.message.clone(),
        });

        Ok(())
    }

    pub fn claim_tip(ctx: Context<ClaimTip>) -> Result<()> {
        let tip = &mut ctx.accounts.tip;
        let vault = &mut ctx.accounts.vault;
        
        require!(tip.status == TipStatus::Pending, BountyError::TipNotPending);
        require!(tip.recipient == ctx.accounts.recipient.key(), BountyError::UnauthorizedRecipient);

        let amount = tip.amount;
        
        // Transfer SOL from vault to recipient
        **vault.to_account_info().try_borrow_mut_lamports()? -= amount;
        **ctx.accounts.recipient.to_account_info().try_borrow_mut_lamports()? += amount;

        tip.status = TipStatus::Claimed;

        emit!(TipClaimed {
            tip: tip.key(),
            recipient: ctx.accounts.recipient.key(),
            amount,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeVault<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Vault::LEN,
        seeds = [b"vault"],
        bump
    )]
    pub vault: Account<'info, Vault>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(issue_id: String)]
pub struct DepositBounty<'info> {
    #[account(mut)]
    pub vault: Account<'info, Vault>,
    
    #[account(
        init,
        payer = depositor,
        space = 8 + Bounty::LEN,
        seeds = [b"bounty", issue_id.as_bytes()],
        bump
    )]
    pub bounty: Account<'info, Bounty>,
    
    #[account(mut)]
    pub depositor: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimBounty<'info> {
    #[account(mut)]
    pub bounty: Account<'info, Bounty>,
    
    pub depositor: Signer<'info>,
}

#[derive(Accounts)]
pub struct ApproveBounty<'info> {
    #[account(mut)]
    pub bounty: Account<'info, Bounty>,
    
    pub depositor: Signer<'info>,
}

#[derive(Accounts)]
pub struct WithdrawBounty<'info> {
    #[account(mut)]
    pub vault: Account<'info, Vault>,
    
    #[account(mut)]
    pub bounty: Account<'info, Bounty>,
    
    /// CHECK: This is the contributor who will receive the bounty
    #[account(mut)]
    pub contributor: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct CancelBounty<'info> {
    #[account(mut)]
    pub vault: Account<'info, Vault>,
    
    #[account(mut)]
    pub bounty: Account<'info, Bounty>,
    
    #[account(mut)]
    pub depositor: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(recipient: Pubkey)]
pub struct DepositTip<'info> {
    #[account(mut)]
    pub vault: Account<'info, Vault>,
    
    #[account(
        init,
        payer = tipper,
        space = 8 + Tip::LEN,
        seeds = [b"tip", tipper.key().as_ref(), recipient.as_ref()],
        bump
    )]
    pub tip: Account<'info, Tip>,
    
    #[account(mut)]
    pub tipper: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimTip<'info> {
    #[account(mut)]
    pub vault: Account<'info, Vault>,
    
    #[account(mut)]
    pub tip: Account<'info, Tip>,
    
    /// CHECK: This is the tip recipient
    #[account(mut)]
    pub recipient: AccountInfo<'info>,
}

#[account]
pub struct Vault {
    pub authority: Pubkey,
    pub total_deposited: u64,
    pub total_withdrawn: u64,
    pub bump: u8,
}

impl Vault {
    pub const LEN: usize = 32 + 8 + 8 + 1;
}

#[account]
pub struct Bounty {
    pub depositor: Pubkey,
    pub contributor: Option<Pubkey>,
    pub amount: u64,
    pub issue_id: String,
    pub issue_url: String,
    pub status: BountyStatus,
    pub created_at: i64,
    pub updated_at: i64,
}

impl Bounty {
    pub const LEN: usize = 32 + (1 + 32) + 8 + (4 + 100) + (4 + 200) + 1 + 8 + 8;
}

#[account]
pub struct Tip {
    pub tipper: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
    pub message: String,
    pub status: TipStatus,
    pub created_at: i64,
}

impl Tip {
    pub const LEN: usize = 32 + 32 + 8 + (4 + 200) + 1 + 8;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum BountyStatus {
    Active,
    Claimed,
    Approved,
    Completed,
    Cancelled,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum TipStatus {
    Pending,
    Claimed,
}

#[event]
pub struct BountyDeposited {
    pub bounty: Pubkey,
    pub depositor: Pubkey,
    pub amount: u64,
    pub issue_id: String,
    pub issue_url: String,
}

#[event]
pub struct BountyWithdrawn {
    pub bounty: Pubkey,
    pub contributor: Pubkey,
    pub amount: u64,
}

#[event]
pub struct BountyCancelled {
    pub bounty: Pubkey,
    pub depositor: Pubkey,
    pub amount: u64,
}

#[event]
pub struct TipDeposited {
    pub tip: Pubkey,
    pub tipper: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
    pub message: String,
}

#[event]
pub struct TipClaimed {
    pub tip: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
}

#[error_code]
pub enum BountyError {
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("Invalid issue ID")]
    InvalidIssueId,
    #[msg("Invalid issue URL")]
    InvalidIssueUrl,
    #[msg("Bounty is not active")]
    BountyNotActive,
    #[msg("Bounty is not claimed")]
    BountyNotClaimed,
    #[msg("Bounty is not approved")]
    BountyNotApproved,
    #[msg("Unauthorized depositor")]
    UnauthorizedDepositor,
    #[msg("Unauthorized contributor")]
    UnauthorizedContributor,
    #[msg("No contributor assigned")]
    NoContributor,
    #[msg("Tip is not pending")]
    TipNotPending,
    #[msg("Unauthorized recipient")]
    UnauthorizedRecipient,
}
