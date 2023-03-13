import { AppService } from './app.service';
import { RequestTokenDTO, DelegateDTO, VoteDTO, TransactionResponseDTO, ErrorMessageDTO } from './dtos';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getMyTokenContractAddress(): {
        result: string;
    };
    getTokenizedBallotContractAddress(): {
        result: string;
    };
    getTotalSupply(): Promise<number>;
    getAllowance(from: string, to: string): Promise<number>;
    getTransactionStatus(txnHash: string): Promise<string>;
    getTransactionReceipt(txnHash: string): Promise<string>;
    requestTokens(body: RequestTokenDTO): Promise<TransactionResponseDTO | ErrorMessageDTO>;
    delegate(body: DelegateDTO): Promise<TransactionResponseDTO | ErrorMessageDTO>;
    vote(body: VoteDTO): Promise<TransactionResponseDTO | ErrorMessageDTO>;
    getWinningProposal(): Promise<TransactionResponseDTO | ErrorMessageDTO>;
}
