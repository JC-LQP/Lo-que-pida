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
exports.CartItem = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const cart_entity_1 = require("./cart.entity");
const product_entity_1 = require("../../products/entities/product.entity");
let CartItem = class CartItem {
    id;
    cart;
    product;
    quantity;
};
exports.CartItem = CartItem;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CartItem.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => cart_entity_1.Cart),
    (0, typeorm_1.ManyToOne)(() => cart_entity_1.Cart, (cart) => cart.items, { onDelete: 'CASCADE' }),
    __metadata("design:type", cart_entity_1.Cart)
], CartItem.prototype, "cart", void 0);
__decorate([
    (0, graphql_1.Field)(() => product_entity_1.Product),
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, { eager: true, onDelete: 'CASCADE' }),
    __metadata("design:type", product_entity_1.Product)
], CartItem.prototype, "product", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], CartItem.prototype, "quantity", void 0);
exports.CartItem = CartItem = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)({ name: 'cart_items' })
], CartItem);
//# sourceMappingURL=cart-item.entity.js.map