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
exports.CreatePaymentInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const payment_entity_1 = require("../entities/payment.entity");
(0, graphql_1.registerEnumType)(payment_entity_1.PaymentProvider, { name: 'PaymentProvider' });
let CreatePaymentInput = class CreatePaymentInput {
    orderId;
    provider;
    transactionId;
};
exports.CreatePaymentInput = CreatePaymentInput;
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], CreatePaymentInput.prototype, "orderId", void 0);
__decorate([
    (0, graphql_1.Field)(() => payment_entity_1.PaymentProvider),
    __metadata("design:type", String)
], CreatePaymentInput.prototype, "provider", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], CreatePaymentInput.prototype, "transactionId", void 0);
exports.CreatePaymentInput = CreatePaymentInput = __decorate([
    (0, graphql_1.InputType)()
], CreatePaymentInput);
//# sourceMappingURL=create-payment.input.js.map