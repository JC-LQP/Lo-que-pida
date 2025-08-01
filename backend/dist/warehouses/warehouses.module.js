"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const warehouse_entity_1 = require("./entities/warehouse.entity");
const seller_entity_1 = require("../sellers/entities/seller.entity");
const address_entity_1 = require("../addresses/entities/address.entity");
const warehouse_service_1 = require("./warehouse.service");
const warehouse_resolver_1 = require("./warehouse.resolver");
let WarehouseModule = class WarehouseModule {
};
exports.WarehouseModule = WarehouseModule;
exports.WarehouseModule = WarehouseModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([warehouse_entity_1.Warehouse, seller_entity_1.Seller, address_entity_1.Address])],
        providers: [warehouse_service_1.WarehouseService, warehouse_resolver_1.WarehouseResolver],
    })
], WarehouseModule);
//# sourceMappingURL=warehouses.module.js.map