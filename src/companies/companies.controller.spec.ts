import { Test, TestingModule } from '@nestjs/testing';

import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';

describe('CompaniesController', () => {
  let companiesController: CompaniesController;
  let companiesService: CompaniesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompaniesController],
      providers: [CompaniesService],
    }).compile();

    companiesController = module.get<CompaniesController>(CompaniesController);
    companiesService = module.get<CompaniesService>(CompaniesService);
  });

  it('should be defined', () => {
    expect(companiesController).toBeDefined();
  });

  describe('CRUD operations', () => {
    it('should return an array of companies', async () => {
      const companies = [
        {
          id: 1,
          name: 'Company 1',
          parent_company_id: 0,
          children: [],
          charging_stations: [],
        },
      ];

      jest
        .spyOn(companiesService, 'findAll')
        .mockImplementation(() => companies);

      const limit = 20;
      const offset = 10;

      const response = await companiesController.findAll({ limit, offset });
      expect(response).toBe(companies);
    });

    it('should return a company', async () => {
      const company = {
        id: 1,
        name: 'Company 1',
        parent_company_id: 0,
        children: [],
        charging_stations: [],
      };

      jest.spyOn(companiesService, 'findOne').mockImplementation(() => company);

      const response = await companiesController.findOne('1');
      expect(response).toBe(company);
    });

    it('should create a company', async () => {
      const company = {
        id: 1,
        name: 'Company 1',
        parent_company_id: 0,
        children: [],
        charging_stations: [],
      };

      jest.spyOn(companiesService, 'create').mockImplementation(() => company);

      const body = {
        name: 'Company 1',
        parent_company_id: 0,
      };

      const response = await companiesController.create(body);
      expect(response).toBe(company);
    });

    it('should update a company', async () => {
      const company = {
        id: 1,
        name: 'Company 1',
        parent_company_id: 0,
        children: [],
        charging_stations: [],
      };

      jest.spyOn(companiesService, 'update').mockImplementation(() => company);

      const body = {
        name: 'Company 1',
        parent_company_id: 0,
      };

      const response = await companiesController.update('1', body);
      expect(response).toBe(company);
    });

    it('should delete a company', async () => {
      const company = {
        id: 1,
        name: 'Company 1',
        parent_company_id: 0,
        children: [],
        charging_stations: [],
      };

      jest.spyOn(companiesService, 'remove').mockImplementation(() => company);

      const response = await companiesController.remove('1');
      expect(response).toBe(company);
    });
  });
});
