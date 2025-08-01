"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const graphql_1 = require("@nestjs/graphql");
const apollo_1 = require("@nestjs/apollo");
const path_1 = require("path");
const users_module_1 = require("./users/users.module");
const sellers_module_1 = require("./sellers/sellers.module");
const customers_module_1 = require("./customers/customers.module");
const products_module_1 = require("./products/products.module");
const orders_module_1 = require("./orders/orders.module");
const payments_module_1 = require("./payments/payments.module");
const subscriptions_module_1 = require("./subscriptions/subscriptions.module");
const warehouses_module_1 = require("./warehouses/warehouses.module");
const carts_module_1 = require("./carts/carts.module");
const product_reviews_module_1 = require("./product_reviews/product-reviews.module");
const addresses_module_1 = require("./addresses/addresses.module");
const auth_module_1 = require("./auth/auth.module");
const firebase_module_1 = require("./firebase/firebase.module");
const inventory_module_1 = require("./inventory/inventory.module");
const categories_module_1 = require("./categories/categories.module");
const shipping_info_module_1 = require("./shipping-info/shipping-info.module");
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            firebase_module_1.FirebaseModule,
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT ?? '5433', 10),
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                schema: process.env.DB_SCHEMA,
                autoLoadEntities: true,
                synchronize: true,
                logging: ['error', 'warn'],
            }),
            graphql_1.GraphQLModule.forRoot({
                driver: apollo_1.ApolloDriver,
                autoSchemaFile: (0, path_1.join)(process.cwd(), 'src/schema.gql'),
                playground: true,
                debug: true,
                sortSchema: true,
                context: ({ req }) => ({ req }),
            }),
            users_module_1.UsersModule,
            sellers_module_1.SellersModule,
            customers_module_1.CustomersModule,
            products_module_1.ProductsModule,
            orders_module_1.OrdersModule,
            payments_module_1.PaymentsModule,
            subscriptions_module_1.SubscriptionsModule,
            warehouses_module_1.WarehouseModule,
            carts_module_1.CartsModule,
            product_reviews_module_1.ProductReviewsModule,
            addresses_module_1.AddressesModule,
            auth_module_1.AuthModule,
            inventory_module_1.InventoryModule,
            categories_module_1.CategoriesModule,
            shipping_info_module_1.ShippingInfoModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map