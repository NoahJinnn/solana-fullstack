Dev
=
`anchor init appname`

Setup solana network: `solana config set --url localhost`

Generate program id: `solana address -k target/deploy/appname-keypair.json`

Run Solana local validators: `solana-test-validator`

Build `idl.json` for client & `.so` for runtime: `anchor build`

Deploy program: `anchor deploy`

See logs: `solana logs`

Test
=
Run test: `anchor test`
