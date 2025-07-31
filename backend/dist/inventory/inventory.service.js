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
const typeorm_2 = require("typeorm");
const inventory_entity_1 = require("./entities/inventory.entity");
const category_entity_1 = require("../categories/entities/category.entity");
let InventoryService = class InventoryService {
    inventoryRepository;
    categoryRepository;
    constructor(inventoryRepository, categoryRepository) {
        this.inventoryRepository = inventoryRepository;
        this.categoryRepository = categoryRepository;
    }
    async create(input) {
        const category = await this.categoryRepository.findOneBy({ id: input.categoryId });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${input.categoryId} not found`);
        }
        const inventory = this.inventoryRepository.create({
            ...input,
            category,
        });
        return this.inventoryRepository.save(inventory);
    }
    async findAll() {
        return this.inventoryRepository.find({
            relations: ['products', 'category'],
        });
    }
    async findOne(id) {
        const inventory = await this.inventoryRepository.findOne({
            where: { id },
            relations: ['products', 'category'],
        });
        if (!inventory) {
            throw new common_1.NotFoundException(`Inventory with ID ${id} not found`);
        }
        return inventory;
    }
    async update(id, input) {
        const inventory = await this.findOne(id);
        if (input.categoryId) {
            const category = await this.categoryRepository.findOneBy({ id: input.categoryId });
            if (!category) {
                throw new common_1.NotFoundException(`Category with ID ${input.categoryId} not found`);
            }
            inventory.category = category;
        }
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
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map