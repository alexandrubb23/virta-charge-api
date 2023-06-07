import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ChargingStation } from './entities/charging-station.entity';
import { Company } from './entities/company.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(ChargingStation)
    private readonly chargingStationsRepository: Repository<ChargingStation>,
  ) {}

  async findAll(): Promise<Company[]> {
    const companies = await this.companyRepository.find({
      relations: {
        charging_stations: true,
      },
    });

    companies.forEach((company) => {
      const parentIds = [];

      let parent = company;
      while (parent.parentId !== 0) {
        parentIds.unshift(parent.parentId);
        parent = companies.find((c) => c.id === parent.parentId);
      }

      parentIds.forEach((parentId) => {
        const parentCompany = companies.find((c) => c.id === parentId);
        const index = companies.indexOf(parentCompany);

        companies[index] = {
          ...parentCompany,
          charging_stations: [
            ...parentCompany.charging_stations,
            ...company.charging_stations,
          ],
        };
      });
    });

    return companies;
  }

  async findOne(id: number): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: {
        charging_stations: true,
      },
    });

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

  private withChargingStations(companies: Company[]) {
    // The current algorithm has a time complexity of O(n^2)
    // TODO: Improve the algorithm to have a time complexity of O(n)
    return companies.forEach((company) => {
      const parentIds = [];

      let parent = company;
      while (parent.parentId !== 0) {
        parentIds.unshift(parent.parentId);
        parent = companies.find((c) => c.id === parent.parentId);
      }

      parentIds.forEach((parentId) => {
        const parentCompany = companies.find((c) => c.id === parentId);
        const index = companies.indexOf(parentCompany);

        companies[index] = {
          ...parentCompany,
          charging_stations: [
            ...parentCompany.charging_stations,
            ...company.charging_stations,
          ],
        };
      });
    }, []);
  }
}
