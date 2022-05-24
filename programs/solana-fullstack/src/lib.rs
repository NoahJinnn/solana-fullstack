use anchor_lang::prelude::*;
use anchor_lang::solana_program::log::sol_log_compute_units;
use anchor_spl::token::{self, Token};
use std::mem::size_of;
declare_id!("9WinRJW2vb2zhnP6XuGcKy7U2A8rRJoyZQzRja2Ru3xU");
// Username length
const USER_NAME_LENGTH: usize = 100;
// User profile image url length
const USER_URL_LENGTH: usize = 255;
// Video and comment text length
const TEXT_LENGTH: usize = 1024;
const VIDEO_URL_LENGTH: usize = 255;
const NUMBER_OF_ALLOWED_LIKES_SPACE: usize = 5;
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
        profile_url: String,
    ) -> anchor_lang::Result<()> {
        if name.trim().is_empty() || profile_url.trim().is_empty() {
            return Err(error!(Errors::CannotCreateUser));
        }
        let user = &mut ctx.accounts.user;
        // Set authority
        user.user_wallet_address = ctx.accounts.authority.key();
        // Set text
        user.user_name = name;
        user.user_profile_image_url = profile_url;

        msg!("User Added!"); //logging
        sol_log_compute_units(); //Logs how many compute units are left, important for budget
        Ok(())
    }

    /// Create video
    /// @param text:        text of video
    /// @param creator_name: name of video creator
    /// @param creator_url:  url of video creator avatar
    pub fn create_video(
        ctx: Context<CreateVideo>,
        description: String,
        video_url: String,
        creator_name: String,
        creator_url: String,
    ) -> anchor_lang::Result<()> {
        msg!(&description); //logging

        if description.trim().is_empty() || video_url.trim().is_empty() {
            return Err(error!(Errors::CannotCreateVideo));
        }
        // Get video
        let video = &mut ctx.accounts.video;
        // Set authority
        video.authority = ctx.accounts.authority.key();
        // Set text
        video.description = description;
        video.video_url = video_url;

        // Set creator name
        video.creator_name = creator_name;
        // Set creator avatar url
        video.creator_url = creator_url;
        // Set comment count as 0
        video.comment_count = 0;

        // Set video time
        video.creator_time = ctx.accounts.clock.unix_timestamp;

        video.likes = 0;

        video.remove = 0;
        msg!("Video Added!"); //logging
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

#[derive(Accounts)]
pub struct CreateVideo<'info> {
    #[account(
        init,
        // Video account use string "video" and index of video as seeds
        seeds = [b"video".as_ref(), authority.key().as_ref()],
        bump,
        payer = authority,
        space = size_of::<VideoAccount>() + TEXT_LENGTH + USER_NAME_LENGTH + USER_URL_LENGTH+VIDEO_URL_LENGTH+8+32*NUMBER_OF_ALLOWED_LIKES_SPACE // 32 bits in a pubkey and we have 5
    )]
    pub video: Account<'info, VideoAccount>,
    
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
    pub user_profile_image_url: String,
}

#[account]
pub struct VideoAccount {
    pub authority: Pubkey,
    pub description: String,
    pub video_url: String,
    pub creator_name: String,
    pub creator_url: String,
    pub comment_count: u64,
    // Video index
    pub index: u64,
    // Video time
    pub creator_time: i64,
    // likes: vector of people who liked it,
    pub people_who_liked: Vec<Pubkey>,
    pub likes: u8,
    pub remove: i64,
}

#[error_code]
pub enum Errors {
    #[msg("User cannot be created, missing data")]
    CannotCreateUser,

    #[msg("Video cannot be created, missing data")]
    CannotCreateVideo,
}
