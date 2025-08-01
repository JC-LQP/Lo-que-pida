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
exports.ProductReviewsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const product_reviews_service_1 = require("./product-reviews.service");
const product_review_entity_1 = require("./entities/product-review.entity");
const create_product_review_input_1 = require("./dto/create-product-review.input");
const update_product_review_input_1 = require("./dto/update-product-review.input");
let ProductReviewsResolver = class ProductReviewsResolver {
    service;
    constructor(service) {
        this.service = service;
    }
    createProductReview(input) {
        return this.service.create(input);
    }
    findAll() {
        return this.service.findAll();
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    updateProductReview(input) {
        return this.service.update(input.id, input);
    }
    removeProductReview(id) {
        return this.service.remove(id);
    }
};
exports.ProductReviewsResolver = ProductReviewsResolver;
__decorate([
    (0, graphql_1.Mutation)(() => product_review_entity_1.ProductReview),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_review_input_1.CreateProductReviewInput]),
    __metadata("design:returntype", void 0)
], ProductReviewsResolver.prototype, "createProductReview", null);
__decorate([
    (0, graphql_1.Query)(() => [product_review_entity_1.ProductReview], { name: 'productReviews' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductReviewsResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Query)(() => product_review_entity_1.ProductReview, { name: 'productReview' }),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductReviewsResolver.prototype, "findOne", null);
__decorate([
    (0, graphql_1.Mutation)(() => product_review_entity_1.ProductReview),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_product_review_input_1.UpdateProductReviewInput]),
    __metadata("design:returntype", void 0)
], ProductReviewsResolver.prototype, "updateProductReview", null);
__decorate([
    (0, graphql_1.Mutation)(() => product_review_entity_1.ProductReview),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductReviewsResolver.prototype, "removeProductReview", null);
exports.ProductReviewsResolver = ProductReviewsResolver = __decorate([
    (0, graphql_1.Resolver)(() => product_review_entity_1.ProductReview),
    __metadata("design:paramtypes", [product_reviews_service_1.ProductReviewsService])
], ProductReviewsResolver);
//# sourceMappingURL=product-reviews.resolver.js.map