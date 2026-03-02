# Axia Business Assurance Microservice

A Node.js microservice for administrative functions built with Express.js and Sequelize ORM.

## Features

- Express.js REST API
- PostgreSQL database with Sequelize ORM
- JWT authentication
- Input validation with Joi
- Structured logging with Winston
- CORS support
- Database migrations and seeding

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your database credentials and other configuration.

4. Run database migrations:

   ```bash
   npm run migrate
   ```

5. Seed the database (optional):
   ```bash
   npm run seed
   ```

## Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm run migrate` - Run database migrations
- `npm run migrate:undo` - Undo all migrations
- `npm run seed` - Run database seeders
- `npm run seed:undo` - Undo all seeders
- `npm run migrate:undo:seed` - Undo migrations, re-run migrations, and seed
