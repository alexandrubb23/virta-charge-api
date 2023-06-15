import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsPositiveOrZero(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'isPositiveOrZero',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return value >= 0;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a positive number or zero`;
        },
      },
    });
  };
}
