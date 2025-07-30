import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductReview } from './entities/product-review.entity';
import { CreateProductReviewInput } from './dto/create-product-review.input';
import { UpdateProductReviewInput } from './dto/update-product-review.input';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class ProductReviewsService {
  constructor(
    @InjectRepository(ProductReview)
    private reviewRepo: Repository<ProductReview>,
  ) {}

  create(input: CreateProductReviewInput): Promise<ProductReview> {
    const review = this.reviewRepo.create({
      ...input,
      user: { id: input.userId } as User,
      product: { id: input.productId } as Product,
    });
    return this.reviewRepo.save(review);
  }

  findAll(): Promise<ProductReview[]> {
    return this.reviewRepo.find({ relations: ['user', 'product'] });
  }

  findOne(id: string): Promise<ProductReview> {
    return this.reviewRepo.findOne({
      where: { id },
      relations: ['user', 'product'],
    });
  }

  async update(id: string, input: UpdateProductReviewInput): Promise<ProductReview> {
    const review = await this.reviewRepo.preload({ id, ...input });
    if (!review) throw new NotFoundException(`Review #${id} not found`);
    return this.reviewRepo.save(review);
  }

  async remove(id: string): Promise<ProductReview> {
    const review = await this.findOne(id);
    return this.reviewRepo.remove(review);
  }
}
