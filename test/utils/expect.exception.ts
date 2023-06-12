import {
  BadRequestException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';

const expectResponseException = async (
  action: () => Promise<any>,
  expectedException: HttpException['constructor'],
  errorMessage: string,
) => {
  try {
    await action();
    expect(false).toBeTruthy(); // we should not get here
  } catch (error) {
    expect(error).toBeInstanceOf(expectedException);
    expect(error.message).toEqual(errorMessage);
  }
};

export const expectNotFoundException = async (
  action: () => Promise<any>,
  id: number,
  errorMessage = `Charging Station #${id} not found`,
) => {
  await expectResponseException(action, NotFoundException, errorMessage);
};

export const expectBadRequestException = async (
  action: () => Promise<any>,
  id: number,
  errorMessage = `Charging Station #${id} not found`,
) => {
  await expectResponseException(action, BadRequestException, errorMessage);
};
