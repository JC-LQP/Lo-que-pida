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
exports.AddressesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const address_entity_1 = require("./entities/address.entity");
const customer_entity_1 = require("../customers/entities/customer.entity");
let AddressesService = class AddressesService {
    addressRepository;
    customerRepository;
    constructor(addressRepository, customerRepository) {
        this.addressRepository = addressRepository;
        this.customerRepository = customerRepository;
    }
    async create(input) {
        const customer = await this.customerRepository.findOne({ where: { id: input.customerId } });
        if (!customer)
            throw new common_1.NotFoundException('Customer not found');
        const address = this.addressRepository.create({ ...input, customer });
        return this.addressRepository.save(address);
    }
    findAll() {
        return this.addressRepository.find({ relations: ['customer'] });
    }
    async findOne(id) {
        const address = await this.addressRepository.findOne({ where: { id }, relations: ['customer'] });
        if (!address)
            throw new common_1.NotFoundException('Address not found');
        return address;
    }
    async update(id, input) {
        const address = await this.findOne(id);
        Object.assign(address, input);
        return this.addressRepository.save(address);
    }
    async remove(id) {
        const result = await this.addressRepository.delete(id);
        return (result.affected ?? 0) > 0;
    }
};
exports.AddressesService = AddressesService;
exports.AddressesService = AddressesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(address_entity_1.Address)),
    __param(1, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AddressesService);
//# sourceMappingURL=addresses.service.js.map