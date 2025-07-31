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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./entities/product.entity");
const seller_entity_1 = require("../sellers/entities/seller.entity");
let ProductsService = class ProductsService {
    productRepository;
    sellerRepository;
    constructor(productRepository, sellerRepository) {
        this.productRepository = productRepository;
        this.sellerRepository = sellerRepository;
    }
    async create(createProductInput) {
        const seller = await this.sellerRepository.findOneBy({ id: createProductInput.sellerId });
        if (!seller)
            throw new common_1.NotFoundException('Seller not found');
        const product = this.productRepository.create({
            ...createProductInput,
            seller,
        });
        return this.productRepository.save(product);
    }
    findAll() {
        return this.productRepository.find({
            relations: ['seller', 'seller.user', 'inventory', 'inventory.category'],
        });
    }
    async findOne(id) {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['seller', 'seller.user', 'inventory', 'inventory.category'],
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async update(id, updateProductInput) {
        const product = await this.productRepository.preload({
            id,
            ...updateProductInput,
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        if (updateProductInput.sellerId) {
            const seller = await this.sellerRepository.findOneBy({ id: updateProductInput.sellerId });
            if (!seller)
                throw new common_1.NotFoundException('Seller not found');
            product.seller = seller;
        }
        return this.productRepository.save(product);
    }
    async remove(id) {
        const product = await this.findOne(id);
        await this.productRepository.remove(product);
        return product;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(seller_entity_1.Seller)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map