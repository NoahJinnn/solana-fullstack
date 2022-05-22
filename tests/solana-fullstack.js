const assert = require("assert");
const anchor = require("@project-serum/anchor");
const { SystemProgram } = anchor.web3;

describe("solana-fullstack", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.SolanaFullstack;
  const baseAccount = anchor.web3.Keypair.generate();

  it("It initializes the account", async () => {
    await program.rpc.initialize("Hello World", {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    });

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('Data: ', account.data);
    assert.ok(account.data === "Hello World");
  });

  it("Updates a previously created account", async () => {
    await program.rpc.update("Some new data", {
      accounts: {
        baseAccount: baseAccount.publicKey,
      },
    });

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('Updated data: ', account.data)
    assert.ok(account.data === "Some new data");
    console.log('all account data:', account)
    console.log('All data: ', account.dataList);
    assert.ok(account.dataList.length === 2);
  });
});
