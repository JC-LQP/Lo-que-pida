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
exports.ShippingInfo = void 0;
const typeorm_1 = require("typeorm");
const order_entity_1 = require("../../orders/entities/order.entity");
const address_entity_1 = require("../../addresses/entities/address.entity");
let ShippingInfo = class ShippingInfo {
    id;
    order;
    address;
    shippingMethod;
    trackingNumber;
    carrierName;
    estimatedDeliveryDate;
};
exports.ShippingInfo = ShippingInfo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ShippingInfo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => order_entity_1.Order),
    (0, typeorm_1.JoinColumn)({ name: 'order_id' }),
    __metadata("design:type", order_entity_1.Order)
], ShippingInfo.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => address_entity_1.Address),
    (0, typeorm_1.JoinColumn)({ name: 'address_id' }),
    __metadata("design:type", address_entity_1.Address)
], ShippingInfo.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_method', length: 100 }),
    __metadata("design:type", String)
], ShippingInfo.prototype, "shippingMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tracking_number', nullable: true }),
    __metadata("design:type", String)
], ShippingInfo.prototype, "trackingNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'carrier_name', nullable: true, length: 100 }),
    __metadata("design:type", String)
], ShippingInfo.prototype, "carrierName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'estimated_delivery_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], ShippingInfo.prototype, "estimatedDeliveryDate", void 0);
exports.ShippingInfo = ShippingInfo = __decorate([
    (0, typeorm_1.Entity)({ name: 'shipping_info' })
], ShippingInfo);
//# sourceMappingURL=shipping-info.entity.js.map