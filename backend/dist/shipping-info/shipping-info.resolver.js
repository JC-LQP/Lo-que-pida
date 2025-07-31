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
exports.ShippingInfoResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const shipping_info_service_1 = require("./shipping-info.service");
const shipping_info_entity_1 = require("./entities/shipping-info.entity");
const create_shipping_info_input_1 = require("./dto/create-shipping-info.input");
const update_shipping_info_input_1 = require("./dto/update-shipping-info.input");
let ShippingInfoResolver = class ShippingInfoResolver {
    shippingInfoService;
    constructor(shippingInfoService) {
        this.shippingInfoService = shippingInfoService;
    }
    createShippingInfo(input) {
        return this.shippingInfoService.create(input);
    }
    findAll() {
        return this.shippingInfoService.findAll();
    }
    findOne(id) {
        return this.shippingInfoService.findOne(id);
    }
    updateShippingInfo(input) {
        return this.shippingInfoService.update(input.id, input);
    }
    removeShippingInfo(id) {
        return this.shippingInfoService.remove(id);
    }
};
exports.ShippingInfoResolver = ShippingInfoResolver;
__decorate([
    (0, graphql_1.Mutation)(() => shipping_info_entity_1.ShippingInfo),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_shipping_info_input_1.CreateShippingInfoInput]),
    __metadata("design:returntype", Promise)
], ShippingInfoResolver.prototype, "createShippingInfo", null);
__decorate([
    (0, graphql_1.Query)(() => [shipping_info_entity_1.ShippingInfo], { name: 'shippingInfos' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ShippingInfoResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Query)(() => shipping_info_entity_1.ShippingInfo, { name: 'shippingInfo' }),
    __param(0, (0, graphql_1.Args)('id', { type: () => String })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShippingInfoResolver.prototype, "findOne", null);
__decorate([
    (0, graphql_1.Mutation)(() => shipping_info_entity_1.ShippingInfo),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_shipping_info_input_1.UpdateShippingInfoInput]),
    __metadata("design:returntype", Promise)
], ShippingInfoResolver.prototype, "updateShippingInfo", null);
__decorate([
    (0, graphql_1.Mutation)(() => shipping_info_entity_1.ShippingInfo),
    __param(0, (0, graphql_1.Args)('id', { type: () => String })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShippingInfoResolver.prototype, "removeShippingInfo", null);
exports.ShippingInfoResolver = ShippingInfoResolver = __decorate([
    (0, graphql_1.Resolver)(() => shipping_info_entity_1.ShippingInfo),
    __metadata("design:paramtypes", [shipping_info_service_1.ShippingInfoService])
], ShippingInfoResolver);
//# sourceMappingURL=shipping-info.resolver.js.map