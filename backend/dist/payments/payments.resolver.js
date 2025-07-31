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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const payments_service_1 = require("./payments.service");
const payment_entity_1 = require("./entities/payment.entity");
const create_payment_input_1 = require("./dto/create-payment.input");
let PaymentsResolver = class PaymentsResolver {
    paymentsService;
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    createPayment(createPaymentInput) {
        return this.paymentsService.create(createPaymentInput);
    }
};
exports.PaymentsResolver = PaymentsResolver;
__decorate([
    (0, graphql_1.Mutation)(() => payment_entity_1.Payment),
    __param(0, (0, graphql_1.Args)('createPaymentInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payment_input_1.CreatePaymentInput]),
    __metadata("design:returntype", Promise)
], PaymentsResolver.prototype, "createPayment", null);
exports.PaymentsResolver = PaymentsResolver = __decorate([
    (0, graphql_1.Resolver)(() => payment_entity_1.Payment),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsResolver);
//# sourceMappingURL=payments.resolver.js.map