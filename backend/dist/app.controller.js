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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_service_1 = require("./app.service");
const dtos_1 = require("./dtos");
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getMyTokenContractAddress() {
        return { result: this.appService.getMyTokenContractAddress() };
    }
    getTokenizedBallotContractAddress() {
        return { result: this.appService.getTokenizedBallotContractAddress() };
    }
    getTotalSupply() {
        return this.appService.getTotalSupply();
    }
    getAllowance(from, to) {
        return this.appService.getAllowance(from, to);
    }
    getTransactionStatus(txnHash) {
        return this.appService.getTransactionStatus(txnHash);
    }
    getTransactionReceipt(txnHash) {
        return this.appService.getTransactionReceipt(txnHash);
    }
    requestTokens(body) {
        const { address, amount } = body;
        return this.appService.requestTokens(address, amount);
    }
    delegate(body) {
        const { delegatee } = body;
        return this.appService.delegate(delegatee);
    }
    vote(body) {
        const { proposalId, amount } = body;
        return this.appService.vote(proposalId, amount);
    }
    getWinningProposal() {
        return this.appService.getWinningProposal();
    }
};
__decorate([
    (0, common_1.Get)('/my-token-contract-address'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AppController.prototype, "getMyTokenContractAddress", null);
__decorate([
    (0, common_1.Get)('/tokenized-ballot-contract-address'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AppController.prototype, "getTokenizedBallotContractAddress", null);
__decorate([
    (0, common_1.Get)('total-supply'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_a = typeof Promise !== "undefined" && Promise) === "function" ? _a : Object)
], AppController.prototype, "getTotalSupply", null);
__decorate([
    (0, common_1.Get)('allowance'),
    __param(0, (0, common_1.Query)('from')),
    __param(1, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
], AppController.prototype, "getAllowance", null);
__decorate([
    (0, common_1.Get)('transaction-status/:txnHash'),
    __param(0, (0, common_1.Param)('txnHash')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], AppController.prototype, "getTransactionStatus", null);
__decorate([
    (0, common_1.Get)('transaction-receipt/:txnHash'),
    __param(0, (0, common_1.Param)('txnHash')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], AppController.prototype, "getTransactionReceipt", null);
__decorate([
    (0, swagger_1.ApiBody)({ description: 'Example payload (Address, amount)', type: dtos_1.RequestTokenDTO }),
    (0, common_1.Post)('request-tokens'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.RequestTokenDTO]),
    __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], AppController.prototype, "requestTokens", null);
__decorate([
    (0, swagger_1.ApiBody)({ description: 'Example payload (Delegatee Address)', type: dtos_1.DelegateDTO }),
    (0, common_1.Post)('delegate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.DelegateDTO]),
    __metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], AppController.prototype, "delegate", null);
__decorate([
    (0, swagger_1.ApiBody)({ description: 'Example payload (ProposalId, Amount)', type: dtos_1.VoteDTO }),
    (0, common_1.Post)('vote'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.VoteDTO]),
    __metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], AppController.prototype, "vote", null);
__decorate([
    (0, common_1.Get)('winning-proposal'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], AppController.prototype, "getWinningProposal", null);
AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map