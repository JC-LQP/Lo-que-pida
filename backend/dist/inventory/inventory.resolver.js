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
exports.InventoryResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const inventory_service_1 = require("./inventory.service");
const inventory_entity_1 = require("./entities/inventory.entity");
const create_inventory_input_1 = require("./dto/create-inventory.input");
const update_inventory_input_1 = require("./dto/update-inventory.input");
let InventoryResolver = class InventoryResolver {
    inventoryService;
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    createInventory(input) {
        return this.inventoryService.create(input);
    }
    findAllInventory() {
        return this.inventoryService.findAll();
    }
    findOneInventory(id) {
        return this.inventoryService.findOne(id);
    }
    updateInventory(id, input) {
        return this.inventoryService.update(id, input);
    }
    removeInventory(id) {
        return this.inventoryService.remove(id);
    }
};
exports.InventoryResolver = InventoryResolver;
__decorate([
    (0, graphql_1.Mutation)(() => inventory_entity_1.Inventory),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_inventory_input_1.CreateInventoryInput]),
    __metadata("design:returntype", Promise)
], InventoryResolver.prototype, "createInventory", null);
__decorate([
    (0, graphql_1.Query)(() => [inventory_entity_1.Inventory]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryResolver.prototype, "findAllInventory", null);
__decorate([
    (0, graphql_1.Query)(() => inventory_entity_1.Inventory),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryResolver.prototype, "findOneInventory", null);
__decorate([
    (0, graphql_1.Mutation)(() => inventory_entity_1.Inventory),
    __param(0, (0, graphql_1.Args)('id')),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_inventory_input_1.UpdateInventoryInput]),
    __metadata("design:returntype", Promise)
], InventoryResolver.prototype, "updateInventory", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryResolver.prototype, "removeInventory", null);
exports.InventoryResolver = InventoryResolver = __decorate([
    (0, graphql_1.Resolver)(() => inventory_entity_1.Inventory),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryResolver);
//# sourceMappingURL=inventory.resolver.js.map