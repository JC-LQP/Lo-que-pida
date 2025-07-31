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
exports.Inventory = void 0;
const typeorm_1 = require("typeorm");
const product_entity_1 = require("../../products/entities/product.entity");
const category_entity_1 = require("../../categories/entities/category.entity");
const graphql_1 = require("@nestjs/graphql");
let Inventory = class Inventory {
    id;
    category;
    products;
    stock;
    reservedStock;
    soldStock;
    createdAt;
    updatedAt;
};
exports.Inventory = Inventory;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Inventory.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => category_entity_1.Category),
    (0, typeorm_1.ManyToOne)(() => category_entity_1.Category, (category) => category.inventoryItems, { nullable: false }),
    __metadata("design:type", category_entity_1.Category)
], Inventory.prototype, "category", void 0);
__decorate([
    (0, graphql_1.Field)(() => [product_entity_1.Product], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => product_entity_1.Product, (product) => product.inventory),
    __metadata("design:type", Array)
], Inventory.prototype, "products", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], Inventory.prototype, "stock", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)('int', { name: 'reserved_stock', default: 0 }),
    __metadata("design:type", Number)
], Inventory.prototype, "reservedStock", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)('int', { name: 'sold_stock', default: 0 }),
    __metadata("design:type", Number)
], Inventory.prototype, "soldStock", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Inventory.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Inventory.prototype, "updatedAt", void 0);
exports.Inventory = Inventory = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)({ name: 'inventory' })
], Inventory);
//# sourceMappingURL=inventory.entity.js.map