import React from "react";
import { useMemo, useEffect } from "react";
import {
  useWallet,
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import idl from "../idl.json";
import { AnchorProvider, Program, web3 } from "@project-serum/anchor";

const { SystemProgram, Keypair } = web3;
const baseAccount = Keypair.generate();
const opts = {
  preflightCommitment: "processed",
};
const programID = new PublicKey("9WinRJW2vb2zhnP6XuGcKy7U2A8rRJoyZQzRja2Ru3xU");

export default function ContextProvider({ children }) {
  const wallet = useWallet();
  // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], [network]);

  async function getProvider() {
    /* create the provider and return it to the caller */
    /* network set to local network for now */
    const connection = new Connection("http://127.0.0.1:8899", opts.preflightCommitment);
    const provider = new AnchorProvider(connection, wallet, opts.preflightCommitment);
    return provider;
  }

  async function initialize() {
    const provider = await getProvider();
    console.log(provider)
    /* create the program interface combining the idl, program ID, and provider */
    const program = new Program(idl, programID, provider);
    try {
      /* interact with the program via rpc */
      await program.rpc.initialize("Hello World", {
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount],
      });

      const account = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      );
      console.log("account: ", account);
      //   setValue(account.data.toString());
      //   setDataList(account.dataList);
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }

  useEffect(() => {
    initialize();
    console.log("initializing");
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletMultiButton />
          <WalletDisconnectButton />
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
