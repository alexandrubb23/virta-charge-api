import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesController } from './companies.controller';

describe('CompaniesController', () => {
  let controller: CompaniesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompaniesController],
    }).compile();

    controller = module.get<CompaniesController>(CompaniesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('CRUD operations', () => {
    it('should return all companies', () => {
      expect(controller.findAll()).toBe('This action returns all companies');
    });

    it('should return a company', () => {
      expect(controller.findOne('1')).toBe('This action returns a #1 company');
    });

    it('should create a company', () => {
      const body = {
        name: 'Company 1',
        parent_company_id: 0,
      };

      expect(controller.create(body)).toEqual(body);
    });

    it('should update a company', () => {
      const body = {
        name: 'Company 1',
        parent_company_id: 0,
      };

      expect(controller.update('1', body)).toBe(
        'This action updates a #1 company',
      );
    });

    it('should delete a company', () => {
      expect(controller.remove('1')).toBe('This action removes a #1 company');
    });
  });
});
