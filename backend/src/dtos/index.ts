export class RequestTokensDTO {
  address: string;
  amount: number;
}

export class TransactionResponseDTO {
  message: string;
  transactionHash: string;
  etherscan: string;
}

export class TransactionErrorDTO {
  message: string;
  details: any;
}

export class VotingPowerDTO {
  address: string;
}

export class DelegateDTO {
  delegatee: string;
}

export class VoteDTO {
  proposalId: string;
  amount: number;
}
