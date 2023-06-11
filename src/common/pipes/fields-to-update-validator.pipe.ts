import {
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';

@Injectable()
export class FieldsToUpdateValidatorPipe implements PipeTransform {
  transform(data: any) {
    if (Object.keys(data).length === 0) {
      throw new UnprocessableEntityException(
        'No fields to update were provided',
      );
    }

    return data;
  }
}
