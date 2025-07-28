import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';

/* This code snippet is a unit test written using Jest, a popular testing framework for JavaScript and
TypeScript. Here's a breakdown of what it does: */
describe('UsersResolver', () => {
  let resolver: UsersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersResolver],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
