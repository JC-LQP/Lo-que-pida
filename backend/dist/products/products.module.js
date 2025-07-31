"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const products_service_1 = require("./products.service");
const products_resolver_1 = require("./products.resolver");
const product_entity_1 = require("./entities/product.entity");
const order_item_entity_1 = require("../orders/entities/order-item.entity");
const inventory_entity_1 = require("../inventory/entities/inventory.entity");
const product_review_entity_1 = require("../product_reviews/entities/product-review.entity");
const seller_entity_1 = require("../sellers/entities/seller.entity");
let ProductsModule = class ProductsModule {
};
exports.ProductsModule = ProductsModule;
exports.ProductsModule = ProductsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([product_entity_1.Product, order_item_entity_1.OrderItem, inventory_entity_1.Inventory, product_review_entity_1.ProductReview, seller_entity_1.Seller])],
        providers: [products_resolver_1.ProductsResolver, products_service_1.ProductsService],
        exports: [products_service_1.ProductsService],
    })
], ProductsModule);
//# sourceMappingURL=products.module.js.map