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
exports.AddressesResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const addresses_service_1 = require("./addresses.service");
const address_entity_1 = require("./entities/address.entity");
const create_address_input_1 = require("./dto/create-address.input");
const update_address_input_1 = require("./dto/update-address.input");
let AddressesResolver = class AddressesResolver {
    addressesService;
    constructor(addressesService) {
        this.addressesService = addressesService;
    }
    createAddress(input) {
        return this.addressesService.create(input);
    }
    findAll() {
        return this.addressesService.findAll();
    }
    findOne(id) {
        return this.addressesService.findOne(id);
    }
    updateAddress(input) {
        return this.addressesService.update(input.id, input);
    }
    removeAddress(id) {
        return this.addressesService.remove(id);
    }
};
exports.AddressesResolver = AddressesResolver;
__decorate([
    (0, graphql_1.Mutation)(() => address_entity_1.Address),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_address_input_1.CreateAddressInput]),
    __metadata("design:returntype", Promise)
], AddressesResolver.prototype, "createAddress", null);
__decorate([
    (0, graphql_1.Query)(() => [address_entity_1.Address], { name: 'addresses' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AddressesResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Query)(() => address_entity_1.Address, { name: 'address' }),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AddressesResolver.prototype, "findOne", null);
__decorate([
    (0, graphql_1.Mutation)(() => address_entity_1.Address),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_address_input_1.UpdateAddressInput]),
    __metadata("design:returntype", Promise)
], AddressesResolver.prototype, "updateAddress", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AddressesResolver.prototype, "removeAddress", null);
exports.AddressesResolver = AddressesResolver = __decorate([
    (0, graphql_1.Resolver)(() => address_entity_1.Address),
    __metadata("design:paramtypes", [addresses_service_1.AddressesService])
], AddressesResolver);
//# sourceMappingURL=addresses.resolver.js.map