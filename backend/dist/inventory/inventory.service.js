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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const inventory_entity_1 = require("./entities/inventory.entity");
const typeorm_2 = require("typeorm");
let InventoryService = class InventoryService {
    inventoryRepository;
    constructor(inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }
    async create(input) {
        const inventory = this.inventoryRepository.create(input);
        return this.inventoryRepository.save(inventory);
    }
    async findAll() {
        return this.inventoryRepository.find({ relations: ['products'] });
    }
    async findOne(id) {
        const inventory = await this.inventoryRepository.findOne({
            where: { id },
            relations: ['products'],
        });
        if (!inventory) {
            throw new common_1.NotFoundException(`Inventory with ID ${id} not found`);
        }
        return inventory;
    }
    async update(id, input) {
        const inventory = await this.findOne(id);
        Object.assign(inventory, input);
        return this.inventoryRepository.save(inventory);
    }
    async remove(id) {
        const result = await this.inventoryRepository.delete(id);
        return (result.affected ?? 0) > 0;
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(inventory_entity_1.Inventory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map