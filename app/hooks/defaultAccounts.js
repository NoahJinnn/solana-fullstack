import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
const anchor = require('@project-serum/anchor')

export default {
    tokenProgram: TOKEN_PROGRAM_ID,
    clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
    systemProgram: anchor.web3.SystemProgram.programId,
  }