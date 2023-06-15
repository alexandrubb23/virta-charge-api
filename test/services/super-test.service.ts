import { INestApplication } from '@nestjs/common';
import supertest, * as request from 'supertest';

type SuperTest = supertest.Test;
type Payload = string | object;

class SuperTestService {
  private token: string;
  private request: supertest.SuperTest<SuperTest>;

  constructor(
    private readonly app: INestApplication,
    private readonly endpoint: string,
  ) {
    if (endpoint.startsWith('/') || endpoint.endsWith('/')) {
      throw new Error('endpoint should not start or end with /');
    }

    this.endpoint = endpoint;
    this.request = request(this.app.getHttpServer());
  }

  findAll = (): Promise<SuperTest> => {
    return this.requestType('get');
  };

  findOne = (id: number): Promise<SuperTest> => {
    return this.requestType('get', {}, id);
  };

  create = (payload: Payload): Promise<SuperTest> => {
    return this.requestType('post', payload);
  };

  update = (id: number, payload: Payload): Promise<SuperTest> => {
    return this.requestType('patch', payload, id);
  };

  delete = (id: number): Promise<SuperTest> => {
    return this.requestType('delete', {}, id);
  };

  private requestType = (
    method: string,
    payload: Payload = {},
    id?: number,
  ): Promise<SuperTest> => {
    const path = id ? `/${id}` : '';

    const httpRequest = this.request[method](`/${this.endpoint}${path}`);

    httpRequest.set('Authorization', `Bearer ${this.token}`).send(payload);

    return httpRequest;
  };

  setToken = (token: string): string => {
    return (this.token = token);
  };
}

export default SuperTestService;
