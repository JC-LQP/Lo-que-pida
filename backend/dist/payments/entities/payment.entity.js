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
exports.Payment = exports.PaymentStatus = exports.PaymentProvider = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const order_entity_1 = require("../../orders/entities/order.entity");
var PaymentProvider;
(function (PaymentProvider) {
    PaymentProvider["STRIPE"] = "stripe";
    PaymentProvider["KUSHKI"] = "kushki";
    PaymentProvider["LOCAL"] = "local";
})(PaymentProvider || (exports.PaymentProvider = PaymentProvider = {}));
(0, graphql_1.registerEnumType)(PaymentProvider, {
    name: 'PaymentProvider',
});
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["PAID"] = "paid";
    PaymentStatus["FAILED"] = "failed";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
(0, graphql_1.registerEnumType)(PaymentStatus, {
    name: 'PaymentStatus',
});
let Payment = class Payment {
    id;
    order;
    provider;
    status;
    transactionId;
    createdAt;
};
exports.Payment = Payment;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Payment.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => order_entity_1.Order),
    (0, typeorm_1.OneToOne)(() => order_entity_1.Order),
    (0, typeorm_1.JoinColumn)({ name: 'order_id' }),
    __metadata("design:type", order_entity_1.Order)
], Payment.prototype, "order", void 0);
__decorate([
    (0, graphql_1.Field)(() => PaymentProvider),
    (0, typeorm_1.Column)({ type: 'enum', enum: PaymentProvider }),
    __metadata("design:type", String)
], Payment.prototype, "provider", void 0);
__decorate([
    (0, graphql_1.Field)(() => PaymentStatus),
    (0, typeorm_1.Column)({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING }),
    __metadata("design:type", String)
], Payment.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ name: 'transaction_id', nullable: true }),
    __metadata("design:type", String)
], Payment.prototype, "transactionId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Payment.prototype, "createdAt", void 0);
exports.Payment = Payment = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)({ name: 'payments' })
], Payment);
//# sourceMappingURL=payment.entity.js.map