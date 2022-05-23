use anchor_lang::prelude::*;
use std::mem::size_of;
use anchor_lang::solana_program::log::{
    sol_log_compute_units
};
use anchor_spl::token::{self, Token};
declare_id!("9WinRJW2vb2zhnP6XuGcKy7U2A8rRJoyZQzRja2Ru3xU");
// Username length
const USER_NAME_LENGTH: usize = 100;
// User profile image url length
const USER_URL_LENGTH: usize = 255;
#[program]
pub mod solana_fullstack {
    use anchor_lang::solana_program::entrypoint::ProgramResult;

    use super::*;
    /// Create user
    /// @param name:        user name
    /// @param profile_url: user profile url
    pub fn create_user(
        ctx: Context<CreateUser>,
        name: String,
        profile_url: String
    ) -> ProgramResult {

    //    if name.trim().is_empty() || profile_url.trim().is_empty() {
    //        return Err(Errors::CannotCreateUser.into());
    //    }
        let user = &mut ctx.accounts.user;
        // Set authority
        user.user_wallet_address = ctx.accounts.authority.key();
        // Set text
        user.user_name = name;
        user.user_profile_image_url = profile_url;

        msg!("User Added!");  //logging
        sol_log_compute_units(); //Logs how many compute units are left, important for budget
        Ok(())
    }
}   

#[derive(Accounts)]
pub struct CreateUser<'info> {
    // Authenticate user account
    #[account(
        init,
        // User account use string "user" and index of user as seeds
        seeds = [b"user".as_ref(), authority.key().as_ref()],
        bump,
        payer = authority,
        space = size_of::<UserAccount>() + USER_NAME_LENGTH + USER_URL_LENGTH + 8
    )]
    pub user: Account<'info, UserAccount>,

    // Authority (this is signer who paid transaction fee)
    #[account(mut)]
    pub authority: Signer<'info>,

    /// System program
    /// CHECK: Simple test account
    pub system_program: UncheckedAccount<'info>,

    // Token program
    #[account(constraint = token_program.key == &token::ID)]
    pub token_program: Program<'info, Token>,

    // Clock to save time
    pub clock: Sysvar<'info, Clock>,
}

#[account]
pub struct UserAccount {
    pub user_name: String,
    pub user_wallet_address: Pubkey,
    pub user_profile_image_url: String
}
