import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto, UpdateReviewDto } from '../../common/dto/reviews/review.dto';
import { FirebaseAuthGuard } from '../../auth/guards/firebase-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Public } from '../../auth/decorators/public.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { FirebaseUser } from '../../auth/firebase-auth.service';
import { UserRole } from '../../auth/guards/roles.guard';

@Controller('api/reviews')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createReviewDto: CreateReviewDto, @CurrentUser() user: FirebaseUser) {
    try {
      const review = await this.reviewsService.create(createReviewDto);
      return {
        success: true,
        message: 'Review created successfully',
        data: review,
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
  async findAll(
    @Query() filters: any,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    try {
      const result = await this.reviewsService.findAll(filters, parseInt(page), parseInt(limit));
      return {
        success: true,
        message: 'Reviews retrieved successfully',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get('product/:productId')
  @Public()
  async findByProduct(
    @Param('productId') productId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    try {
      const result = await this.reviewsService.findByProduct(
        productId,
        parseInt(page),
        parseInt(limit),
      );
      return {
        success: true,
        message: 'Product reviews retrieved successfully',
        data: result,
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
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @CurrentUser() user: FirebaseUser,
  ) {
    try {
      const result = await this.reviewsService.findByCustomer(
        customerId,
        parseInt(page),
        parseInt(limit),
      );
      return {
        success: true,
        message: 'Customer reviews retrieved successfully',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get('pending')
  @Roles(UserRole.ADMIN)
  async getPendingReviews(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    try {
      const result = await this.reviewsService.getPendingReviews(parseInt(page), parseInt(limit));
      return {
        success: true,
        message: 'Pending reviews retrieved successfully',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get('my-reviews')
  async getMyReviews(
    @CurrentUser() user: FirebaseUser,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const review = await this.reviewsService.findOne(id);
      return {
        success: true,
        message: 'Review retrieved successfully',
        data: review,
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
    @Body() updateReviewDto: UpdateReviewDto,
    @CurrentUser() user: FirebaseUser,
  ) {
    try {
      const review = await this.reviewsService.update(id, updateReviewDto);
      return {
        success: true,
        message: 'Review updated successfully',
        data: review,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Patch(':id/approve')
  @Roles(UserRole.ADMIN)
  async approve(@Param('id') id: string) {
    try {
      const review = await this.reviewsService.approve(id);
      return {
        success: true,
        message: 'Review approved successfully',
        data: review,
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
      const result = await this.reviewsService.remove(id);
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
