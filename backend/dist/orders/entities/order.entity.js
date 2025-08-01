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
exports.Order = exports.OrderStatus = void 0;
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const customer_entity_1 = require("../../customers/entities/customer.entity");
const order_item_entity_1 = require("./order-item.entity");
const payment_entity_1 = require("../../payments/entities/payment.entity");
const shipping_info_entity_1 = require("../../shipping-info/entities/shipping-info.entity");
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "pending";
    OrderStatus["PROCESSING"] = "processing";
    OrderStatus["SHIPPED"] = "shipped";
    OrderStatus["DELIVERED"] = "delivered";
    OrderStatus["CANCELLED"] = "cancelled";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
(0, graphql_1.registerEnumType)(OrderStatus, {
    name: 'OrderStatus',
});
let Order = class Order {
    id;
    customer;
    items;
    payment;
    shippingInfo;
    status;
    total;
    createdAt;
    updatedAt;
};
exports.Order = Order;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Order.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => customer_entity_1.Customer, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer),
    (0, typeorm_1.JoinColumn)({ name: 'customer_id' }),
    __metadata("design:type", customer_entity_1.Customer)
], Order.prototype, "customer", void 0);
__decorate([
    (0, graphql_1.Field)(() => [order_item_entity_1.OrderItem]),
    (0, typeorm_1.OneToMany)(() => order_item_entity_1.OrderItem, (item) => item.order),
    __metadata("design:type", Array)
], Order.prototype, "items", void 0);
__decorate([
    (0, graphql_1.Field)(() => payment_entity_1.Payment, { nullable: true }),
    (0, typeorm_1.OneToOne)(() => payment_entity_1.Payment, (payment) => payment.order),
    __metadata("design:type", payment_entity_1.Payment)
], Order.prototype, "payment", void 0);
__decorate([
    (0, graphql_1.Field)(() => shipping_info_entity_1.ShippingInfo, { nullable: true }),
    (0, typeorm_1.OneToOne)(() => shipping_info_entity_1.ShippingInfo, (shippingInfo) => shippingInfo.order),
    __metadata("design:type", shipping_info_entity_1.ShippingInfo)
], Order.prototype, "shippingInfo", void 0);
__decorate([
    (0, graphql_1.Field)(() => OrderStatus),
    (0, typeorm_1.Column)({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Order.prototype, "total", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Order.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Order.prototype, "updatedAt", void 0);
exports.Order = Order = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)({ name: 'orders' })
], Order);
//# sourceMappingURL=order.entity.js.map