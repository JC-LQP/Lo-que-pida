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
exports.GqlFirebaseAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const admin = require("firebase-admin");
let GqlFirebaseAuthGuard = class GqlFirebaseAuthGuard {
    firebaseApp;
    constructor(firebaseApp) {
        this.firebaseApp = firebaseApp;
    }
    async canActivate(context) {
        const ctx = graphql_1.GqlExecutionContext.create(context).getContext();
        const authHeader = ctx.req.headers?.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('No se proporcionó un token válido');
        }
        const token = authHeader.slice(7).trim();
        try {
            const decodedToken = await this.firebaseApp.auth().verifyIdToken(token);
            ctx.user = decodedToken;
            return true;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Token de Firebase inválido o expirado');
        }
    }
};
exports.GqlFirebaseAuthGuard = GqlFirebaseAuthGuard;
exports.GqlFirebaseAuthGuard = GqlFirebaseAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('FIREBASE_ADMIN')),
    __metadata("design:paramtypes", [Object])
], GqlFirebaseAuthGuard);
//# sourceMappingURL=gql-firebase-auth.guard.js.map