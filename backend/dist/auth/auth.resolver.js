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
exports.AuthResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const gql_firebase_auth_guard_1 = require("../auth/guards/gql-firebase-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const users_service_1 = require("../users/users.service");
let AuthResolver = class AuthResolver {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async syncUser(user) {
        await this.usersService.validateOrCreateUser(user);
        return true;
    }
};
exports.AuthResolver = AuthResolver;
__decorate([
    (0, common_1.UseGuards)(gql_firebase_auth_guard_1.GqlFirebaseAuthGuard),
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "syncUser", null);
exports.AuthResolver = AuthResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], AuthResolver);
//# sourceMappingURL=auth.resolver.js.map