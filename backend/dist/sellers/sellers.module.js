"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const sellers_service_1 = require("./sellers.service");
const sellers_resolver_1 = require("./sellers.resolver");
const seller_entity_1 = require("./entities/seller.entity");
const user_entity_1 = require("../users/entities/user.entity");
const subscription_entity_1 = require("../subscriptions/entities/subscription.entity");
const product_entity_1 = require("../products/entities/product.entity");
const warehouse_entity_1 = require("../warehouses/entities/warehouse.entity");
let SellersModule = class SellersModule {
};
exports.SellersModule = SellersModule;
exports.SellersModule = SellersModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([seller_entity_1.Seller, user_entity_1.User, subscription_entity_1.Subscription, product_entity_1.Product, warehouse_entity_1.Warehouse])],
        providers: [sellers_resolver_1.SellersResolver, sellers_service_1.SellersService],
    })
], SellersModule);
//# sourceMappingURL=sellers.module.js.map