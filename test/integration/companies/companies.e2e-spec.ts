import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { APP_GUARD } from '@nestjs/core';

import { ApiKeyGuard } from 'src/common/guards/api-key/api-key.guard';
import { CompaniesModule } from 'src/companies/companies.module';
import { isProduction } from 'src/utils/environment';
import { databaseSchema } from 'src/validation';
import SuperTestService from 'test/services/super-test.service';

describe('[Feature] Companies - /companies', () => {
  let company = {
    name: 'a',
    parentId: '0',
  };

  const expectedCompany = {
    id: 1,
    name: 'new name',
    parentId: 0,
    charging_stations: [],
  };

  let app: INestApplication;
  let superTestService: SuperTestService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
          validationSchema: databaseSchema,
        }),
        CompaniesModule,
      ],
      providers: [
        {
          provide: APP_GUARD,
          useClass: ApiKeyGuard,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    await app.init();

    superTestService = new SuperTestService(app, 'companies');
  });

  afterAll(async () => {
    await app.close();
  });

  let originalCompany: any;
  beforeEach(() => {
    originalCompany = { ...company };
  });

  afterEach(() => {
    company = { ...originalCompany };
  });

  beforeEach(() => {
    superTestService.setToken(process.env.API_KEY);
  });

  describe('POST /', () => {
    it('should return 403 forbidden if no token is provided', async () => {
      superTestService.setToken('');

      const res = await superTestService.create(company);

      expect(res.status).toBe(HttpStatus.FORBIDDEN);
      expect(res.body.message).toEqual('Forbidden resource');
    });

    it('should return 400 if an unexpected property is added in the payload', async () => {
      const property = 'unexpectedProperty';
      company[property] = true;

      const res = await superTestService.create(company);

      expect(res.status).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body.message[0]).toEqual(
        `property ${property} should not exist`,
      );
    });

    it('should return 400 if name is not provided', async () => {
      delete company.name;

      const res = await superTestService.create(company);

      expect(res.status).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body.message[0]).toEqual('name must be a string');
      expect(res.body.message[1]).toEqual('name should not be empty');
    });

    it('should return 400 if name is empty', async () => {
      company.name = '';

      const res = await superTestService.create(company);

      expect(res.status).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body.message[0]).toEqual('name should not be empty');
    });

    it('should return 400 if parentId is not provided', async () => {
      delete company.parentId;

      const res = await superTestService.create(company);

      expect(res.status).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body.message[0]).toEqual(
        'parentId must be a number conforming to the specified constraints',
      );
      expect(res.body.message[1]).toEqual(
        'parentId must be a positive number or zero',
      );
    });

    it('should return 400 if parentId is not a number', async () => {
      company.parentId = 'a';

      const res = await superTestService.create(company);

      expect(res.status).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body.message[0]).toEqual(
        'parentId must be a number conforming to the specified constraints',
      );
      expect(res.body.message[1]).toEqual(
        'parentId must be a positive number or zero',
      );
    });

    it('should return 400 if parentId is not a possitive number', async () => {
      company.parentId = '-1';

      const res = await superTestService.create(company);

      expect(res.status).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body.message[0]).toEqual(
        'parentId must be a positive number or zero',
      );
    });

    it('should return 201 if the company is created', async () => {
      const res = await superTestService.create(company);

      expect(res.status).toBe(HttpStatus.CREATED);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', company.name);
      expect(res.body).toHaveProperty(
        'parentId',
        parseInt(company.parentId, 10),
      );
    });
  });

  describe('PATCH /:id', () => {
    it('should return 403 forbidden if no token is provided', async () => {
      superTestService.setToken('');

      const res = await superTestService.update(1, company);

      expect(res.status).toBe(HttpStatus.FORBIDDEN);
      expect(res.body.message).toEqual('Forbidden resource');
    });

    it('should return 400 if an unexpected property is added in the payload', async () => {
      const property = 'unexpectedProperty';
      company[property] = true;

      const res = await superTestService.update(1, company);

      expect(res.status).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body.message[0]).toEqual(
        `property ${property} should not exist`,
      );
    });

    it('should return 400 if no payload is provided', async () => {
      company = {} as any;
      const res = await superTestService.update(1, company);

      expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res.body.message).toEqual('No fields to update were provided');
    });

    it('should return 400 if name is empty', async () => {
      company.name = '';

      const res = await superTestService.update(1, company);

      expect(res.status).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body.message[0]).toEqual('name should not be empty');
    });

    it('should return 400 if parentId is not a number', async () => {
      company.parentId = 'a';

      const res = await superTestService.update(1, company);

      expect(res.status).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body.message[0]).toEqual(
        'parentId must be a number conforming to the specified constraints',
      );
      expect(res.body.message[1]).toEqual(
        'parentId must be a positive number or zero',
      );
    });

    it('should return 400 if parentId is not a possitive number', async () => {
      company.parentId = '-1';

      const res = await superTestService.update(1, company);

      expect(res.status).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body.message[0]).toEqual(
        'parentId must be a positive number or zero',
      );
    });

    it('should return 200 if the company is updated', async () => {
      company.name = 'new name';
      const res = await superTestService.update(1, company);

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', 'new name');
      expect(res.body).toHaveProperty(
        'parentId',
        parseInt(company.parentId, 10),
      );
    });
  });

  describe('GET /', () => {
    it('should return all companies', async () => {
      const res = await superTestService.findAll();

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toEqual(
        expect.arrayContaining([expect.objectContaining(expectedCompany)]),
      );
    });
  });

  describe('GET /:id', () => {
    it('should return 404 if the company is not found', async () => {
      const companyId = 100;
      const res = await superTestService.findOne(companyId);

      expect(res.status).toBe(HttpStatus.NOT_FOUND);
      expect(res.body.message).toEqual(`Company #${companyId} not found`);
    });

    it('should return the company', async () => {
      const companyId = 1;

      const res = await superTestService.findOne(companyId);

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toEqual(expect.objectContaining(expectedCompany));
    });
  });

  describe('DELETE /:id', () => {
    it('should return 403 forbidden if no token is provided', async () => {
      superTestService.setToken('');

      const res = await superTestService.delete(1);

      expect(res.status).toBe(HttpStatus.FORBIDDEN);
      expect(res.body.message).toEqual('Forbidden resource');
    });

    it('should return 404 if the company is not found', async () => {
      const companyId = 100;
      const res = await superTestService.delete(companyId);

      expect(res.status).toBe(HttpStatus.NOT_FOUND);
      expect(res.body.message).toEqual(`Company #${companyId} not found`);
    });

    it('should return 200 if the company is deleted', async () => {
      delete expectedCompany.id;

      const res = await superTestService.delete(1);

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toEqual(expect.objectContaining(expectedCompany));
    });
  });
});
