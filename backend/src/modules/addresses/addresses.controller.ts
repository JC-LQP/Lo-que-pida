import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto, UpdateAddressDto } from '../../common/dto/addresses/address.dto';
import { FirebaseAuthGuard } from '../../auth/guards/firebase-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { FirebaseUser } from '../../auth/firebase-auth.service';
import { UserRole } from '../../auth/guards/roles.guard';

@Controller('api/addresses')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAddressDto: CreateAddressDto, @CurrentUser() user: FirebaseUser) {
    try {
      const address = await this.addressesService.create(createAddressDto);
      return {
        success: true,
        message: 'Address created successfully',
        data: address,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll(@Query('customerId') customerId?: string) {
    try {
      const addresses = await this.addressesService.findAll(customerId);
      return {
        success: true,
        message: 'Addresses retrieved successfully',
        data: addresses,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get('my-addresses')
  async getMyAddresses(@CurrentUser() user: FirebaseUser) {
    try {
      // This would need to get the customer ID from the user
      return {
        success: false,
        message: 'Customer ID resolution needed',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get('customer/:customerId')
  async findByCustomer(
    @Param('customerId') customerId: string,
    @CurrentUser() user: FirebaseUser,
  ) {
    try {
      const addresses = await this.addressesService.findByCustomer(customerId);
      return {
        success: true,
        message: 'Customer addresses retrieved successfully',
        data: addresses,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get('customer/:customerId/default')
  async getDefaultAddress(
    @Param('customerId') customerId: string,
    @CurrentUser() user: FirebaseUser,
  ) {
    try {
      const address = await this.addressesService.getDefaultAddress(customerId);
      return {
        success: true,
        message: address ? 'Default address retrieved successfully' : 'No default address found',
        data: address,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get('stats')
  @Roles(UserRole.ADMIN)
  async getAddressStats(@Query('customerId') customerId?: string) {
    try {
      const stats = await this.addressesService.getAddressStats(customerId);
      return {
        success: true,
        message: 'Address statistics retrieved successfully',
        data: stats,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: FirebaseUser) {
    try {
      const address = await this.addressesService.findOne(id);
      return {
        success: true,
        message: 'Address retrieved successfully',
        data: address,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
    @CurrentUser() user: FirebaseUser,
  ) {
    try {
      const address = await this.addressesService.update(id, updateAddressDto);
      return {
        success: true,
        message: 'Address updated successfully',
        data: address,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Patch(':id/set-default')
  async setAsDefault(@Param('id') id: string, @CurrentUser() user: FirebaseUser) {
    try {
      const address = await this.addressesService.setAsDefault(id);
      return {
        success: true,
        message: 'Address set as default successfully',
        data: address,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Post('validate')
  async validateAddress(@Body() addressData: any, @CurrentUser() user: FirebaseUser) {
    try {
      await this.addressesService.validateAddress(addressData);
      return {
        success: true,
        message: 'Address is valid',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string, @CurrentUser() user: FirebaseUser) {
    try {
      const result = await this.addressesService.remove(id);
      return {
        success: true,
        message: result.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
