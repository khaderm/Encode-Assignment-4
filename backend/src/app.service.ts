import { Injectable } from '@nestjs/common';
import { BigNumber, ethers } from 'ethers';
import * as tokenJson from './assets/MyToken.json';
import * as ballotJson from './assets/TokenizedBallot.json';
import * as dotenv from 'dotenv';
dotenv.config();
import { TransactionErrorDTO, TransactionResponseDTO } from './dtos';

const API_KEY = process.env.ALCHEMY_API_KEY;
const NETWORK = process.env.NETWORK;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const TKN_CONTRACT = process.env.MY_TKN_ADDRESS;
const BALLOT_ADDRESS = process.env.BALLOT_ADDRESS;

@Injectable()
export class AppService {
  provider: ethers.providers.BaseProvider;
  tokenContract: ethers.Contract;
  ballotContract: ethers.Contract;
  network: string;
  contractAddress: string;
  ballotAddress: string;
  Votes: Array<any>;
  signer: ethers.Wallet;

  constructor() {
    if (TKN_CONTRACT && PRIVATE_KEY && API_KEY && NETWORK && BALLOT_ADDRESS) {
      this.contractAddress = TKN_CONTRACT;
      this.ballotAddress = BALLOT_ADDRESS;
      this.provider = ethers.providers.getDefaultProvider(NETWORK, {
        alchemy: API_KEY,
      });
      this.tokenContract = new ethers.Contract(
        this.contractAddress,
        tokenJson.abi,
        this.provider
      );
      this.ballotContract = new ethers.Contract(
        this.ballotAddress,
        ballotJson.abi,
        this.provider
      );
      this.signer = new ethers.Wallet(PRIVATE_KEY, this.provider);
    }
  }
  counter = 0;
  getHello(): string {
    return 'Hello World!' + this.counter++;
  }

  getTokenAddress(): string {
    return this.contractAddress;
  }
  getBallotAddress(): string {
    return this.ballotAddress;
  }

  async getTotalSupply(): Promise<number> {
    const totalSupplyBN: BigNumber = await this.tokenContract.totalSupply();
    const totalSupplyString = ethers.utils.formatEther(totalSupplyBN);
    const totalSupplyNumber = parseFloat(totalSupplyString);

    return totalSupplyNumber;
  }

  async getAllowance(from: string, to: string): Promise<number> {
    const allowanceBN: BigNumber = await this.tokenContract.allowance(from, to);
    const allowanceString = ethers.utils.formatEther(allowanceBN);
    const allowanceNumber = parseFloat(allowanceString);

    return allowanceNumber;
  }

  async getTransactionStatus(txnHash: string): Promise<string> {
    const txnReceipt = await this.tokenContract.provider.getTransaction(
      txnHash
    );
    return txnReceipt?.blockNumber ? 'Success' : 'Fail';
  }

  async getTransactionReceipt(txnHash: string): Promise<string> {
    const txnReceipt = await this.tokenContract.provider.getTransaction(
      txnHash
    );
    return JSON.stringify(txnReceipt);
  }

  async requestTokens(
    address: string,
    amount: number
  ): Promise<TransactionResponseDTO | TransactionErrorDTO> {
    let txnError = null;
    let mintTxnReceipt = null;

    const amountBN = ethers.utils.parseEther(String(amount));

    try {
      const mintTxn = await this.tokenContract
        .connect(this.signer)
        .mint(address, amountBN);
      mintTxnReceipt = await mintTxn.wait();
    } catch (error) {
      txnError = error;
    }

    if (txnError) {
      return {
        message: `Error while minting tokens to ${address}`,
        details: JSON.stringify(txnError),
      };
    }

    return {
      message: `Successfully minted ${amount} MTK to ${address}.`,
      transactionHash: mintTxnReceipt.transactionHash,
      etherscan: `https://goerli.etherscan.io/tx/${mintTxnReceipt.transactionHash}`,
    };
  }

  async delegate(
    delegateeAddress: string
  ): Promise<TransactionResponseDTO | TransactionErrorDTO> {
    let txnError = null;
    let delegateTxnReceipt = null;

    try {
      const delegateTxn = await this.tokenContract
        .connect(this.signer)
        .delegate(delegateeAddress);
      delegateTxnReceipt = await delegateTxn.wait();
    } catch (error) {
      txnError = error;
    }

    if (txnError) {
      return {
        message: `Error delegating to ${delegateeAddress}`,
        details: JSON.stringify(txnError),
      };
    }

    return {
      message: `Successfully delegated votes to account address ${delegateeAddress}.`,
      transactionHash: delegateTxnReceipt.transactionHash,
      etherscan: `https://goerli.etherscan.io/tx/${delegateTxnReceipt.transactionHash}`,
    };
  }

  async vote(
    proposalId: string,
    amount: number
  ): Promise<TransactionResponseDTO | TransactionErrorDTO> {
    let txnError = null;
    let voteTxnReceipt = null;

    try {
      const voteTxn = await this.ballotContract
        .connect(this.signer)
        .vote(proposalId, amount);
      voteTxnReceipt = await voteTxn.wait();
    } catch (error) {
      txnError = error;
    }

    if (txnError) {
      console.log('🚀 ~ AppService ~ vote ~ txnError:', txnError);

      return {
        message: `Error voting for proposal Id: ${proposalId}`,
        details: JSON.stringify(txnError),
      };
    }

    return {
      message: `Successfully voted for proposal with ID ${proposalId}.`,
      transactionHash: voteTxnReceipt.transactionHash,
      etherscan: `https://goerli.etherscan.io/tx/${voteTxnReceipt.transactionHash}`,
    };
  }

  async getWinningProposal(): Promise<
    TransactionResponseDTO | TransactionErrorDTO
  > {
    let txnError = null;
    let winningProposal = -1;
    let proposalName = '';
    let proposalVoteCount = 0;

    try {
      const winningProposalBN: BigNumber = await this.ballotContract
        .connect(this.signer)
        .winningProposal();
      const winningProposalStr = ethers.utils.formatEther(winningProposalBN);
      winningProposal = parseFloat(winningProposalStr);

      const proposals = await this.ballotContract
        .connect(this.signer)
        .proposals(winningProposalBN);
      const proposalNameBytes32 = proposals[0];
      proposalName = ethers.utils.parseBytes32String(proposalNameBytes32);

      const proposalVoteCountBN = proposals[1];
      const proposalVoteCountStr =
        ethers.utils.formatEther(proposalVoteCountBN);
      proposalVoteCount = parseFloat(proposalVoteCountStr);
    } catch (error) {
      txnError = error;
    }

    if (txnError) {
      return {
        message: `Error while getting winning proposal.`,
        details: JSON.stringify(txnError),
      };
    }

    return {
      message: `Successfully voted for proposal with ID: ${winningProposal}. Proposal name: ${proposalName}. Proposal vote count: ${proposalVoteCount}.`,
      transactionHash: 'No hash. It was reading operation.',
      etherscan: `No etherscan link. It was reading operation.`,
    };
  }
}
