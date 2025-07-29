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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    httpService;
    configService;
    usersService;
    constructor(httpService, configService, usersService) {
        this.httpService = httpService;
        this.configService = configService;
        this.usersService = usersService;
    }
    async firebaseLogin(email, password) {
        const apiKey = this.configService.get('FIREBASE_API_KEY');
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(url, {
                email,
                password,
                returnSecureToken: true,
            }));
            const { idToken, refreshToken, expiresIn } = response.data;
            return {
                accessToken: idToken,
                refreshToken,
                expiresIn: parseInt(expiresIn),
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Correo o contraseña inválidos');
        }
    }
    async validateOrCreateUser(firebaseUser) {
        const firebaseUid = firebaseUser.uid;
        const email = firebaseUser.email;
        let user = await this.usersService.findByFirebaseUid(firebaseUid);
        if (!user) {
            const createUserInput = {
                firebaseUid,
                email,
                fullName: '',
            };
            user = await this.usersService.create(createUserInput);
        }
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService,
        users_service_1.UsersService])
], AuthService);
//# sourceMappingURL=auth.service.js.map