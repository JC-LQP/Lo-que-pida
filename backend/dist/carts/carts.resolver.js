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
exports.CartsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const carts_service_1 = require("./carts.service");
const cart_entity_1 = require("./entities/cart.entity");
const cart_item_entity_1 = require("./entities/cart-item.entity");
const create_cart_input_1 = require("./dto/create-cart.input");
const add_item_to_cart_input_1 = require("./dto/add-item-to-cart.input");
const update_cart_item_input_1 = require("./dto/update-cart-item.input");
let CartsResolver = class CartsResolver {
    cartsService;
    constructor(cartsService) {
        this.cartsService = cartsService;
    }
    createCart(input) {
        return this.cartsService.create(input);
    }
    addItemToCart(input) {
        return this.cartsService.addItem(input);
    }
    updateCartItem(input) {
        return this.cartsService.updateItem(input);
    }
    removeCartItem(itemId) {
        return this.cartsService.removeItem(itemId);
    }
    findCartByCustomer(customerId) {
        return this.cartsService.findCartByCustomer(customerId);
    }
};
exports.CartsResolver = CartsResolver;
__decorate([
    (0, graphql_1.Mutation)(() => cart_entity_1.Cart),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cart_input_1.CreateCartInput]),
    __metadata("design:returntype", void 0)
], CartsResolver.prototype, "createCart", null);
__decorate([
    (0, graphql_1.Mutation)(() => cart_item_entity_1.CartItem),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [add_item_to_cart_input_1.AddItemToCartInput]),
    __metadata("design:returntype", void 0)
], CartsResolver.prototype, "addItemToCart", null);
__decorate([
    (0, graphql_1.Mutation)(() => cart_item_entity_1.CartItem),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_cart_item_input_1.UpdateCartItemInput]),
    __metadata("design:returntype", void 0)
], CartsResolver.prototype, "updateCartItem", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('itemId', { type: () => String })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CartsResolver.prototype, "removeCartItem", null);
__decorate([
    (0, graphql_1.Query)(() => cart_entity_1.Cart, { nullable: true }),
    __param(0, (0, graphql_1.Args)('customerId', { type: () => String })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CartsResolver.prototype, "findCartByCustomer", null);
exports.CartsResolver = CartsResolver = __decorate([
    (0, graphql_1.Resolver)(() => cart_entity_1.Cart),
    __metadata("design:paramtypes", [carts_service_1.CartsService])
], CartsResolver);
//# sourceMappingURL=carts.resolver.js.map