import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ChargingStation } from 'src/charging-stations/entities/charging-station.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(ChargingStation)
    private readonly chargingStationsRepository: Repository<ChargingStation>,
  ) {}

  async findAll(paginationQuery?: PaginationQueryDto): Promise<Company[]> {
    const { limit, offset } = paginationQuery || {};
    const companies = await this.companyRepository.find({
      relations: {
        charging_stations: true,
      },
      skip: offset,
      take: limit,
    });

    return this.companiesWithChargingStations(companies);
  }

  async findOne(id: number): Promise<Company> {
    const companies = await this.findAll();
    const company = companies.find((c) => c.id === id);

    if (!company) {
      throw new NotFoundException(`Company #${id} not found`);
    }

    return company;
  }

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const company = this.companyRepository.create({
      ...createCompanyDto,
      charging_stations: await this.resolveAllChargingStations(
        createCompanyDto,
      ),
    });

    return this.companyRepository.save(company);
  }

  async update(
    id: number,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    const charging_stations =
      updateCompanyDto.charging_stations &&
      (await this.resolveAllChargingStations(updateCompanyDto));

    const company = await this.companyRepository.preload({
      id,
      ...updateCompanyDto,
      charging_stations,
    });

    if (!company) {
      throw new NotFoundException(`Company #${id} not found`);
    }

    return this.companyRepository.save(company);
  }

  async remove(id: number) {
    const company = await this.findOne(id);
    return this.companyRepository.remove(company);
  }

  private async resolveAllChargingStations(
    actionCompanyDto: CreateCompanyDto | UpdateCompanyDto,
  ): Promise<ChargingStation[]> {
    const chargingStations: ChargingStation[] =
      actionCompanyDto.charging_stations.reduce(
        (chargingStations, chargingStation) => {
          const station = this.preloadChargingStation(chargingStation);
          chargingStations.push(station);

          return chargingStations;
        },
        [],
      );

    return await Promise.all(chargingStations);
  }

  private async preloadChargingStation(
    chargingStation: ChargingStation,
  ): Promise<ChargingStation> {
    const existingChargingStation =
      await this.chargingStationsRepository.findOne({
        where: { name: chargingStation.name },
      });

    if (existingChargingStation) {
      return existingChargingStation;
    }

    return this.chargingStationsRepository.create({ ...chargingStation });
  }

  private companiesWithChargingStations(companies: Company[]): Company[] {
    const procesed = new Map();
    const companiesWithChargingStations = new Map();

    companies.forEach((company) => {
      companiesWithChargingStations.set(company.id, company);
    });

    const childrenChargingStations = (company, parents = new Set()) => {
      if (procesed.get(company.id)) return;

      // The time complexity of this function is O(n) where n is the number of companies
      const children = companies.filter(
        (c) => c.parentId === company.id && c.id !== c.parentId,
      );

      if (children.length === 0) return;

      // The time complexity of this function is O(1) on average
      parents.add(company.id);

      // The time complexity of this operation is O(1)
      // since it's accessing an array element by index
      const nextChild = children[0];
      if (!nextChild) return;

      // The time complexity of this operation is O(k),
      // where k is the total number of charging stations across all children
      const mappedChildren = children.flatMap((c) => c.charging_stations);

      // The time complexity of this loop is O(p),
      // where p is the number of parents in the set
      parents.forEach((parent) => {
        procesed.set(company.id, true);

        const getCompany = companiesWithChargingStations.get(parent);

        companiesWithChargingStations.set(parent, {
          ...getCompany,
          charging_stations: [
            ...getCompany.charging_stations,
            ...mappedChildren,
          ],
        });
      });

      return childrenChargingStations(nextChild, parents);
    };

    companies.forEach((company) => childrenChargingStations(company));

    return Array.from(companiesWithChargingStations.values());
  }
}
