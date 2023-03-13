import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { BigNumber } from 'ethers/lib/ethers';
//import * as dotenv from 'dotenv'
import dotenv from 'dotenv'
dotenv.config()


import * as myTokenJson from './assets/MyToken.json';
import * as tokenizedBallotJson from './assets/TokenizedBallot.json';
import { TransactionResponseDTO, ErrorMessageDTO } from './dtos';

const MY_TOKEN_CONTRACT_ADDRESS = '0x85397ac612F0761C17c2C7e1f7DFDaA7a876517B';
const TOKENIZED_BALLOT_CONTRACT_ADDRESS = '0x7D841FAF3c2bE1c80E9AF1753f2C25139dd56123';

@Injectable()
export class AppService {
  myTokenContract = null;
  tokenizedBallotContract = null;
  provider = null;
  signer = null;

  constructor() {
    this.provider = ethers.providers.getDefaultProvider('goerli', {
      alchemy: process.env.ALCHEMY_API_KEY
    });
    this.signer = new ethers.Wallet(process.env.METAMASK_WALLET_PRIVATE_KEY, this.provider);

    this.myTokenContract = new ethers.Contract(
      MY_TOKEN_CONTRACT_ADDRESS,
      myTokenJson.abi,
      this.provider
    );
    this.tokenizedBallotContract = new ethers.Contract(
      TOKENIZED_BALLOT_CONTRACT_ADDRESS,
      tokenizedBallotJson.abi,
      this.provider
    );
  }

  getMyTokenContractAddress(): string {
    return MY_TOKEN_CONTRACT_ADDRESS;
  }
  
  getTokenizedBallotContractAddress(): string {
    return TOKENIZED_BALLOT_CONTRACT_ADDRESS;
  }

  async getTotalSupply(): Promise<number> {
    const totalSupplyBN: BigNumber = await this.myTokenContract.totalSupply();
    const totalSupplyString = ethers.utils.formatEther(totalSupplyBN);
    const totalSupplyNumber = parseFloat(totalSupplyString);

    return totalSupplyNumber;
  }

  async getAllowance(from: string, to: string): Promise<number> {
    const allowanceBN: BigNumber = await this.myTokenContract.allowance(from, to);
    const allowanceString = ethers.utils.formatEther(allowanceBN);
    const allowanceNumber = parseFloat(allowanceString);

    return allowanceNumber;
  }

  async getTransactionStatus(txnHash: string): Promise<string> {
    const txnReceipt = await this.myTokenContract.provider.getTransaction(txnHash);
    return txnReceipt?.blockNumber ? 'Success' : 'Fail';
  }

  async getTransactionReceipt(txnHash: string): Promise<string> {
    const txnReceipt = await this.myTokenContract.provider.getTransaction(txnHash);
    return JSON.stringify(txnReceipt);
  }

  async requestTokens(address: string, amount: number): Promise<TransactionResponseDTO | ErrorMessageDTO> {
    let txnError = null;
    let mintTxnReceipt = null;

    const amountBN = ethers.utils.parseEther(String(amount));

    try {
      const mintTxn = await this.myTokenContract.connect(this.signer).mint(address, amountBN);
      mintTxnReceipt = await mintTxn.wait();
    } catch (error) { 
      txnError = error;
    }

    if (txnError) {
      return {
        message: `Error while minting tokens to ${address}`,
        detailedMessage: JSON.stringify(txnError)
      }
    }

    return {
      message: `Successfully minted ${amount} MTK to ${address}.`,
      transactionHash: mintTxnReceipt.transactionHash,
      etherscanLink: `https://goerli.etherscan.io/tx/${ mintTxnReceipt.transactionHash}`
    };
  }

  async delegate(delegateeAddress: string): Promise<TransactionResponseDTO | ErrorMessageDTO> {
    let txnError = null;
    let delegateTxnReceipt = null;

    try {
      const delegateTxn = await this.myTokenContract.connect(this.signer).delegate(delegateeAddress);
      delegateTxnReceipt = await delegateTxn.wait();
    } catch (error) {
      txnError = error;
    }

    if (txnError) {
      return {
        message: `Error delegating to ${delegateeAddress}`,
        detailedMessage: JSON.stringify(txnError)
      }
    }

    return {
      message: `Successfully delegated votes to account address ${delegateeAddress}.`,
      transactionHash: delegateTxnReceipt.transactionHash,
      etherscanLink: `https://goerli.etherscan.io/tx/${ delegateTxnReceipt.transactionHash}`
    }
  }

  async vote(proposalId: string, amount: number): Promise<TransactionResponseDTO | ErrorMessageDTO> {
    let txnError = null;
    let voteTxnReceipt = null;

    try {
      const voteTxn = await this.tokenizedBallotContract.connect(this.signer).vote(proposalId, amount);
      voteTxnReceipt = await voteTxn.wait();
    } catch (error) {
      txnError = error;
    }

    if (txnError) {
      console.log("🚀 ~ AppService ~ vote ~ txnError:", txnError)
      
      return {
        message: `Error voting for proposal Id: ${proposalId}`,
        detailedMessage: JSON.stringify(txnError)
      }
    }

    return {
      message: `Successfully voted for proposal with ID ${proposalId}.`,
      transactionHash: voteTxnReceipt.transactionHash,
      etherscanLink: `https://goerli.etherscan.io/tx/${ voteTxnReceipt.transactionHash}`
    }
  }

  async getWinningProposal(): Promise<TransactionResponseDTO | ErrorMessageDTO> {
    let txnError = null;
    let winningProposal = -1;
    let proposalName = '';
    let proposalVoteCount = 0;

    try {
      const winningProposalBN: BigNumber = await this.tokenizedBallotContract.connect(this.signer).winningProposal();
      const winningProposalStr = ethers.utils.formatEther(winningProposalBN);
      winningProposal = parseFloat(winningProposalStr);

      const proposals = await this.tokenizedBallotContract.connect(this.signer).proposals(winningProposalBN);
      const proposalNameBytes32 = proposals[0];
      proposalName = ethers.utils.parseBytes32String(proposalNameBytes32);
      
      const proposalVoteCountBN = proposals[1];
      const proposalVoteCountStr = ethers.utils.formatEther(proposalVoteCountBN);
      proposalVoteCount = parseFloat(proposalVoteCountStr);

    } catch (error) {
      txnError = error;
    }

    if (txnError) {
      return {
        message: `Error while getting winning proposal.`,
        detailedMessage: JSON.stringify(txnError)
      }
    }
    
    return {
      message: `Successfully voted for proposal with ID: ${winningProposal}. Proposal name: ${proposalName}. Proposal vote count: ${proposalVoteCount}.`,
      transactionHash: 'No hash. It was reading operation.',
      etherscanLink: `No etherscan link. It was reading operation.`
    }
  }
}
