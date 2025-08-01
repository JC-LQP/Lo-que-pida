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
exports.UpdateShippingInfoInput = void 0;
const create_shipping_info_input_1 = require("./create-shipping-info.input");
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
let UpdateShippingInfoInput = class UpdateShippingInfoInput extends (0, graphql_1.PartialType)(create_shipping_info_input_1.CreateShippingInfoInput) {
    id;
};
exports.UpdateShippingInfoInput = UpdateShippingInfoInput;
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateShippingInfoInput.prototype, "id", void 0);
exports.UpdateShippingInfoInput = UpdateShippingInfoInput = __decorate([
    (0, graphql_1.InputType)()
], UpdateShippingInfoInput);
//# sourceMappingURL=update-shipping-info.input.js.map