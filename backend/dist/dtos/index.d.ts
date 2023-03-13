export declare class ErrorMessageDTO {
    message: string;
    detailedMessage: string;
}
export declare class RequestTokenDTO {
    address: string;
    amount: number;
}
export declare class TransactionResponseDTO {
    message: string;
    transactionHash: string;
    etherscanLink: string;
}
export declare class DelegateDTO {
    delegatee: string;
}
export declare class VoteDTO {
    proposalId: string;
    amount: number;
}
