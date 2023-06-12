import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ChargingStation } from 'src/charging-stations/entities/charging-station.entity';
import { CompaniesService } from './companies.service';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { DataService } from 'src/common/repository/data-service';
import { GenericRepository } from 'src/common/repository/generic-repository';
import { UpdateCompanyDto } from './dto/update-company.dto';

const createMockGenericRepository = <T = any>(): GenericRepository<T> =>
  ({
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
    remove: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    findNearbyChargingStations: jest.fn(),
  } as unknown as GenericRepository<T>);

const createMockRepository = (): DataService => ({
  companies: createMockGenericRepository<Company>(),
  chargingStations: createMockGenericRepository<ChargingStation>(),
});

type SpyOn = {
  methodName: keyof DataService['companies'];
  value: Company | Company[];
};

describe('CompaniesService', () => {
  let service: CompaniesService;
  let dataService: DataService;

  const spyOnCompaniesServiceMethod = ({ methodName, value }: SpyOn) => {
    jest.spyOn(dataService.companies, methodName).mockResolvedValue(value);
  };

  const expectNotFoundException = async (
    action: () => Promise<any>,
    companyId: number,
  ) => {
    try {
      await action();
      expect(false).toBeTruthy(); // we should not get here
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toEqual(`Company #${companyId} not found`);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: DataService,
          useValue: createMockRepository() as jest.Mocked<DataService>,
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
    dataService = module.get<DataService>(DataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll /', () => {
    it('should return an array of companies', async () => {
      const expectedCompanies = [
        {
          id: 1,
          name: 'Company 1',
          parentId: 0,
          charging_stations: [],
        },
      ];

      spyOnCompaniesServiceMethod({
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
        const companyId = 1;
        const expectedCompany = {
          id: 1,
          name: 'Company 1',
          parentId: 0,
          charging_stations: [],
        };

        spyOnCompaniesServiceMethod({
          methodName: 'findOne',
          value: expectedCompany,
        });

        const company = await service.findOne(companyId);
        expect(company).toBe(expectedCompany);
      });
    });

    describe('otherwise', () => {
      it('should throw the "NotFoundException"', async () => {
        const companyId = 1;

        expect(() => service.findOne(companyId)).rejects.toThrowError(
          `Company #${companyId} not found`,
        );

        await expectNotFoundException(() => service.findOne(companyId), 1);
      });
    });
  });

  describe('create /', () => {
    it('should create a company', async () => {
      const createCompanyDto: CreateCompanyDto = {
        name: 'Company 1',
        parentId: 0,
      };

      const expectedCompany = {
        id: 1,
        name: 'Company 1',
        parentId: 0,
        charging_stations: [],
      };

      spyOnCompaniesServiceMethod({
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
        const companyId = 1;
        const updateCompanyDto: UpdateCompanyDto = {
          name: 'Company 1',
          parentId: 0,
        };

        const expectedCompany = {
          id: 1,
          name: 'Company 1',
          parentId: 0,
          charging_stations: [],
        };

        spyOnCompaniesServiceMethod({
          methodName: 'findOne',
          value: expectedCompany,
        });

        spyOnCompaniesServiceMethod({
          methodName: 'save',
          value: expectedCompany,
        });

        spyOnCompaniesServiceMethod({
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
        );
      });
    });
  });

  describe('remove /', () => {
    describe('when company with ID exists', () => {
      it('should remove the company object', async () => {
        const companyId = 1;

        const expectedCompany = {
          id: 1,
          name: 'Company 1',
          parentId: 0,
          charging_stations: [],
        };

        spyOnCompaniesServiceMethod({
          methodName: 'findOne',
          value: expectedCompany,
        });

        spyOnCompaniesServiceMethod({
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

        spyOnCompaniesServiceMethod({
          methodName: 'findOne',
          value: undefined,
        });

        await expectNotFoundException(() => service.remove(companyId), 1);
      });
    });
  });
});
