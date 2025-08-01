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
exports.CartsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cart_entity_1 = require("./entities/cart.entity");
const cart_item_entity_1 = require("./entities/cart-item.entity");
const customer_entity_1 = require("../customers/entities/customer.entity");
const product_entity_1 = require("../products/entities/product.entity");
let CartsService = class CartsService {
    cartRepo;
    itemRepo;
    customerRepo;
    productRepo;
    constructor(cartRepo, itemRepo, customerRepo, productRepo) {
        this.cartRepo = cartRepo;
        this.itemRepo = itemRepo;
        this.customerRepo = customerRepo;
        this.productRepo = productRepo;
    }
    async create(input) {
        const customer = await this.customerRepo.findOne({ where: { id: input.customerId } });
        if (!customer)
            throw new common_1.NotFoundException('Customer not found');
        const cart = this.cartRepo.create({ customer });
        const savedCart = await this.cartRepo.save(cart);
        const cartWithRelations = await this.cartRepo.findOne({
            where: { id: savedCart.id },
            relations: ['customer', 'items'],
        });
        if (!cartWithRelations) {
            throw new common_1.NotFoundException('Failed to load created cart');
        }
        return cartWithRelations;
    }
    async addItem(input) {
        const cart = await this.cartRepo.findOne({ where: { id: input.cartId } });
        if (!cart)
            throw new common_1.NotFoundException('Cart not found');
        const product = await this.productRepo.findOne({ where: { id: input.productId } });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const existingItem = await this.itemRepo.findOne({
            where: { cart: { id: input.cartId }, product: { id: input.productId } },
        });
        if (existingItem) {
            existingItem.quantity += input.quantity;
            return this.itemRepo.save(existingItem);
        }
        const newItem = this.itemRepo.create({
            cart,
            product,
            quantity: input.quantity,
        });
        return this.itemRepo.save(newItem);
    }
    async updateItem(input) {
        const item = await this.itemRepo.findOne({ where: { id: input.itemId } });
        if (!item)
            throw new common_1.NotFoundException('Cart item not found');
        item.quantity = input.quantity;
        return this.itemRepo.save(item);
    }
    async removeItem(itemId) {
        const result = await this.itemRepo.delete(itemId);
        return (result.affected ?? 0) > 0;
    }
    async findCartByCustomer(customerId) {
        return this.cartRepo.findOne({
            where: { customer: { id: customerId } },
            relations: ['customer', 'items', 'items.product'],
        });
    }
};
exports.CartsService = CartsService;
exports.CartsService = CartsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cart_entity_1.Cart)),
    __param(1, (0, typeorm_1.InjectRepository)(cart_item_entity_1.CartItem)),
    __param(2, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(3, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CartsService);
//# sourceMappingURL=carts.service.js.map