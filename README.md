# 🩺 Doctor Appointment Booking System - NestJS Backend

A comprehensive backend system for managing doctor appointments built with NestJS, TypeORM, and PostgreSQL. Features JWT authentication, role-based access control, and real-time appointment management.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (PATIENT, DOCTOR)
  - Secure password hashing with bcrypt

- **Doctor Management**
  - Doctor listing with pagination
  - Filter by specialization
  - Available time slots management
  - Customizable slot duration per doctor

- **Appointment System**
  - Book appointments with conflict detection
  - View patient/doctor appointments
  - Appointment status management
  - Time slot validation

- **API Documentation**
  - Comprehensive Swagger documentation
  - Input validation with DTOs
  - Proper error handling

## 🛠️ Tech Stack

- **Backend**: NestJS + TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT + Passport
- **Documentation**: Swagger
- **Validation**: class-validator

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment variables**
Update the `.env` file with your database credentials:
```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/doctor_booking
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=doctor_booking
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
PORT=3000
```

3. **Start the application**
```bash
npm run start:dev
```

The server will start on `http://localhost:3000`

### Database Setup

Ensure PostgreSQL is running and create the database:
```bash
psql -U postgres -c "CREATE DATABASE doctor_booking;"
```
#### Migrations
Make sure TypeORM is installed globally:
```bash
npm install -g typeorm
```
Then, generate the initial migration:
```bash
npm run typeorm:migration:generate
```
This will create a migration file in the `src/migrations` directory.

Run TypeORM migrations to set up the database schema:
```bash
npm run typeorm:migration:run
```
#### Seeding Sample Data
To populate the database with sample data:
```bash
npm run seed
```

This creates:
- Sample patient user: `alice@example.com / password123`
- Sample doctors with different specializations
- Default login: `john.smith@hospital.com / password123`

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:3000/api

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "password": "password123",
  "role": "PATIENT"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "password123"
}
```

### Doctor Endpoints

#### Get All Doctors
```http
GET /doctors?page=1&limit=10&specialization=Dermatologist
```

#### Get Available Slots
```http
GET /doctors/{doctorId}/slots?date=2025-01-15
```

### Appointment Endpoints (Requires Authentication)

#### Book Appointment (Patient Only)
```http
POST /appointments
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "doctorId": "doctor-uuid",
  "date": "2025-01-15",
  "time": "10:30"
}
```

#### Get My Appointments (Patient Only)
```http
GET /appointments/me
Authorization: Bearer {jwt_token}
```

#### Get Doctor Appointments (Doctor Only)
```http
GET /appointments/doctor/{doctorId}
Authorization: Bearer {jwt_token}
```

## 🏗️ Project Structure

```
src/
├── auth/                   # Authentication module
│   ├── dto/               # Data transfer objects
│   ├── strategies/        # Passport strategies
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── user/                  # User management
│   ├── entities/
│   ├── user.service.ts
│   └── user.module.ts
├── doctor/                # Doctor management
│   ├── entities/
│   ├── dto/
│   ├── doctor.controller.ts
│   ├── doctor.service.ts
│   └── doctor.module.ts
├── appointment/           # Appointment management
│   ├── entities/
│   ├── dto/
│   ├── appointment.controller.ts
│   ├── appointment.service.ts
│   └── appointment.module.ts
├── common/                # Shared utilities
│   ├── decorators/
│   ├── guards/
│   └── enums/
├── database/              # Database configuration
│   ├── database.module.ts
│   └── seed.ts
└── main.ts               # Application entry point
```

## 📊 Database Schema

### Users Table
- `id`: UUID (Primary Key)
- `name`: String
- `email`: String (Unique)
- `passwordHash`: String
- `role`: Enum (PATIENT, DOCTOR)
- `createdAt`: Timestamp

### Doctors Table
- `id`: UUID (Primary Key)
- `userId`: UUID (Foreign Key to Users)
- `specialization`: String
- `availableFrom`: Time
- `availableTo`: Time
- `slotDuration`: Number (minutes)

### Appointments Table
- `id`: UUID (Primary Key)
- `doctorId`: UUID (Foreign Key to Doctors)
- `userId`: UUID (Foreign Key to Users)
- `startTime`: Timestamp
- `endTime`: Timestamp
- `status`: Enum (BOOKED, CANCELLED, COMPLETED)

## 🔒 Business Rules

- No overlapping appointments for the same doctor
- Appointments must be within doctor's availability hours
- Only authenticated patients can book appointments
- Doctors can only view their own appointments
- Slot duration is enforced per doctor configuration


## 🚀 Production Deployment

1. Set `NODE_ENV=production`
2. Use a secure JWT secret
3. Configure proper database credentials
4. Disable TypeORM synchronization
5. Run database migrations if needed
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](LICENSE).
