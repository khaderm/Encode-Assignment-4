import { ethers } from "ethers";
import dotenv from "dotenv";
import { Ballot__factory } from "../typechain-types";
import { Ballot } from "../typechain-types";
import { AlchemyProvider } from "@ethersproject/providers";

dotenv.config();

async function main() {
  //creates a new AlchemyProvider connected to network
  const provider = new AlchemyProvider("goerli", process.env.ALCHEMY_API_KEY);
  //saves the ballot contract address to a variable
  const ballotAddress = "0xB102D8052205c6ca49072033485228d8F4D4a07D";
  //Creates the ballotContract instance from the ballotAddress
  const ballotContract = new ethers.Contract(
    ballotAddress,
    Ballot__factory.abi,
    provider
  );

  const winnerProposal_ = await ballotContract.winningProposal();

  console.log(`The winner is ${winnerProposal_}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
