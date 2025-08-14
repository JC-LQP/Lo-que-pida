import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase/firebase.module';
import { SupabaseModule } from './supabase/supabase.module';
import { PrismaModule } from './prisma/prisma.module';
import { TestModule } from './test/test.module';
import { DatabaseExplorerModule } from './database-explorer/database-explorer.module';
import { AuthModule } from './auth/auth.module';
import { ExampleEcommerceController } from './example-ecommerce.controller';

// Production API Modules
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { AddressesModule } from './modules/addresses/addresses.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { CustomersModule } from './modules/customers/customers.module';
import { SellersModule } from './modules/sellers/sellers.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { WarehousesModule } from './modules/warehouses/warehouses.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { ShippingInfoModule } from './modules/shipping-info/shipping-info.module';
import { CartItemsModule } from './modules/cart-items/cart-items.module';
import { CartsModule } from './modules/carts/carts.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { BestBuyModule } from './modules/bestbuy/bestbuy.module';

// Note: Database configuration loaded via ConfigModule

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    FirebaseModule,
    SupabaseModule,
    TestModule,
    DatabaseExplorerModule,
    AuthModule,
    
    // Production API Modules
    UsersModule,
    ProductsModule,
    AddressesModule,
    OrdersModule,
    ReviewsModule,
    CustomersModule,
    SellersModule,
    PaymentsModule,
    InventoryModule,
    WarehousesModule,
    SubscriptionsModule,
    ShippingInfoModule,
    CartItemsModule,
    CartsModule,
    CategoriesModule,
    BestBuyModule,
  ],
  controllers: [
    AppController,
    ExampleEcommerceController,
  ],
  providers: [
    AppService,
  ],
})
export class AppModule {}
