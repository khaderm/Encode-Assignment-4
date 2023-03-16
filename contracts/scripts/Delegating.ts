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

  //Contract Address to be attached
  const address = "0x2C568938035C3964Ef198F5D113885feB767C73F";
  const ballotContractFactory = new MyToken__factory(signer);
  const ballotContract = ballotContractFactory.attach(address);

  // Replace the placeholder address with a real voter's address
  const delegateeAddress = "0xFE948CB2122FDD87bAf43dCe8aFa254B1242c199";
  const mintTx = (await ballotContract.delegate(delegateeAddress)).wait();
  console.log(
    `Address ${signer.address} delegated votership to address ${delegateeAddress}.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
