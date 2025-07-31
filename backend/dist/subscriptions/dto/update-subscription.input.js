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
exports.UpdateSubscriptionInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
const create_subscription_input_1 = require("./create-subscription.input");
const subscription_entity_1 = require("../entities/subscription.entity");
let UpdateSubscriptionInput = class UpdateSubscriptionInput extends (0, graphql_1.PartialType)(create_subscription_input_1.CreateSubscriptionInput) {
    id;
    plan;
    billingCycle;
    status;
    startDate;
    endDate;
};
exports.UpdateSubscriptionInput = UpdateSubscriptionInput;
__decorate([
    (0, graphql_1.Field)(() => String),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateSubscriptionInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => subscription_entity_1.SubscriptionPlan, { nullable: true }),
    (0, class_validator_1.IsEnum)(subscription_entity_1.SubscriptionPlan),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSubscriptionInput.prototype, "plan", void 0);
__decorate([
    (0, graphql_1.Field)(() => subscription_entity_1.BillingCycle, { nullable: true }),
    (0, class_validator_1.IsEnum)(subscription_entity_1.BillingCycle),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSubscriptionInput.prototype, "billingCycle", void 0);
__decorate([
    (0, graphql_1.Field)(() => subscription_entity_1.PaidStatus, { nullable: true }),
    (0, class_validator_1.IsEnum)(subscription_entity_1.PaidStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSubscriptionInput.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateSubscriptionInput.prototype, "startDate", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateSubscriptionInput.prototype, "endDate", void 0);
exports.UpdateSubscriptionInput = UpdateSubscriptionInput = __decorate([
    (0, graphql_1.InputType)()
], UpdateSubscriptionInput);
//# sourceMappingURL=update-subscription.input.js.map