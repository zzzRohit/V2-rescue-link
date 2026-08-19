# RescueLink 2.0

A Node.js/TypeScript backend service for rescue coordination.

## Features
- User authentication & role-based access control
- Report management system
- Location-based service radius
- REST API with validation middleware

## Tech Stack
- Node.js + Express.js + TypeScript
- Prisma ORM (PostgreSQL)
- JWT Authentication

## Setup

```bash
cd server
npm install
npx prisma migrate dev
npm run dev
```

## API Structure
- `/api/auth` - Authentication endpoints
- `/api/users` - User management
- `/api/reports` - Report operations

## Environment
Configure `.env` file with database URL and JWT secret.
