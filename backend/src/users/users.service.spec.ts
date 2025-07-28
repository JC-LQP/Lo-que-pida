import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

/* This code snippet is a unit test written using Jest, a popular testing framework for JavaScript and
TypeScript. */
describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
