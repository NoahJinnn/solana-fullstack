import { clusterApiUrl, PublicKey } from "@solana/web3.js";

export const CLUSTER =
  process.env.REACT_APP_CLUSTER === "mainnet"
    ? "mainnet"
    : process.env.REACT_APP_CLUSTER === "testnet"
      ? "testnet"
      : process.env.REACT_APP_CLUSTER === "devnet"
        ? "devnet"
        : "localnet";

export const SOLANA_HOST = process.env.REACT_APP_SOLANA_API_URL
  ? process.env.REACT_APP_SOLANA_API_URL
  : CLUSTER === "mainnet"
    ? clusterApiUrl("mainnet-beta")
    : CLUSTER === "testnet"
      ? clusterApiUrl("testnet")
      : CLUSTER === "devnet"
        ? clusterApiUrl("devnet")
        : "http://localhost:8899";

export const TIKTOK_PROGRAM_ID = new PublicKey(
  CLUSTER === 'localnet' 
  ? '9WinRJW2vb2zhnP6XuGcKy7U2A8rRJoyZQzRja2Ru3xU' 
  : CLUSTER === 'testnet' 
  ? 'BShqBmAsHXUMnc79Z1EHtWywiic5S1FWH2Kd8i35wiwA'
  : CLUSTER === 'devnet'
        ? 'Az4edEtU6JtghfueC4hS7Fo5fG3evPY5VUt6YbNHmhaN'
  : ''
);
