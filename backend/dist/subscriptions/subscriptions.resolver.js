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
exports.SubscriptionsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const subscriptions_service_1 = require("./subscriptions.service");
const subscription_entity_1 = require("./entities/subscription.entity");
const create_subscription_input_1 = require("./dto/create-subscription.input");
const update_subscription_input_1 = require("./dto/update-subscription.input");
let SubscriptionsResolver = class SubscriptionsResolver {
    subscriptionsService;
    constructor(subscriptionsService) {
        this.subscriptionsService = subscriptionsService;
    }
    createSubscription(input) {
        return this.subscriptionsService.create(input);
    }
    subscriptions() {
        return this.subscriptionsService.findAll();
    }
    subscription(id) {
        return this.subscriptionsService.findOne(id);
    }
    updateSubscription(input) {
        return this.subscriptionsService.update(input);
    }
    removeSubscription(id) {
        return this.subscriptionsService.remove(id);
    }
};
exports.SubscriptionsResolver = SubscriptionsResolver;
__decorate([
    (0, graphql_1.Mutation)(() => subscription_entity_1.Subscription),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_subscription_input_1.CreateSubscriptionInput]),
    __metadata("design:returntype", Promise)
], SubscriptionsResolver.prototype, "createSubscription", null);
__decorate([
    (0, graphql_1.Query)(() => [subscription_entity_1.Subscription]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubscriptionsResolver.prototype, "subscriptions", null);
__decorate([
    (0, graphql_1.Query)(() => subscription_entity_1.Subscription),
    __param(0, (0, graphql_1.Args)('id', { type: () => String })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionsResolver.prototype, "subscription", null);
__decorate([
    (0, graphql_1.Mutation)(() => subscription_entity_1.Subscription),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_subscription_input_1.UpdateSubscriptionInput]),
    __metadata("design:returntype", Promise)
], SubscriptionsResolver.prototype, "updateSubscription", null);
__decorate([
    (0, graphql_1.Mutation)(() => subscription_entity_1.Subscription),
    __param(0, (0, graphql_1.Args)('id', { type: () => String })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionsResolver.prototype, "removeSubscription", null);
exports.SubscriptionsResolver = SubscriptionsResolver = __decorate([
    (0, graphql_1.Resolver)(() => subscription_entity_1.Subscription),
    __metadata("design:paramtypes", [subscriptions_service_1.SubscriptionsService])
], SubscriptionsResolver);
//# sourceMappingURL=subscriptions.resolver.js.map