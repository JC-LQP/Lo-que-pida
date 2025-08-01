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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const customer_entity_1 = require("../customers/entities/customer.entity");
let OrdersService = class OrdersService {
    ordersRepository;
    customersRepository;
    constructor(ordersRepository, customersRepository) {
        this.ordersRepository = ordersRepository;
        this.customersRepository = customersRepository;
    }
    async create(input) {
        const customer = await this.customersRepository.findOne({
            where: { id: input.customerId },
        });
        if (!customer) {
            throw new common_1.NotFoundException(`Customer with ID "${input.customerId}" not found`);
        }
        const order = this.ordersRepository.create({
            ...input,
            customer,
        });
        const savedOrder = await this.ordersRepository.save(order);
        const orderWithRelations = await this.ordersRepository.findOne({
            where: { id: savedOrder.id },
            relations: ['customer', 'items', 'items.product'],
        });
        if (!orderWithRelations) {
            throw new common_1.NotFoundException(`Order with ID "${savedOrder.id}" not found after creation`);
        }
        return orderWithRelations;
    }
    async findAll() {
        const orders = await this.ordersRepository.find({
            relations: ['customer', 'items', 'items.product'],
        });
        return orders;
    }
    async findOne(id) {
        const order = await this.ordersRepository.findOne({
            where: { id },
            relations: ['customer', 'items', 'items.product'],
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID "${id}" not found`);
        }
        return order;
    }
    async update(id, input) {
        const order = await this.findOne(id);
        Object.assign(order, input);
        return this.ordersRepository.save(order);
    }
    async remove(id) {
        const order = await this.findOne(id);
        return this.ordersRepository.remove(order);
    }
    async cleanupInvalidOrders() {
        const ordersWithoutCustomers = await this.ordersRepository.find({
            where: { customer: (0, typeorm_2.IsNull)() },
        });
        if (ordersWithoutCustomers.length > 0) {
            await this.ordersRepository.remove(ordersWithoutCustomers);
            console.log(`Removed ${ordersWithoutCustomers.length} orders without customers`);
        }
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], OrdersService);
//# sourceMappingURL=orders.service.js.map