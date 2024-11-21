import { viem } from "hardhat";
import { sepolia } from "viem/chains";
import { bootstrap } from "@scripts/utils";
import { formatEther } from "@node_modules/viem";

const CONTRACT_NAME = "CallOracle";
const MSG_PREFIX = `scripts -> ${CONTRACT_NAME} -> Deploy`;
const TELLOR_ORACLE_ADDRESS = "0xB19584Be015c04cf6CFBF6370Fe94a58b7A38830";

async function main() {
  const { publicClient, walletClient } = await bootstrap(MSG_PREFIX, sepolia);

  // console.log(`scripts -> ${CONTRACT_NAME} -> Deploy -> deploying contract`);
  const tokenContract = await viem.deployContract(CONTRACT_NAME, [TELLOR_ORACLE_ADDRESS], {
    client: {
      public: publicClient,
      wallet: walletClient
    }
  });
  console.log(`${MSG_PREFIX} -> contract deployed to`, tokenContract.address);

  const btcSpotPrice = await tokenContract.read.getBtcSpotPrice([BigInt(180 * 24 * 60 * 60)]);
  console.log(`${MSG_PREFIX} -> last btcSpotPrice for ${sepolia.name}`, formatEther(btcSpotPrice), "USD");
}

main().catch((error) => {
  console.log("\n\nError details:");
  console.error(error);
  process.exitCode = 1;
});
