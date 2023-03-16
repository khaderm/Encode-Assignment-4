import { ethers } from "ethers";
import { MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const provider = new ethers.providers.AlchemyProvider(
    "goerli",
    process.env.ALCHEMY_API_KEY
  );

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || privateKey.length <= 0)
    throw new Error("Missing environment: PRIVATE_KEY");

  const wallet = new ethers.Wallet(privateKey, provider);
  const signer = wallet.connect(provider);
  const balance = await signer.getBalance();
  console.log(
    `The account ${signer.address} has a balance of ${balance.toString()} Wei`
  );

  //Contract Address to be attached
  const address = process.env.MY_TKN_ADDRESS;
  const ballotContractFactory = new MyToken__factory(signer);
  console.log("Deploying ballot contract...");
  const ballotContract = ballotContractFactory.attach(address);

  // Replace the placeholder address with a real voter's address
  const voterAddress = process.env.USER_ADDRESS;
  // for ex: "0xE54ab2BB5f0AA8F619BE270e9Fe5c79A25eB619E"
  const MINT_AMOUNT = ethers.utils.parseEther("10.0");
  const mintTx = await ballotContract.mint(voterAddress, MINT_AMOUNT);
  const txReceipt = await mintTx.wait();
  console.log(
    `You have successfully minted ${mintTx.value} to address ${mintTx.to} at block number ${mintTx.blockNumber}.`
  );
  console.log(txReceipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
