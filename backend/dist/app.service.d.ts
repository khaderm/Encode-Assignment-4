import { TransactionResponseDTO, ErrorMessageDTO } from './dtos';
export declare class AppService {
    myTokenContract: any;
    tokenizedBallotContract: any;
    provider: any;
    signer: any;
    constructor();
    getMyTokenContractAddress(): string;
    getTokenizedBallotContractAddress(): string;
    getTotalSupply(): Promise<number>;
    getAllowance(from: string, to: string): Promise<number>;
    getTransactionStatus(txnHash: string): Promise<string>;
    getTransactionReceipt(txnHash: string): Promise<string>;
    requestTokens(address: string, amount: number): Promise<TransactionResponseDTO | ErrorMessageDTO>;
    delegate(delegateeAddress: string): Promise<TransactionResponseDTO | ErrorMessageDTO>;
    vote(proposalId: string, amount: number): Promise<TransactionResponseDTO | ErrorMessageDTO>;
    getWinningProposal(): Promise<TransactionResponseDTO | ErrorMessageDTO>;
}
