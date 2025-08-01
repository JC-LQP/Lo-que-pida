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
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  async create(input: CreateProductReviewInput): Promise<ProductReview> {
    // Validate that the user exists
    const user = await this.userRepo.findOne({ where: { id: input.userId } });
    if (!user) {
      throw new NotFoundException(`User with ID "${input.userId}" not found`);
    }

    // Validate that the product exists
    const product = await this.productRepo.findOne({ where: { id: input.productId } });
    if (!product) {
      throw new NotFoundException(`Product with ID "${input.productId}" not found`);
    }

    const review = this.reviewRepo.create({
      ...input,
      user,
      product,
    });
    
    const savedReview = await this.reviewRepo.save(review);
    
    // Return with relations loaded
    const reviewWithRelations = await this.reviewRepo.findOne({
      where: { id: savedReview.id },
      relations: ['user', 'product'],
    });
    
    if (!reviewWithRelations) {
      throw new NotFoundException(`Review with ID "${savedReview.id}" not found after creation`);
    }
    
    return reviewWithRelations;
  }

  findAll(): Promise<ProductReview[]> {
    return this.reviewRepo.find({ relations: ['user', 'product'] });
  }

  async findOne(id: string): Promise<ProductReview> {
    const review = await this.reviewRepo.findOne({
      where: { id },
      relations: ['user', 'product'],
    });
    if (!review) {
      throw new NotFoundException(`Review #${id} not found`);
    }
    return review;
  }

  async update(id: string, input: UpdateProductReviewInput): Promise<ProductReview> {
    const review = await this.reviewRepo.preload(input);
    if (!review) throw new NotFoundException(`Review #${id} not found`);
    return this.reviewRepo.save(review);
  }

  async remove(id: string): Promise<ProductReview> {
    const review = await this.findOne(id);
    return this.reviewRepo.remove(review);
  }
}
