import { PostgresGenericRepository } from './postgres-generic-repository';

describe('PostgresGenericRepository', () => {
  it('should be defined', () => {
    expect(new PostgresGenericRepository()).toBeDefined();
  });
});
