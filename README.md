# Charging Station Management API

[![NestJS](https://img.shields.io/badge/NestJS-Framework-red.svg)](https://nestjs.com/)
[![Docker](https://img.shields.io/badge/Docker-Container-blue.svg)](https://www.docker.com/)
[![PostGIS](https://img.shields.io/badge/PostGIS-Spatial%20Database-green.svg)](https://postgis.net/)
[![TypeORM](https://img.shields.io/badge/TypeORM-ORM-lightgrey.svg)](https://typeorm.io/)

This API manages multiple companies with electrical charging stations. Each company can own one or more other charging companies, creating a hierarchical structure. The parent company has access to all its children companies' stations. The total number of charging stations owned by a company includes its stations as well as stations owned by its subsidiaries.

For example, consider three companies: A, B, and C. Company A owns 10 charging stations, Company B owns 5 charging stations, and Company C owns 2 charging stations. Company B belongs to Company A, and Company C belongs to Company B. In this scenario, Company A owns 17 charging stations, Company B owns 7 charging stations, and Company C owns 2 charging stations.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Project on your local](#running-the-project-on-your-local)
- [Running the Project with Docker](#running-the-project-with-docker)
- [API Documentation](#api-documentation)
- [Searching for Charging Stations](#searching-for-charging-stations)
- [Running Tests](#running-tests)
- [Contributing](#contributing)
- [License](#license)
- [TODO](#todo)

## Prerequisites

Before running the project, ensure you have the following dependencies installed:

- Node.js (version >= 18)
- Docker (optional)

## Installation

1. Clone this repository.
2. Navigate to the project directory.
3. Copy the `.env.example` file to `.env`:

```bash
 cp .env.example .env
```

4. Open the `.env` file and define the environment-specific values:

```bash

# Database
DATABASE_USER="postgres"
DATABASE_PASSWORD="secret"
DATABASE_PORT="5432"
DATABASE_HOST="postgres" # container service name
DATABASE_DB="postgres"

# API
API_PORT="3000"
API_KEY="YJqGjKxPcA5ZlCPp2Q3L6STIlX91a4Z3SZep7EY7"
API_REQUEST_TIMEOUT="10000"

```

Adjust the values according to your environment setup.

_The `API_KEY` should be provided as an `Authorization Bearer` token for `POST`, `PATCH`, and `DELETE` requests. Please note that this is for demonstration purposes only._

For instance:

```
curl -X 'PATCH' \
  'http://localhost:3000/charging-stations/1' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer YJqGjKxPcA5ZlCPp2Q3L6STIlX91a4Z3SZep7EY7' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "string",
  "latitude": 0,
  "longitude": 0,
  "company_id": 0,
  "address": "string"
}'
```

## Running the Project on your local

1. Before running the project, ensure that `Node.js` and `npm` (Node Package Manager) are installed on your local machine.
2. Open a terminal or command prompt and navigate to the root directory of your project.
3. Install the project dependencies by running the following command:

```bash
npm install

```

2. Build and run the database:

```bash
docker compose up postgres --build
```

_Note: If you decide to run only the PostgreSQL database service without the API, make sure to set the `DATABASE_HOST` environment variable to localhost._

3. Run the API

```
npm run start:dev
```

This command will run the API in development mode with hot reloading enabled.

4. Start consuming the API by making requests at:

```bash
http://localhost:3000
```

The `API` will be accessible at this `URL`. You can send `HTTP` requests to interact with the endpoints and retrieve data.

For a full list of API endpoints and their details, please refer to the [API documentation](http://localhost:3000/api). The documentation provides comprehensive information about each endpoint, including request methods, parameters, and response formats. You can access and explore the documentation to understand the available functionality and interact with the API effectively.

## Running the Project with Docker

You can run the project using `Docker`. Make sure you have `Docker` installed and running on your system.

1. Build the `Docker` image by executing the following command:

```
docker compose up --build
```

This command will start both services: `PostreSQL` and `API`. It will initiate the `PostgreSQL` database container and run the `API` server concurrently, allowing you to interact with the `API` and utilize the database functionalities seamlessly.

The `API` will be accessible at http://localhost:3000.

## API Documentation

The API documentation is available through [`Swagger`](https://swagger.io/). You can access it by navigating to the following URL:

```bash
http://localhost:3000/api
```

## Searching for Charging Stations

You can search for charging stations near a specific location by providing latitude, longitude, and a radius. The API uses [`PostGIS`](http://postgis.net/) for performing spatial queries.

To search for charging stations, use the following `API` endpoint:

```bash
GET /charging-stations/search?latitude={latitude}&longitude={longitude}&radius={radius}

```

Replace `{latitude}` with the latitude coordinate of the location, `{longitude}` with the longitude coordinate, and `{radius}` with the search radius in kilometers.

For instance:

```bash
curl -X 'GET' \
  'http://localhost:3000/charging-stations/search?latitude=30.276660&longitude=-98.413280&radius=1000' \
  -H 'accept: application/json'
```

The response will contain a list of charging stations within the specified radius, ordered by increasing distance. Stations in the same location will be grouped together.

## Available Tests (lack of time)

```bash
# Unit tests
npm run test -- companies.service
npm run test -- charging-stations.service

# Integration tests
 npm run test:e2e -- companies

```

_I know that testing is a critical part of software development to ensure the reliability and correctness of the code. It's generally recommended to include a comprehensive set of tests to cover different aspects of our application and provide confidence in its functionality._

# TODO

- Implement unique companies
- Implemnent unique charging stations
- Add more coverege tests
- Validate if parent exist on company creation

## Contributing

Contributions are welcome! If you find any issues or have

## License

This project is licensed under the MIT License.
