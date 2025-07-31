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
exports.Product = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const seller_entity_1 = require("../../sellers/entities/seller.entity");
const product_review_entity_1 = require("../../product_reviews/entities/product-review.entity");
const inventory_entity_1 = require("../../inventory/entities/inventory.entity");
const order_item_entity_1 = require("../../orders/entities/order-item.entity");
const product_condition_enum_1 = require("../../common/enums/product-condition.enum");
let Product = class Product {
    id;
    name;
    description;
    price;
    condition;
    seller;
    reviews;
    inventory;
    orderItems;
    createdAt;
    updatedAt;
};
exports.Product = Product;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Product.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Product.prototype, "price", void 0);
__decorate([
    (0, graphql_1.Field)(() => product_condition_enum_1.ProductCondition),
    (0, typeorm_1.Column)({ type: 'enum', enum: product_condition_enum_1.ProductCondition }),
    __metadata("design:type", String)
], Product.prototype, "condition", void 0);
__decorate([
    (0, graphql_1.Field)(() => seller_entity_1.Seller),
    (0, typeorm_1.ManyToOne)(() => seller_entity_1.Seller, (seller) => seller.products),
    __metadata("design:type", seller_entity_1.Seller)
], Product.prototype, "seller", void 0);
__decorate([
    (0, graphql_1.Field)(() => [product_review_entity_1.ProductReview], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => product_review_entity_1.ProductReview, (review) => review.product),
    __metadata("design:type", Array)
], Product.prototype, "reviews", void 0);
__decorate([
    (0, graphql_1.Field)(() => inventory_entity_1.Inventory, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => inventory_entity_1.Inventory, (inventory) => inventory.products, { nullable: true }),
    __metadata("design:type", inventory_entity_1.Inventory)
], Product.prototype, "inventory", void 0);
__decorate([
    (0, graphql_1.Field)(() => [order_item_entity_1.OrderItem], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => order_item_entity_1.OrderItem, (item) => item.product),
    __metadata("design:type", Array)
], Product.prototype, "orderItems", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Product.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Product.prototype, "updatedAt", void 0);
exports.Product = Product = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)({ name: 'products' })
], Product);
//# sourceMappingURL=product.entity.js.map