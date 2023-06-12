import { Test, TestingModule } from '@nestjs/testing';

import { DataService } from 'src/common/repository/data-service';
import { expectNotFoundException } from 'test/utils/expect.exception';
import {
  createMockRepository,
  spyOnChargingStationsService,
  spyOnCompaniesService,
} from 'test/utils/mock.repositoy';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

describe('CompaniesService', () => {
  let service: CompaniesService;
  let dataService: DataService;

  const companyId = 1;

  const expectedCompany = {
    id: 1,
    name: 'Company 1',
    parentId: 0,
    charging_stations: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: DataService,
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
    dataService = module.get<DataService>(DataService);
  });

  let spyOnCompanies;
  let spyOnChargingStations;
  beforeEach(() => {
    spyOnCompanies = spyOnCompaniesService(dataService);
    spyOnChargingStations = spyOnChargingStationsService(dataService);
  });

  describe('findAll /', () => {
    it('should return an array of companies', async () => {
      const expectedCompanies = [expectedCompany];

      spyOnCompanies({
        methodName: 'findAll',
        value: expectedCompanies,
      });

      const company = await service.findAll();
      expect(company).toBe(expectedCompanies);
    });
  });

  describe('findOne /', () => {
    describe('when company with ID exists', () => {
      it('should return the company object', async () => {
        spyOnCompanies({
          methodName: 'findOne',
          value: expectedCompany,
        });

        const company = await service.findOne(companyId);
        expect(company).toBe(expectedCompany);
      });
    });

    describe('otherwise', () => {
      it('should throw the "NotFoundException"', async () => {
        await expectNotFoundException(
          () => service.findOne(companyId),
          1,
          `Company #${companyId} not found`,
        );
      });
    });
  });

  describe('create /', () => {
    it('should create a company', async () => {
      const createCompanyDto: CreateCompanyDto = {
        name: 'Company 1',
        parentId: 0,
      };

      spyOnCompanies({
        methodName: 'save',
        value: expectedCompany,
      });

      const company = await service.create(createCompanyDto);
      expect(company).toBe(expectedCompany);
    });
  });

  describe('update /', () => {
    describe('when company with ID exists', () => {
      it('should update the company object', async () => {
        const updateCompanyDto: UpdateCompanyDto = {
          name: 'Company 1',
          parentId: 0,
        };

        spyOnCompanies({
          methodName: 'findOne',
          value: expectedCompany,
        });

        spyOnCompanies({
          methodName: 'save',
          value: expectedCompany,
        });

        spyOnCompanies({
          methodName: 'preload',
          value: expectedCompany,
        });

        const company = await service.update(companyId, updateCompanyDto);
        expect(company).toBe(expectedCompany);
      });
    });

    describe('otherwise', () => {
      it('should throw the "NotFoundException"', async () => {
        const companyId = 1;
        const updateCompanyDto: CreateCompanyDto = {
          name: 'Company 1',
          parentId: 0,
        };

        await expectNotFoundException(
          () => service.update(companyId, updateCompanyDto),
          1,
          `Company #${companyId} not found`,
        );
      });
    });
  });

  describe('remove /', () => {
    describe('when company with ID exists', () => {
      it('should remove the company object', async () => {
        spyOnCompanies({
          methodName: 'findOne',
          value: expectedCompany,
        });

        spyOnCompanies({
          methodName: 'remove',
          value: expectedCompany,
        });

        const company = await service.remove(companyId);

        expect(company).toBe(expectedCompany);
      });
    });

    describe('otherwise', () => {
      it('should throw the "NotFoundException"', async () => {
        const companyId = 1;

        spyOnCompanies({
          methodName: 'findOne',
          value: undefined,
        });

        await expectNotFoundException(
          () => service.remove(companyId),
          1,
          `Company #${companyId} not found`,
        );
      });
    });
  });
});
