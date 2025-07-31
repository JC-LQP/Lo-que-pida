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
exports.SellersResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const sellers_service_1 = require("./sellers.service");
const seller_entity_1 = require("./entities/seller.entity");
const create_seller_input_1 = require("./dto/create-seller.input");
const update_seller_input_1 = require("./dto/update-seller.input");
let SellersResolver = class SellersResolver {
    sellersService;
    constructor(sellersService) {
        this.sellersService = sellersService;
    }
    createSeller(input) {
        return this.sellersService.create(input);
    }
    findAll() {
        return this.sellersService.findAll();
    }
    findOne(id) {
        return this.sellersService.findOne(id);
    }
    updateSeller(input) {
        return this.sellersService.update(input.id, input);
    }
    removeSeller(id) {
        return this.sellersService.remove(id);
    }
};
exports.SellersResolver = SellersResolver;
__decorate([
    (0, graphql_1.Mutation)(() => seller_entity_1.Seller),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_seller_input_1.CreateSellerInput]),
    __metadata("design:returntype", Promise)
], SellersResolver.prototype, "createSeller", null);
__decorate([
    (0, graphql_1.Query)(() => [seller_entity_1.Seller], { name: 'sellers' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SellersResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Query)(() => seller_entity_1.Seller, { name: 'seller' }),
    __param(0, (0, graphql_1.Args)('id', { type: () => String })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SellersResolver.prototype, "findOne", null);
__decorate([
    (0, graphql_1.Mutation)(() => seller_entity_1.Seller),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_seller_input_1.UpdateSellerInput]),
    __metadata("design:returntype", Promise)
], SellersResolver.prototype, "updateSeller", null);
__decorate([
    (0, graphql_1.Mutation)(() => seller_entity_1.Seller),
    __param(0, (0, graphql_1.Args)('id', { type: () => String })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SellersResolver.prototype, "removeSeller", null);
exports.SellersResolver = SellersResolver = __decorate([
    (0, graphql_1.Resolver)(() => seller_entity_1.Seller),
    __metadata("design:paramtypes", [sellers_service_1.SellersService])
], SellersResolver);
//# sourceMappingURL=sellers.resolver.js.map