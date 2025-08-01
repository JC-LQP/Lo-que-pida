"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductReviewsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const product_review_entity_1 = require("./entities/product-review.entity");
const product_entity_1 = require("../products/entities/product.entity");
const user_entity_1 = require("../users/entities/user.entity");
const product_reviews_service_1 = require("./product-reviews.service");
const product_reviews_resolver_1 = require("./product-reviews.resolver");
let ProductReviewsModule = class ProductReviewsModule {
};
exports.ProductReviewsModule = ProductReviewsModule;
exports.ProductReviewsModule = ProductReviewsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([product_review_entity_1.ProductReview, product_entity_1.Product, user_entity_1.User])],
        providers: [product_reviews_service_1.ProductReviewsService, product_reviews_resolver_1.ProductReviewsResolver],
    })
], ProductReviewsModule);
//# sourceMappingURL=product-reviews.module.js.map