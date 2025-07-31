"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const orders_service_1 = require("./orders.service");
const orders_resolver_1 = require("./orders.resolver");
const order_entity_1 = require("./entities/order.entity");
const order_item_entity_1 = require("./entities/order-item.entity");
const customer_entity_1 = require("../customers/entities/customer.entity");
const shipping_info_entity_1 = require("../shipping-info/entities/shipping-info.entity");
const payment_entity_1 = require("../payments/entities/payment.entity");
let OrdersModule = class OrdersModule {
};
exports.OrdersModule = OrdersModule;
exports.OrdersModule = OrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([order_entity_1.Order, order_item_entity_1.OrderItem, customer_entity_1.Customer, shipping_info_entity_1.ShippingInfo, payment_entity_1.Payment])],
        providers: [orders_service_1.OrdersService, orders_resolver_1.OrdersResolver],
    })
], OrdersModule);
//# sourceMappingURL=orders.module.js.map