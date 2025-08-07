import { IsString, IsOptional, IsUUID, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAddressDto {
  @IsString()
  recipientName: string;

  @IsString()
  streetAddress: string;

  @IsString()
  city: string;

  @IsString()
  province: string;

  @IsString()
  country: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @IsUUID()
  customerId: string;
}

export class UpdateAddressDto {
  @IsString()
  @IsOptional()
  recipientName?: string;

  @IsString()
  @IsOptional()
  streetAddress?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  province?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}

export class AddressResponseDto {
  id: string;
  recipientName: string;
  streetAddress: string;
  city: string;
  province: string;
  country: string;
  postalCode?: string;
  phoneNumber?: string;
  isDefault: boolean;
  customerId: string;
  
  @Type(() => Date)
  created_at: Date;
  
  @Type(() => Date)
  updated_at: Date;

  // Related data
  customer?: {
    id: string;
    firstName?: string;
    lastName?: string;
  };

  // Computed fields
  fullAddress: string;
  formattedAddress: string;
}

export class AddressListResponseDto {
  addresses: AddressResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class AddressFilterDto {
  @IsUUID()
  @IsOptional()
  customerId?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  province?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  sortBy?: string;

  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC';
}

export class SetDefaultAddressDto {
  @IsUUID()
  addressId: string;
}
