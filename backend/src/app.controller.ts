import { Controller, Body, Get, Post, Param, Query } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { AppService } from './app.service';
import {
  RequestTokensDTO,
  DelegateDTO,
  VoteDTO,
  TransactionResponseDTO,
  TransactionErrorDTO,
} from './dtos';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('token-address')
  getTokenAddress(): { result: string } {
    return { result: this.appService.getTokenAddress() };
  }
  @Get('ballot-contract')
  getBallotContract(): { result: string } {
    return { result: this.appService.getBallotAddress() };
  }

  @Get('total-supply')
  getTotalSupply(): Promise<number> {
    return this.appService.getTotalSupply();
  }

  @Get('allowance')
  getAllowance(
    @Query('from') from: string,
    @Query('to') to: string
  ): Promise<number> {
    return this.appService.getAllowance(from, to);
  }

  @Get('transaction-status/:txnHash')
  getTransactionStatus(@Param('txnHash') txnHash: string): Promise<string> {
    return this.appService.getTransactionStatus(txnHash);
  }

  @Get('transaction-receipt/:txnHash')
  getTransactionReceipt(@Param('txnHash') txnHash: string): Promise<string> {
    return this.appService.getTransactionReceipt(txnHash);
  }

  // Minting
  @ApiBody({
    description: 'Example payload (Address, amount)',
    type: RequestTokensDTO,
  })
  @Post('request-tokens')
  requestTokens(
    @Body() body: RequestTokensDTO
  ): Promise<TransactionResponseDTO | TransactionErrorDTO> {
    const { address, amount } = body;

    return this.appService.requestTokens(address, amount);
  }

  // Delegating
  @ApiBody({
    description: 'Example payload (Delegatee Address)',
    type: DelegateDTO,
  })
  @Post('delegate')
  delegate(
    @Body() body: DelegateDTO
  ): Promise<TransactionResponseDTO | TransactionErrorDTO> {
    const { delegatee } = body;
    return this.appService.delegate(delegatee);
  }

  // Voting
  @ApiBody({
    description: 'Example payload (ProposalId, Amount)',
    type: VoteDTO,
  })
  @Post('vote')
  vote(
    @Body() body: VoteDTO
  ): Promise<TransactionResponseDTO | TransactionErrorDTO> {
    const { proposalId, amount } = body;

    return this.appService.vote(proposalId, amount);
  }

  // Getting winning proposal
  @Get('winning-proposal')
  getWinningProposal(): Promise<TransactionResponseDTO | TransactionErrorDTO> {
    return this.appService.getWinningProposal();
  }
}
