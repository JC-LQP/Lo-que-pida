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
exports.ShippingInfoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const shipping_info_entity_1 = require("./entities/shipping-info.entity");
const order_entity_1 = require("../orders/entities/order.entity");
const address_entity_1 = require("../addresses/entities/address.entity");
let ShippingInfoService = class ShippingInfoService {
    shippingInfoRepository;
    orderRepository;
    addressRepository;
    constructor(shippingInfoRepository, orderRepository, addressRepository) {
        this.shippingInfoRepository = shippingInfoRepository;
        this.orderRepository = orderRepository;
        this.addressRepository = addressRepository;
    }
    async create(input) {
        const { orderId, addressId, ...shippingData } = input;
        const existingShippingInfo = await this.shippingInfoRepository.findOne({
            where: { order: { id: orderId } }
        });
        if (existingShippingInfo) {
            throw new Error(`Shipping info already exists for order ${orderId}`);
        }
        const order = await this.orderRepository.findOne({ where: { id: orderId } });
        if (!order) {
            throw new common_1.NotFoundException(`Order with id ${orderId} not found`);
        }
        const address = await this.addressRepository.findOne({ where: { id: addressId } });
        if (!address) {
            throw new common_1.NotFoundException(`Address with id ${addressId} not found`);
        }
        const shippingInfo = this.shippingInfoRepository.create({
            ...shippingData,
            order,
            address,
        });
        const savedShippingInfo = await this.shippingInfoRepository.save(shippingInfo);
        const result = await this.shippingInfoRepository.findOne({
            where: { id: savedShippingInfo.id },
            relations: ['order', 'address'],
        });
        if (!result) {
            throw new common_1.NotFoundException(`Failed to retrieve created ShippingInfo`);
        }
        return result;
    }
    async findAll() {
        return this.shippingInfoRepository.find({ relations: ['order', 'address'] });
    }
    async findOne(id) {
        const shippingInfo = await this.shippingInfoRepository.findOne({
            where: { id },
            relations: ['order', 'address'],
        });
        if (!shippingInfo) {
            throw new common_1.NotFoundException(`ShippingInfo with id ${id} not found`);
        }
        return shippingInfo;
    }
    async update(id, input) {
        const shippingInfo = await this.findOne(id);
        Object.assign(shippingInfo, input);
        return this.shippingInfoRepository.save(shippingInfo);
    }
    async remove(id) {
        const shippingInfo = await this.findOne(id);
        await this.shippingInfoRepository.remove(shippingInfo);
        return shippingInfo;
    }
};
exports.ShippingInfoService = ShippingInfoService;
exports.ShippingInfoService = ShippingInfoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(shipping_info_entity_1.ShippingInfo)),
    __param(1, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(2, (0, typeorm_1.InjectRepository)(address_entity_1.Address)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ShippingInfoService);
//# sourceMappingURL=shipping-info.service.js.map