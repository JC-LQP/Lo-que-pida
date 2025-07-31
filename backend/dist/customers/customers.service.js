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
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const customer_entity_1 = require("./entities/customer.entity");
const user_entity_1 = require("../users/entities/user.entity");
let CustomersService = class CustomersService {
    customerRepository;
    userRepository;
    constructor(customerRepository, userRepository) {
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
    }
    async create(input) {
        const user = await this.userRepository.findOne({ where: { id: input.userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const customer = this.customerRepository.create({ user });
        return this.customerRepository.save(customer);
    }
    findAll() {
        return this.customerRepository.find({ relations: ['user'] });
    }
    async findOne(id) {
        const customer = await this.customerRepository.findOne({ where: { id }, relations: ['user'] });
        if (!customer)
            throw new common_1.NotFoundException('Customer not found');
        return customer;
    }
    async update(input) {
        const customer = await this.findOne(input.id);
        if (input.userId) {
            const user = await this.userRepository.findOne({ where: { id: input.userId } });
            if (!user)
                throw new common_1.NotFoundException('User not found');
            customer.user = user;
        }
        return this.customerRepository.save(customer);
    }
    async remove(id) {
        const customer = await this.findOne(id);
        return this.customerRepository.remove(customer);
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CustomersService);
//# sourceMappingURL=customers.service.js.map