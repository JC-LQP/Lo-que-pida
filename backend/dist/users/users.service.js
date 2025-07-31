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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const user_entity_2 = require("../users/entities/user.entity");
const seller_entity_1 = require("../sellers/entities/seller.entity");
let UsersService = class UsersService {
    userRepo;
    sellerRepo;
    constructor(userRepo, sellerRepo) {
        this.userRepo = userRepo;
        this.sellerRepo = sellerRepo;
    }
    findAll() {
        return this.userRepo.find();
    }
    async findByEmail(email) {
        return this.userRepo.findOne({ where: { email } });
    }
    async findByFirebaseUid(firebaseUid) {
        return this.userRepo.findOne({ where: { firebaseUid } });
    }
    async validateOrCreateUser(firebaseUser) {
        const { uid, email, name, picture } = firebaseUser;
        let user = await this.findByFirebaseUid(uid);
        if (!user) {
            user = this.userRepo.create({
                firebaseUid: uid,
                email: email ?? '',
                fullName: name ?? undefined,
                profileImage: picture ?? undefined,
                isVerified: true,
                role: user_entity_2.UserRole.CUSTOMER,
            });
            await this.userRepo.save(user);
        }
        return user;
    }
    async create(input) {
        const existing = await this.findByEmail(input.email);
        if (existing) {
            throw new common_1.ConflictException('El correo ya está registrado');
        }
        const user = this.userRepo.create({
            ...input,
            isVerified: true,
        });
        return this.userRepo.save(user);
    }
    async findOne(id) {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        return user;
    }
    async update(id, input) {
        const user = await this.findOne(id);
        const updated = Object.assign(user, input);
        return this.userRepo.save(updated);
    }
    async remove(id) {
        const user = await this.findOne(id);
        return this.userRepo.softRemove(user);
    }
    async deleteUser(id) {
        const result = await this.userRepo.delete(id);
        return (result.affected ?? 0) > 0;
    }
    async findSellerByUserId(userId) {
        return this.sellerRepo.findOne({
            where: { user: { id: userId } },
            relations: ['user']
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(seller_entity_1.Seller)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map