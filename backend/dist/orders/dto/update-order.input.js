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
exports.UpdateOrderInput = void 0;
const create_order_input_1 = require("./create-order.input");
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
let UpdateOrderInput = class UpdateOrderInput extends (0, graphql_1.PartialType)(create_order_input_1.CreateOrderInput) {
    id;
};
exports.UpdateOrderInput = UpdateOrderInput;
__decorate([
    (0, graphql_1.Field)(() => String),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateOrderInput.prototype, "id", void 0);
exports.UpdateOrderInput = UpdateOrderInput = __decorate([
    (0, graphql_1.InputType)()
], UpdateOrderInput);
//# sourceMappingURL=update-order.input.js.map