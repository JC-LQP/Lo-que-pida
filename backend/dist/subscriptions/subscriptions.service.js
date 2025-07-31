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
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const subscription_entity_1 = require("./entities/subscription.entity");
let SubscriptionsService = class SubscriptionsService {
    subscriptionRepository;
    constructor(subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }
    async create(input) {
        const subscription = this.subscriptionRepository.create(input);
        return this.subscriptionRepository.save(subscription);
    }
    findAll() {
        return this.subscriptionRepository.find({ relations: ['seller'] });
    }
    async findOne(id) {
        const subscription = await this.subscriptionRepository.findOne({
            where: { id },
            relations: ['seller'],
        });
        if (!subscription) {
            throw new common_1.NotFoundException(`Subscription with ID ${id} not found`);
        }
        return subscription;
    }
    async update(input) {
        const subscription = await this.findOne(input.id);
        Object.assign(subscription, input);
        return this.subscriptionRepository.save(subscription);
    }
    async remove(id) {
        const subscription = await this.findOne(id);
        return this.subscriptionRepository.remove(subscription);
    }
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subscription_entity_1.Subscription)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map