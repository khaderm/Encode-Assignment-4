"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const ethers_1 = require("ethers");
const dotenv_1 = require("dotenv");
dotenv_1.default.config();
const myTokenJson = require("./assets/MyToken.json");
const tokenizedBallotJson = require("./assets/TokenizedBallot.json");
const MY_TOKEN_CONTRACT_ADDRESS = '0x9A750A01629649975DC1F4e608aB203016F55180';
const TOKENIZED_BALLOT_CONTRACT_ADDRESS = '0xD7B7419e9FaC3D687a206e0656Ec7938049aA9e2';
let AppService = class AppService {
    constructor() {
        this.myTokenContract = null;
        this.tokenizedBallotContract = null;
        this.provider = null;
        this.signer = null;
        this.provider = ethers_1.ethers.providers.getDefaultProvider('goerli', {
            alchemy: process.env.ALCHEMY_API_KEY
        });
        this.signer = new ethers_1.ethers.Wallet(process.env.METAMASK_WALLET_PRIVATE_KEY, this.provider);
        this.myTokenContract = new ethers_1.ethers.Contract(MY_TOKEN_CONTRACT_ADDRESS, myTokenJson.abi, this.provider);
        this.tokenizedBallotContract = new ethers_1.ethers.Contract(TOKENIZED_BALLOT_CONTRACT_ADDRESS, tokenizedBallotJson.abi, this.provider);
    }
    getMyTokenContractAddress() {
        return MY_TOKEN_CONTRACT_ADDRESS;
    }
    getTokenizedBallotContractAddress() {
        return TOKENIZED_BALLOT_CONTRACT_ADDRESS;
    }
    async getTotalSupply() {
        const totalSupplyBN = await this.myTokenContract.totalSupply();
        const totalSupplyString = ethers_1.ethers.utils.formatEther(totalSupplyBN);
        const totalSupplyNumber = parseFloat(totalSupplyString);
        return totalSupplyNumber;
    }
    async getAllowance(from, to) {
        const allowanceBN = await this.myTokenContract.allowance(from, to);
        const allowanceString = ethers_1.ethers.utils.formatEther(allowanceBN);
        const allowanceNumber = parseFloat(allowanceString);
        return allowanceNumber;
    }
    async getTransactionStatus(txnHash) {
        const txnReceipt = await this.myTokenContract.provider.getTransaction(txnHash);
        return (txnReceipt === null || txnReceipt === void 0 ? void 0 : txnReceipt.blockNumber) ? 'Success' : 'Fail';
    }
    async getTransactionReceipt(txnHash) {
        const txnReceipt = await this.myTokenContract.provider.getTransaction(txnHash);
        return JSON.stringify(txnReceipt);
    }
    async requestTokens(address, amount) {
        let txnError = null;
        let mintTxnReceipt = null;
        const amountBN = ethers_1.ethers.utils.parseEther(String(amount));
        try {
            const mintTxn = await this.myTokenContract.connect(this.signer).mint(address, amountBN);
            mintTxnReceipt = await mintTxn.wait();
        }
        catch (error) {
            txnError = error;
        }
        if (txnError) {
            return {
                message: `Error while minting tokens to ${address}`,
                detailedMessage: JSON.stringify(txnError)
            };
        }
        return {
            message: `Successfully minted ${amount} MTK to ${address}.`,
            transactionHash: mintTxnReceipt.transactionHash,
            etherscanLink: `https://goerli.etherscan.io/tx/${mintTxnReceipt.transactionHash}`
        };
    }
    async delegate(delegateeAddress) {
        let txnError = null;
        let delegateTxnReceipt = null;
        try {
            const delegateTxn = await this.myTokenContract.connect(this.signer).delegate(delegateeAddress);
            delegateTxnReceipt = await delegateTxn.wait();
        }
        catch (error) {
            txnError = error;
        }
        if (txnError) {
            return {
                message: `Error delegating to ${delegateeAddress}`,
                detailedMessage: JSON.stringify(txnError)
            };
        }
        return {
            message: `Successfully delegated votes to account address ${delegateeAddress}.`,
            transactionHash: delegateTxnReceipt.transactionHash,
            etherscanLink: `https://goerli.etherscan.io/tx/${delegateTxnReceipt.transactionHash}`
        };
    }
    async vote(proposalId, amount) {
        let txnError = null;
        let voteTxnReceipt = null;
        try {
            const voteTxn = await this.tokenizedBallotContract.connect(this.signer).vote(proposalId, amount);
            voteTxnReceipt = await voteTxn.wait();
        }
        catch (error) {
            txnError = error;
        }
        if (txnError) {
            console.log("🚀 ~ AppService ~ vote ~ txnError:", txnError);
            return {
                message: `Error voting for proposal Id: ${proposalId}`,
                detailedMessage: JSON.stringify(txnError)
            };
        }
        return {
            message: `Successfully voted for proposal with ID ${proposalId}.`,
            transactionHash: voteTxnReceipt.transactionHash,
            etherscanLink: `https://goerli.etherscan.io/tx/${voteTxnReceipt.transactionHash}`
        };
    }
    async getWinningProposal() {
        let txnError = null;
        let winningProposal = -1;
        let proposalName = '';
        let proposalVoteCount = 0;
        try {
            const winningProposalBN = await this.tokenizedBallotContract.connect(this.signer).winningProposal();
            const winningProposalStr = ethers_1.ethers.utils.formatEther(winningProposalBN);
            winningProposal = parseFloat(winningProposalStr);
            const proposals = await this.tokenizedBallotContract.connect(this.signer).proposals(winningProposalBN);
            const proposalNameBytes32 = proposals[0];
            proposalName = ethers_1.ethers.utils.parseBytes32String(proposalNameBytes32);
            const proposalVoteCountBN = proposals[1];
            const proposalVoteCountStr = ethers_1.ethers.utils.formatEther(proposalVoteCountBN);
            proposalVoteCount = parseFloat(proposalVoteCountStr);
        }
        catch (error) {
            txnError = error;
        }
        if (txnError) {
            return {
                message: `Error while getting winning proposal.`,
                detailedMessage: JSON.stringify(txnError)
            };
        }
        return {
            message: `Successfully voted for proposal with ID: ${winningProposal}. Proposal name: ${proposalName}. Proposal vote count: ${proposalVoteCount}.`,
            transactionHash: 'No hash. It was reading operation.',
            etherscanLink: `No etherscan link. It was reading operation.`
        };
    }
};
AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map