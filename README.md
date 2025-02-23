# UKHSC System Backend

This repository contains the backend system for UKHSC, built using TypeScript.

## Introduction

This backend system is designed to handle the core functionalities of UKHSC, utilizing modern web technologies to ensure efficient and scalable operations.

## Features

- **Node.js**: Backend server environment.
- **TypeScript**: Ensures type safety and better maintainability.
- **Prisma**: Database ORM for type-safe database access.
- **Hono**: Web framework for building API endpoints.
- **Zod**: Type-safe schema validation.

## Getting Started

To get started with the UKHSC System Backend, follow these steps:

1. **Clone the Repository**: Clone this project to your local machine.
   ```bash
   git clone https://github.com/ukhsc/ukhsc-system-backend.git
   ```
2. **Install Dependencies**: Navigate to the project directory and install the necessary dependencies with `pnpm`.
   ```bash
   pnpm install
   ```
3. **Setup Environment Variables**: Create a `.env` file in the root directory and add the required environment variables.
4. **Run Migrations**: Apply database migrations.
   ```bash
   pnpm run migrate
   ```
5. **Seed the Database**: Seed the database with initial data.
   ```bash
   pnpm run seed
   ```
6. **Start the Development Server**: Start the local development server.
   ```bash
   pnpm run dev
   ```

## Project Structure

The project is organized as follows:

- **src/index.ts**: Main router definition.
- **src/endpoints/**: Each API endpoint has its own file in this directory.
- **prisma/**: Contains Prisma schema and migration files.
- **scripts/**: Contains utility scripts.

## Architecture

The architecture of the UKHSC System Backend is designed to be modular and scalable. Key components include:

- **API Gateway**: Manages incoming requests and routes them to appropriate services.
- **Service Layer**: Contains the business logic and interacts with the database via Prisma.
- **Database**: A relational database managed by Prisma for data persistence.
- **Validation Layer**: Uses Zod for schema validation to ensure data integrity and type safety.

## Development

To start a local instance of the API for development:

1. **Run Development Server**: Start the local server.
   ```bash
   pnpm dev
   ```
2. **Access API**: Open `http://localhost:8787/` in your browser to access the API.

## Testing

Run the test suite using the following command:

```bash
pnpm test
```

## Contributing

Contributions are welcome! Please fork the repository and submit pull requests.

## License


For more information, visit the [project homepage](https://api.ukhsc.org/docs).