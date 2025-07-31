import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User, UserRole } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UseGuards } from '@nestjs/common';
import { GqlFirebaseAuthGuard } from 'src/auth/guards/gql-firebase-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Seller } from '../sellers/entities/seller.entity';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  @UseGuards(GqlFirebaseAuthGuard)
  findAll(@CurrentUser() user: any) {
    console.log('Current User:', user);
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.usersService.findOne(id);
  }

  @Query(() => User, { name: 'me' })
  @UseGuards(GqlFirebaseAuthGuard)
  async me(@CurrentUser() user: any): Promise<User> {
    // The user object from Firebase contains the uid
    // We need to find the user in our database by firebaseUid
    const dbUser = await this.usersService.findByFirebaseUid(user.uid);
    if (!dbUser) {
      // If user doesn't exist in database, create them using Firebase data
      return this.usersService.validateOrCreateUser(user);
    }
    return dbUser;
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => String }) id: string) {
    return this.usersService.remove(id);
  }

  @ResolveField(() => Seller, { nullable: true })
  async seller(@Parent() user: User): Promise<Seller | null> {
    // Only users with SELLER role can have a seller profile
    if (user.role !== UserRole.SELLER) {
      return null;
    }
    
    // Find the seller profile associated with this user
    return this.usersService.findSellerByUserId(user.id);
  }
}
