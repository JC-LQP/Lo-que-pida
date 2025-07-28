import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';

/* This code snippet is a unit test written using the Jest testing framework for a NestJS resolver
called `AuthResolver`. Here's a breakdown of what each part does: */
describe('AuthResolver', () => {
  let resolver: AuthResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthResolver],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
