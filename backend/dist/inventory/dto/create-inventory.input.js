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
exports.CreateInventoryInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
let CreateInventoryInput = class CreateInventoryInput {
    productId;
    categoryId;
    stock;
    reservedStock;
    soldStock;
};
exports.CreateInventoryInput = CreateInventoryInput;
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInventoryInput.prototype, "productId", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateInventoryInput.prototype, "categoryId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateInventoryInput.prototype, "stock", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { defaultValue: 0 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateInventoryInput.prototype, "reservedStock", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { defaultValue: 0 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateInventoryInput.prototype, "soldStock", void 0);
exports.CreateInventoryInput = CreateInventoryInput = __decorate([
    (0, graphql_1.InputType)()
], CreateInventoryInput);
//# sourceMappingURL=create-inventory.input.js.map