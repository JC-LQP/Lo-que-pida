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
exports.ProductReviewsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_review_entity_1 = require("./entities/product-review.entity");
let ProductReviewsService = class ProductReviewsService {
    reviewRepo;
    constructor(reviewRepo) {
        this.reviewRepo = reviewRepo;
    }
    create(input) {
        const review = this.reviewRepo.create({
            ...input,
            user: { id: input.userId },
            product: { id: input.productId },
        });
        return this.reviewRepo.save(review);
    }
    findAll() {
        return this.reviewRepo.find({ relations: ['user', 'product'] });
    }
    async findOne(id) {
        const review = await this.reviewRepo.findOne({
            where: { id },
            relations: ['user', 'product'],
        });
        if (!review) {
            throw new common_1.NotFoundException(`Review #${id} not found`);
        }
        return review;
    }
    async update(id, input) {
        const review = await this.reviewRepo.preload(input);
        if (!review)
            throw new common_1.NotFoundException(`Review #${id} not found`);
        return this.reviewRepo.save(review);
    }
    async remove(id) {
        const review = await this.findOne(id);
        return this.reviewRepo.remove(review);
    }
};
exports.ProductReviewsService = ProductReviewsService;
exports.ProductReviewsService = ProductReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_review_entity_1.ProductReview)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductReviewsService);
//# sourceMappingURL=product-reviews.service.js.map