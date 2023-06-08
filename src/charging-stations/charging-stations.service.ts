import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ChargingStation } from './entities/charging-station.entity';

@Injectable()
export class ChargingStationsService {
  constructor(
    @InjectRepository(ChargingStation)
    private readonly chargingStationsRepository: Repository<ChargingStation>,
  ) {}

  async findAll(): Promise<ChargingStation[]> {
    return this.chargingStationsRepository.find();
  }
}
