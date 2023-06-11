import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiQuery,
} from '@nestjs/swagger';

import {
  BAD_REQUEST,
  FORBIDDEN,
  NOT_FOUND,
} from 'src/constants/http-response.constants';

export const ApiAuth = () =>
  applyDecorators(ApiBearerAuth(), ApiForbiddenResponse({ ...FORBIDDEN }));

export const ApiAuthWithNotFound = () =>
  applyDecorators(ApiAuth(), ApiNotFoundResponse({ ...NOT_FOUND }));

export const ApiAuthAndPayload = () =>
  applyDecorators(
    ApiAuth(),
    ApiBadRequestResponse({ ...BAD_REQUEST }),
    ApiNotFoundResponse({ ...NOT_FOUND }),
  );

export const PaginateQuery = () =>
  applyDecorators(
    ApiQuery({ name: 'limit', required: false }),
    ApiQuery({ name: 'offset', required: false }),
  );
