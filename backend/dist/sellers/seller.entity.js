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
exports.Seller = exports.SellerStatus = exports.SellerSubscription = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
var SellerSubscription;
(function (SellerSubscription) {
    SellerSubscription["LOCAL"] = "local";
    SellerSubscription["REGIONAL"] = "regional";
    SellerSubscription["NATIONAL"] = "national";
    SellerSubscription["INTERNATIONAL"] = "international";
})(SellerSubscription || (exports.SellerSubscription = SellerSubscription = {}));
var SellerStatus;
(function (SellerStatus) {
    SellerStatus["PENDING"] = "pending";
    SellerStatus["APPROVED"] = "approved";
    SellerStatus["REJECTED"] = "rejected";
})(SellerStatus || (exports.SellerStatus = SellerStatus = {}));
let Seller = class Seller {
    id;
    user;
    storeName;
    taxId;
    phoneNumber;
    subscription;
    status;
};
exports.Seller = Seller;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Seller.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Seller.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'store_name', unique: true, length: 100 }),
    __metadata("design:type", String)
], Seller.prototype, "storeName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tax_id', length: 50, nullable: true }),
    __metadata("design:type", String)
], Seller.prototype, "taxId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phone_number', length: 20, nullable: true }),
    __metadata("design:type", String)
], Seller.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: SellerSubscription, nullable: true }),
    __metadata("design:type", String)
], Seller.prototype, "subscription", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: SellerStatus, default: SellerStatus.PENDING }),
    __metadata("design:type", String)
], Seller.prototype, "status", void 0);
exports.Seller = Seller = __decorate([
    (0, typeorm_1.Entity)({ name: 'sellers' })
], Seller);
//# sourceMappingURL=seller.entity.js.map