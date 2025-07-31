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
exports.Seller = exports.SellerStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const subscription_entity_1 = require("../../subscriptions/entities/subscription.entity");
const product_entity_1 = require("../../products/entities/product.entity");
const warehouse_entity_1 = require("../../warehouses/entities/warehouse.entity");
var SellerStatus;
(function (SellerStatus) {
    SellerStatus["ACTIVE"] = "active";
    SellerStatus["INACTIVE"] = "inactive";
    SellerStatus["BANNED"] = "banned";
})(SellerStatus || (exports.SellerStatus = SellerStatus = {}));
let Seller = class Seller {
    id;
    user;
    storeName;
    storeDescription;
    storeLogo;
    subscription;
    status;
    createdAt;
    products;
    warehouses;
};
exports.Seller = Seller;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Seller.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: false, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Seller.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'store_name' }),
    __metadata("design:type", String)
], Seller.prototype, "storeName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'store_description', nullable: true, type: 'text' }),
    __metadata("design:type", String)
], Seller.prototype, "storeDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'store_logo', nullable: true }),
    __metadata("design:type", String)
], Seller.prototype, "storeLogo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => subscription_entity_1.Subscription, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'subscription_id' }),
    __metadata("design:type", subscription_entity_1.Subscription)
], Seller.prototype, "subscription", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SellerStatus,
        default: SellerStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], Seller.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Seller.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_entity_1.Product, (product) => product.seller),
    __metadata("design:type", Array)
], Seller.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => warehouse_entity_1.Warehouse, (warehouse) => warehouse.seller),
    __metadata("design:type", Array)
], Seller.prototype, "warehouses", void 0);
exports.Seller = Seller = __decorate([
    (0, typeorm_1.Entity)({ name: 'sellers' })
], Seller);
//# sourceMappingURL=seller.entity.js.map