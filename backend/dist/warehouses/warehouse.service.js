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
exports.WarehouseService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const warehouse_entity_1 = require("./entities/warehouse.entity");
const seller_entity_1 = require("../sellers/entities/seller.entity");
const address_entity_1 = require("../addresses/entities/address.entity");
let WarehouseService = class WarehouseService {
    warehouseRepository;
    sellerRepository;
    addressRepository;
    constructor(warehouseRepository, sellerRepository, addressRepository) {
        this.warehouseRepository = warehouseRepository;
        this.sellerRepository = sellerRepository;
        this.addressRepository = addressRepository;
    }
    async create(input) {
        const seller = await this.sellerRepository.findOne({ where: { id: input.sellerId } });
        if (!seller) {
            throw new common_1.NotFoundException(`Seller with ID ${input.sellerId} not found`);
        }
        const address = await this.addressRepository.findOne({ where: { id: input.addressId } });
        if (!address) {
            throw new common_1.NotFoundException(`Address with ID ${input.addressId} not found`);
        }
        const warehouse = this.warehouseRepository.create({
            ...input,
            seller,
            address,
        });
        return this.warehouseRepository.save(warehouse);
    }
    findAll() {
        return this.warehouseRepository.find({
            relations: ['seller', 'address'],
        });
    }
    findOne(id) {
        return this.warehouseRepository.findOne({
            where: { id },
            relations: ['seller', 'address'],
        });
    }
    async update(id, input) {
        await this.warehouseRepository.update(id, input);
        return this.findOne(id);
    }
    async remove(id) {
        const warehouse = await this.findOne(id);
        if (!warehouse) {
            throw new common_1.NotFoundException(`Warehouse #${id} not found`);
        }
        await this.warehouseRepository.remove(warehouse);
        return true;
    }
};
exports.WarehouseService = WarehouseService;
exports.WarehouseService = WarehouseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(warehouse_entity_1.Warehouse)),
    __param(1, (0, typeorm_1.InjectRepository)(seller_entity_1.Seller)),
    __param(2, (0, typeorm_1.InjectRepository)(address_entity_1.Address)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], WarehouseService);
//# sourceMappingURL=warehouse.service.js.map