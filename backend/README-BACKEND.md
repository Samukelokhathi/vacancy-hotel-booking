# 🏨 Vacancy Hotels --- Backend API

A RESTful backend for Vacancy Hotels, built with Node.js, Express,
TypeScript, and PostgreSQL. It provides API functionality for
authentication, hotels, rooms, reservations, favourites, hotel images,
and payments.

The backend separates request handling into routes, controllers,
services, middleware, and database configuration. It communicates with
the React frontend through HTTP requests and JSON responses.

## 🚀 Getting Started

### Prerequisites

-   Node.js (LTS recommended)
-   npm
-   PostgreSQL database (local or hosted)
-   Environment credentials required by the backend
-   Paystack credentials for payment processing
-   Google OAuth credentials if Google sign-in is enabled

Clone the repository and install backend dependencies:

``` bash
git clone https://github.com/Samukelokhathi/vacancy-hotel-booking.git
cd vacancy-hotel-booking/backend
npm install
```

Create `backend/.env` and configure the values referenced by the backend
source. Configuration categories include the PostgreSQL connection,
server port, JWT signing secret, allowed frontend origin, Google OAuth,
and Paystack. Use the exact environment variable names found in the
source code. Never commit real secrets.

Initialize PostgreSQL using the project's database initialization logic
and SQL schema. Confirm that the database is reachable before starting
the API.

Start the backend using the development script defined in
`backend/package.json`:

``` bash
npm run dev
```

If the script has a different name, use the command listed in that
package file.

## ✨ Features

-   🔐 User registration and login
-   🔑 JWT authentication
-   👥 User access and role checks
-   🏨 Hotel listing and management endpoints
-   🛏️ Room management endpoints
-   📅 Booking and reservation endpoints
-   ❤️ Favourite hotel endpoints
-   🖼️ Hotel image endpoints
-   💳 Payment initialization and verification
-   🛡️ Authentication middleware for protected routes
-   🗄️ PostgreSQL database integration
-   🔄 Layered routes, controllers, and services

Exact permissions and supported operations are defined by the route and
controller implementations.

## 🛠️ Technologies Used

-   Node.js
-   Express
-   TypeScript
-   PostgreSQL
-   JWT
-   bcrypt
-   Google OAuth verification
-   Paystack
-   dotenv
-   CORS

## 📚 What I Learned

-   Building a backend application with Node.js and TypeScript
-   Creating REST API endpoints with Express
-   Organizing code into routes, controllers, services, and middleware
-   Connecting an application to PostgreSQL
-   Designing relational database tables and relationships
-   Writing SQL queries
-   Implementing registration and login
-   Hashing passwords and validating credentials
-   Creating and verifying JWTs
-   Protecting routes with authentication and role-based authorization
-   Handling hotel, room, booking, favourite, and payment data
-   Integrating an external payment provider
-   Configuring CORS and environment variables

## 📁 Project Structure

``` text
backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   ├── initDb.ts
│   │   └── paystack.ts
│   ├── controllers/
│   │   ├── authControllers.ts
│   │   ├── bookingControllers.ts
│   │   ├── favoriteControllers.ts
│   │   ├── hotelControllers.ts
│   │   ├── hotelImageControllers.ts
│   │   ├── paymentControllers.ts
│   │   └── roomControllers.ts
│   ├── middleware/
│   │   └── authMiddleware.ts
│   ├── models/
│   │   └── hotel.types.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── bookingRoutes.ts
│   │   ├── favoriteRoutes.ts
│   │   ├── hotelImageRoutes.ts
│   │   ├── hotelRoutes.ts
│   │   ├── paymentRoutes.ts
│   │   └── roomRoutes.ts
│   ├── services/
│   │   ├── bookingService.ts
│   │   ├── favoriteService.ts
│   │   ├── hotelImageService.ts
│   │   ├── hotelServices.ts
│   │   ├── paymentServices.ts
│   │   ├── roomService.ts
│   │   └── userService.ts
│   ├── sql/
│   │   └── schema.sql
│   └── server.ts
├── package.json
├── package-lock.json
└── tsconfig.json
```

## 🧱 Backend Architecture

``` text
Frontend
   |
   | HTTP request
   v
Express Server
   |
   v
Routes
   |
   v
Authentication Middleware
   |
   v
Controllers
   |
   v
Services
   |
   v
PostgreSQL Database
   |
   v
JSON Response
   |
   v
Frontend
```

-   **Server:** Configures Express, middleware, CORS, and API routes.
-   **Routes:** Define HTTP endpoints.
-   **Middleware:** Checks authentication and permissions.
-   **Controllers:** Handle requests, validate input, and return
    responses.
-   **Services:** Contain application logic and database operations.
-   **Config:** Sets up database and external service connections.
-   **SQL:** Contains the database schema.

## 🔧 Run Application

Use the scripts defined in `backend/package.json`:

``` bash
npm install
npm run dev
npm run build
npm start
```

The available script names may differ. Check `backend/package.json`
before running them.

## 🔗 Project Links

-   🔗 **GitHub Repository:**
    https://github.com/Samukelokhathi/vacancy-hotel-booking
-   🔗 **Frontend README:** `../frontend/README.md`
-   🔗 **Full-Stack README:** `../README.md`
