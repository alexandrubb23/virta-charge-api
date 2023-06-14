import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { DataService } from 'src/common/repository/data-service';
import { CompaniesService } from 'src/companies/companies.service';
import { expectNotFoundException } from 'test/utils/expect.exception';
import {
  createMockRepository,
  spyOnChargingStationsService,
  spyOnCompaniesService,
} from 'test/utils/mock.repositoy';
import { ChargingStationsService } from './charging-stations.service';
import { ChargingStation } from './entities/charging-station.entity';

describe('ChargingStationsService', () => {
  let service: ChargingStationsService;
  let dataService: DataService;

  const charginStationsId = 1;
  const expectedChargingStation: ChargingStation = {
    id: 1,
    name: 'Charging Station 1',
    address: 'Address 1',
    latitude: 1,
    longitude: 1,
    company_id: 1,
  } as ChargingStation;

  const expectedCompany = {
    id: 1,
    name: 'Company 1',
    parentId: 0,
    charging_stations: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChargingStationsService,
        {
          provide: DataService,
          useValue: createMockRepository(),
        },
        {
          provide: DataSource,
          useValue: {
            createQueryBuilder: jest.fn().mockReturnThis(),
            update: jest.fn().mockReturnThis(),
            set: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            execute: jest.fn().mockReturnThis(),
          },
        },
        {
          provide: CompaniesService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(expectedCompany),
          },
        },
      ],
    }).compile();

    service = module.get<ChargingStationsService>(ChargingStationsService);
    dataService = module.get<DataService>(DataService);
  });

  let spyOnCompanies;
  let spyOnChargingStations;
  beforeEach(() => {
    spyOnCompanies = spyOnCompaniesService(dataService);
    spyOnChargingStations = spyOnChargingStationsService(dataService);
  });

  describe('findAll /', () => {
    it('should return an array of charging stations', async () => {
      const expectedChargingStations: ChargingStation[] = [
        expectedChargingStation,
      ];

      spyOnChargingStations({
        methodName: 'findAll',
        value: expectedChargingStations,
      });

      const chargingStation = await service.findAll();
      expect(chargingStation).toEqual(expectedChargingStations);
    });
  });

  describe('findOne /', () => {
    describe('when charging station with ID exists', () => {
      it('should return the charging station object', async () => {
        spyOnChargingStations({
          methodName: 'findOne',
          value: expectedChargingStation,
        });

        const chargingStation = await service.findOne(charginStationsId);
        expect(chargingStation).toEqual(expectedChargingStation);
      });
    });

    describe('otherwise', () => {
      it('should throw the "NotFoundException"', async () => {
        spyOnChargingStations({
          methodName: 'findOne',
          value: undefined,
        });

        await expectNotFoundException(
          () => service.findOne(charginStationsId),
          charginStationsId,
        );
      });
    });
  });

  describe('findNearbyChargingStations /', () => {
    it('should return an array of charging stations', async () => {
      const expectedChargingStations: ChargingStation[] = [
        expectedChargingStation,
      ];

      spyOnChargingStations({
        methodName: 'findNearbyChargingStations',
        value: expectedChargingStations,
      });

      const chargingStation = await service.findNearbyChargingStations({
        latitude: 1,
        longitude: 1,
        radius: 1,
        company_id: 0,
      });

      expect(chargingStation).toEqual(expectedChargingStations);
    });
  });

  describe('create /', () => {
    it.todo('should return the created charging station object');
  });

  describe('update /', () => {
    describe('when charging station with ID exists', () => {
      it('should return the updated charging station object', async () => {
        const chargingStationsMethods = ['findOne', 'save', 'update'];

        chargingStationsMethods.forEach((methodName) => {
          spyOnChargingStations({
            methodName,
            value: expectedChargingStation,
          });
        });

        const chargingStation = await service.update(
          charginStationsId,
          expectedChargingStation,
        );

        expect(chargingStation).toEqual(expectedChargingStation);
      });
    });

    describe('otherwise', () => {
      it('should throw the "NotFoundException"', async () => {
        spyOnChargingStations({
          methodName: 'findOne',
          value: undefined,
        });

        await expectNotFoundException(
          () => service.update(charginStationsId, expectedChargingStation),
          charginStationsId,
        );
      });
    });
  });

  describe('remove /', () => {
    describe('when charging station with ID exists', () => {
      it('should return the removed charging station object', async () => {
        spyOnChargingStations({
          methodName: 'findOne',
          value: expectedChargingStation,
        });

        spyOnChargingStations({
          methodName: 'remove',
          value: expectedChargingStation,
        });

        const chargingStation = await service.remove(charginStationsId);

        expect(chargingStation).toEqual(expectedChargingStation);
      });
    });

    describe('otherwise', () => {
      it('should throw the "NotFoundException"', async () => {
        spyOnChargingStations({
          methodName: 'findOne',
          value: undefined,
        });

        await expectNotFoundException(
          () => service.remove(charginStationsId),
          charginStationsId,
        );
      });
    });
  });
});
