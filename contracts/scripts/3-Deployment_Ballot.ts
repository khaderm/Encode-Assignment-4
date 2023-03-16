import { ethers } from "ethers";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

//Function to covert sting array to Bytes32
function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

async function main() {
  //Setup provider
  const provider = new ethers.providers.AlchemyProvider(
    "goerli",
    process.env.ALCHEMY_API_KEY
  );
  const privateKey = process.env.PRIVATE_KEY;

  if (!privateKey || privateKey.length <= 0) {
    throw new Error("PRIVATE_KEY environment variable is not defined");
  }

  //Setup wallet with privatekey
  const wallet = new ethers.Wallet(privateKey);
  const signer = wallet.connect(provider);
  //Parameters for contract deployment
  const tokenAddress = process.env.MY_TKN_ADDRESS; //MyToken Contract address
  const blockNumbers = process.env.BLOCK_TARGET; //Target block referring to minted tokens

  //Accept arguments as parameter for voting proposals with array starting at position 2
  const args = process.argv;
  const proposals = ["We should plant more trees"];
  //   const proposals = [
  //     "We need a new president",
  //     "Send me 100ETH",
  //     "Let us plant more trees this year",
  //     "DAO members are asking for free coffee",
  //     "Need funds to drop new NFT Project",
  //   ];
  if (proposals.length <= 0) {
    throw new Error("Missing args");
  }
  console.log({ proposals });
  console.log("Deploying Ballot contract");
  console.log("Proposals: ");
  proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });

  //Deploy tokenizedBallot.sol contract with three parameters (proposals, address of token contract and target block number of minted tokens)
  const tokenBallotContractFactory = new Ballot__factory(signer);
  const contract = await tokenBallotContractFactory.deploy(
    convertStringArrayToBytes32(proposals),
    tokenAddress,
    blockNumbers
  );
  const deployTxReceipt = await contract.deployTransaction.wait();
  console.log(
    `The ERC20Votes contract was deployed at the adddress ${contract.address} at the block number ${deployTxReceipt.blockNumber}.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
