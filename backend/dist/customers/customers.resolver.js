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
exports.CustomersResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const customer_model_1 = require("./models/customer.model");
let CustomersResolver = class CustomersResolver {
    getCustomers() {
        return [
            {
                id: '1',
                fullName: 'Juan Pérez',
                email: 'juan@example.com',
                phoneNumber: '0991234567',
            },
        ];
    }
};
exports.CustomersResolver = CustomersResolver;
__decorate([
    (0, graphql_1.Query)(() => [customer_model_1.Customer]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], CustomersResolver.prototype, "getCustomers", null);
exports.CustomersResolver = CustomersResolver = __decorate([
    (0, graphql_1.Resolver)(() => customer_model_1.Customer)
], CustomersResolver);
//# sourceMappingURL=customers.resolver.js.map