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
exports.Subscription = exports.PaidStatus = exports.BillingCycle = exports.SubscriptionPlan = void 0;
const typeorm_1 = require("typeorm");
const seller_entity_1 = require("../../sellers/entities/seller.entity");
const graphql_1 = require("@nestjs/graphql");
var SubscriptionPlan;
(function (SubscriptionPlan) {
    SubscriptionPlan["BASIC"] = "basic";
    SubscriptionPlan["PREMIUM"] = "premium";
    SubscriptionPlan["ENTERPRISE"] = "enterprise";
})(SubscriptionPlan || (exports.SubscriptionPlan = SubscriptionPlan = {}));
(0, graphql_1.registerEnumType)(SubscriptionPlan, {
    name: 'SubscriptionPlan',
});
var BillingCycle;
(function (BillingCycle) {
    BillingCycle["MONTHLY"] = "monthly";
    BillingCycle["YEARLY"] = "yearly";
})(BillingCycle || (exports.BillingCycle = BillingCycle = {}));
(0, graphql_1.registerEnumType)(BillingCycle, {
    name: 'BillingCycle',
});
var PaidStatus;
(function (PaidStatus) {
    PaidStatus["PAID"] = "paid";
    PaidStatus["UNPAID"] = "unpaid";
})(PaidStatus || (exports.PaidStatus = PaidStatus = {}));
(0, graphql_1.registerEnumType)(PaidStatus, {
    name: 'PaidStatus',
});
let Subscription = class Subscription {
    id;
    seller;
    plan;
    billingCycle;
    status;
    startDate;
    endDate;
    createdAt;
};
exports.Subscription = Subscription;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Subscription.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => seller_entity_1.Seller),
    (0, typeorm_1.ManyToOne)(() => seller_entity_1.Seller, (seller) => seller.subscription, { onDelete: 'CASCADE' }),
    __metadata("design:type", seller_entity_1.Seller)
], Subscription.prototype, "seller", void 0);
__decorate([
    (0, graphql_1.Field)(() => SubscriptionPlan),
    (0, typeorm_1.Column)({ type: 'enum', enum: SubscriptionPlan }),
    __metadata("design:type", String)
], Subscription.prototype, "plan", void 0);
__decorate([
    (0, graphql_1.Field)(() => BillingCycle),
    (0, typeorm_1.Column)({ type: 'enum', enum: BillingCycle }),
    __metadata("design:type", String)
], Subscription.prototype, "billingCycle", void 0);
__decorate([
    (0, graphql_1.Field)(() => PaidStatus),
    (0, typeorm_1.Column)({ type: 'enum', enum: PaidStatus, default: PaidStatus.UNPAID }),
    __metadata("design:type", String)
], Subscription.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: 'start_date', type: 'timestamp' }),
    __metadata("design:type", Date)
], Subscription.prototype, "startDate", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: 'end_date', type: 'timestamp' }),
    __metadata("design:type", Date)
], Subscription.prototype, "endDate", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Subscription.prototype, "createdAt", void 0);
exports.Subscription = Subscription = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)({ name: 'subscriptions' })
], Subscription);
//# sourceMappingURL=subscription.entity.js.map