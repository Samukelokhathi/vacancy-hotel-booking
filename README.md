# 🏨 Vacancy Hotels --- Full-Stack Hotel Booking Application

`<img src="https://socialify.git.ci/Samukelokhathi/vacancy-hotel-booking/image?language=1&owner=1&name=1&stargazers=1&theme=Light" alt="vacancy-hotel-booking" width="640" height="320" />`{=html}

Vacancy Hotels is a full-stack hotel booking application built with
React, TypeScript, Node.js, Express, and PostgreSQL. The platform allows
guests to discover accommodation, view hotel and room information, make
reservations, manage favourites, and complete payment workflows. It also
provides administrative functionality for managing hotel listings and
reservations.

The application is separated into a React frontend and an Express REST
API backend. The frontend uses Redux Toolkit for shared state and Axios
for API communication. The backend uses routes, controllers, services,
middleware, and PostgreSQL database access.

## 🚀 Getting Started

### Prerequisites

-   Node.js (LTS recommended)
-   npm
-   PostgreSQL database (local or hosted)
-   Git
-   Google OAuth credentials if Google sign-in is enabled
-   Paystack credentials for payment processing

Clone the repository:

``` bash
git clone https://github.com/Samukelokhathi/vacancy-hotel-booking.git
cd vacancy-hotel-booking
```

### 1. Configure the Backend

``` bash
cd backend
npm install
```

Create `backend/.env` and configure the environment variables referenced
by the backend source code. These include database connection details,
server configuration, JWT secret, allowed frontend origin, and
credentials for enabled external services.

Initialize PostgreSQL using the project's SQL schema and database
initialization logic. Ensure the database is available before starting
the API.

Start the backend with the development script in `backend/package.json`:

``` bash
npm run dev
```

Keep this terminal running.

### 2. Configure the Frontend

Open a second terminal:

``` bash
cd vacancy-hotel-booking/frontend
npm install
```

Create `frontend/.env` and configure the API base URL and any frontend
integration values required by the application. Check `src/api/axios.ts`
and the Google sign-in configuration for exact variable names.

Start the frontend:

``` bash
npm run dev
```

Vite normally serves the application at:

``` text
http://localhost:5173
```

The backend host and port depend on the backend configuration.

> **Environment security:** Never commit `.env` files, database
> passwords, JWT secrets, Google client secrets, or Paystack secret
> keys.

## ✨ Features

### Guest and Customer Features

-   🔐 User registration and login
-   🌐 Google sign-in integration
-   🏨 Browse hotel listings
-   🔍 Search and filter hotels
-   📍 View hotel details, address, location, facilities, and policies
-   🖼️ View hotel images and galleries
-   🛏️ View room information and submit booking requests
-   📅 View personal bookings
-   ❤️ Save and view favourite hotels
-   👤 Manage profile information
-   💳 Complete and verify payments through Paystack

### Admin Features

-   🛡️ Protected administrator access
-   🏨 Add and manage hotel listings
-   🛏️ Manage room information
-   📋 View and manage reservations
-   👥 Manage application information according to backend permissions

### Application Features

-   🔄 REST API communication between frontend and backend
-   🗄️ PostgreSQL relational database
-   🧩 Reusable React components
-   📦 Redux Toolkit state management
-   📱 Responsive user interface
-   🔐 Authentication middleware and role-based access checks
-   ⚙️ Environment-based configuration
-   🌐 CORS configuration

## 🛠️ Technologies Used

### Frontend

-   React
-   TypeScript
-   Vite
-   Redux Toolkit
-   React Redux
-   React Router
-   Axios
-   CSS Modules
-   Google OAuth integration

### Backend

-   Node.js
-   Express
-   TypeScript
-   PostgreSQL
-   JWT
-   bcrypt
-   dotenv
-   CORS
-   Paystack integration

### Development Tools

-   Git and GitHub
-   npm
-   Visual Studio Code
-   Postman for API testing

## 📚 What I Learned

-   Building and organizing a full-stack application
-   Developing a React frontend with TypeScript
-   Building REST APIs with Node.js, Express, and TypeScript
-   Connecting a frontend application to a backend API
-   Managing application state with Redux Toolkit
-   Creating asynchronous Redux actions
-   Working with Axios for HTTP requests
-   Designing PostgreSQL tables and relationships
-   Separating backend logic into routes, controllers, services, and
    middleware
-   Implementing authentication with JWT
-   Hashing passwords and validating credentials
-   Applying role-based authorization to protected routes
-   Handling hotel, room, booking, favourite, and payment data
-   Integrating Google authentication and Paystack payment workflows
-   Handling environment variables and CORS
-   Building reusable and responsive user interfaces
-   Using Git and GitHub to manage a full-stack project

## 🏗️ Application Architecture

``` text
┌────────────────────────────────┐
│         React Frontend         │
│                                │
│ Pages · Components · Redux     │
│ React Router · Axios           │
└────────────────┬───────────────┘
                 |
                 | HTTP / JSON
                 v
┌────────────────────────────────┐
│         Express Backend        │
│                                │
│ Server · Routes · Middleware   │
│ Controllers · Services         │
└────────────────┬───────────────┘
                 |
                 | SQL queries
                 v
┌────────────────────────────────┐
│          PostgreSQL            │
│                                │
│ Users · Hotels · Rooms         │
│ Bookings · Payments            │
└────────────────────────────────┘
```

## 📁 Project Structure

``` text
vacancy-hotel-booking/
├── README.md
├── package.json
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── server.ts
│       ├── config/
│       │   ├── database.ts
│       │   ├── initDb.ts
│       │   └── paystack.ts
│       ├── controllers/
│       │   ├── authControllers.ts
│       │   ├── bookingControllers.ts
│       │   ├── favoriteControllers.ts
│       │   ├── hotelControllers.ts
│       │   ├── hotelImageControllers.ts
│       │   ├── paymentControllers.ts
│       │   └── roomControllers.ts
│       ├── middleware/
│       │   └── authMiddleware.ts
│       ├── models/
│       │   └── hotel.types.ts
│       ├── routes/
│       │   ├── authRoutes.ts
│       │   ├── bookingRoutes.ts
│       │   ├── favoriteRoutes.ts
│       │   ├── hotelImageRoutes.ts
│       │   ├── hotelRoutes.ts
│       │   ├── paymentRoutes.ts
│       │   └── roomRoutes.ts
│       ├── services/
│       │   ├── bookingService.ts
│       │   ├── favoriteService.ts
│       │   ├── hotelImageService.ts
│       │   ├── hotelServices.ts
│       │   ├── paymentServices.ts
│       │   ├── roomService.ts
│       │   └── userService.ts
│       └── sql/
│           └── schema.sql
└── frontend/
    ├── README.md
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── tsconfig.app.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    ├── vercel.json
    ├── vite.config.ts
    └── src/
        ├── App.css
        ├── App.tsx
        ├── index.css
        ├── main.tsx
        ├── api/
        │   └── axios.ts
        ├── assets/
        ├── components/
        │   ├── admin/
        │   ├── bookingCard/
        │   ├── bookingForm/
        │   ├── bookingList/
        │   ├── button/
        │   ├── dateRangeCalendar/
        │   ├── facilityIcon/
        │   ├── favoriteButton/
        │   ├── footer/
        │   ├── hotelCard/
        │   ├── hotelMap/
        │   ├── hotelRow/
        │   ├── icons/
        │   ├── inputs/
        │   ├── layout/
        │   ├── modal/
        │   ├── navbar/
        │   ├── photoGallery/
        │   ├── protectedRoute/
        │   ├── searchBar/
        │   └── userMenu/
        ├── hooks/
        ├── models/
        ├── pages/
        │   ├── admin/
        │   ├── home/
        │   ├── hotelDetails/
        │   ├── landingPage/
        │   ├── login/
        │   ├── myBookings/
        │   ├── paymentVerify/
        │   ├── profile/
        │   └── register/
        ├── store/
        └── utils/
```

## 🔧 Run Application

Run the frontend and backend in separate terminals.

### Backend

``` bash
cd backend
npm install
npm run dev
```

### Frontend

``` bash
cd frontend
npm install
npm run dev
```

### Production Builds

Run the scripts defined in each package:

``` bash
cd backend
npm run build
```

``` bash
cd frontend
npm run build
```

Check the individual `package.json` files for the exact available
scripts.

## 🌐 Deployment

The frontend contains a `vercel.json` configuration and is structured
for Vercel deployment. The backend must be deployed to a
Node.js-compatible hosting provider and connected to a reachable
PostgreSQL database.

1.  Configure the production PostgreSQL connection.
2.  Set backend environment variables in the hosting provider.
3.  Configure the backend CORS origin to allow the deployed frontend.
4.  Deploy the backend API.
5.  Set the frontend API base URL to the deployed backend address.
6.  Configure OAuth and payment credentials in the appropriate
    environments.
7.  Deploy the frontend.
8.  Test registration, login, hotel browsing, booking, and payment
    verification.

## 🔗 Project Links

-   🔗 **Live Site:** https://vacancy-hotel-booking.vercel.app/
-   🔗 **GitHub Repository:**
    https://github.com/Samukelokhathi/vacancy-hotel-booking
-   🔗 **Frontend README:** `frontend/README.md`
-   🔗 **Backend README:** `backend/README.md`
