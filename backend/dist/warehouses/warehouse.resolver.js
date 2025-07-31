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
exports.WarehouseResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const warehouse_service_1 = require("./warehouse.service");
const warehouse_entity_1 = require("./entities/warehouse.entity");
const create_warehouse_input_1 = require("./dto/create-warehouse.input");
const update_warehouse_input_1 = require("./dto/update-warehouse.input");
let WarehouseResolver = class WarehouseResolver {
    warehouseService;
    constructor(warehouseService) {
        this.warehouseService = warehouseService;
    }
    createWarehouse(input) {
        return this.warehouseService.create(input);
    }
    findAll() {
        return this.warehouseService.findAll();
    }
    findOne(id) {
        return this.warehouseService.findOne(id);
    }
    updateWarehouse(input) {
        return this.warehouseService.update(input.id, input);
    }
    removeWarehouse(id) {
        return this.warehouseService.remove(id);
    }
};
exports.WarehouseResolver = WarehouseResolver;
__decorate([
    (0, graphql_1.Mutation)(() => warehouse_entity_1.Warehouse),
    __param(0, (0, graphql_1.Args)('createWarehouseInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_warehouse_input_1.CreateWarehouseInput]),
    __metadata("design:returntype", void 0)
], WarehouseResolver.prototype, "createWarehouse", null);
__decorate([
    (0, graphql_1.Query)(() => [warehouse_entity_1.Warehouse], { name: 'warehouses' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WarehouseResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Query)(() => warehouse_entity_1.Warehouse, { name: 'warehouse' }),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WarehouseResolver.prototype, "findOne", null);
__decorate([
    (0, graphql_1.Mutation)(() => warehouse_entity_1.Warehouse),
    __param(0, (0, graphql_1.Args)('updateWarehouseInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_warehouse_input_1.UpdateWarehouseInput]),
    __metadata("design:returntype", void 0)
], WarehouseResolver.prototype, "updateWarehouse", null);
__decorate([
    (0, graphql_1.Mutation)(() => warehouse_entity_1.Warehouse),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WarehouseResolver.prototype, "removeWarehouse", null);
exports.WarehouseResolver = WarehouseResolver = __decorate([
    (0, graphql_1.Resolver)(() => warehouse_entity_1.Warehouse),
    __metadata("design:paramtypes", [warehouse_service_1.WarehouseService])
], WarehouseResolver);
//# sourceMappingURL=warehouse.resolver.js.map