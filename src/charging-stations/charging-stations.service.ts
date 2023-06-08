import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { ChargingStation } from './entities/charging-station.entity';
import { CreateChargingStationDto } from './dto/create-charging-station.dto';
import { Company } from 'src/companies/entities/company.entity';

@Injectable()
export class ChargingStationsService {
  constructor(
    @InjectRepository(ChargingStation)
    private readonly chargingStationsRepository: Repository<ChargingStation>,
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
  ) {}

  findAll(): Promise<ChargingStation[]> {
    return this.chargingStationsRepository.find();
  }

  async findOne(id: number): Promise<ChargingStation> {
    const options = {
      where: { id },
    };

    const charginStation = await this.chargingStationsRepository.findOne(
      options,
    );

    if (!charginStation) {
      throw new NotFoundException(`Charging Station #${id} not found`);
    }

    return charginStation;
  }
}
