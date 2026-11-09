# 🏨 Vacancy Hotels --- Frontend

`<img src="https://socialify.git.ci/Samukelokhathi/vacancy-hotel-booking/image?language=1&owner=1&name=1&stargazers=1&theme=Light" alt="vacancy-hotel-booking" width="640" height="320" />`{=html}

A modern, responsive hotel booking frontend built with React and
TypeScript. It allows guests to discover accommodation, view hotel
information, manage bookings and favourites, and complete payment
workflows. The frontend communicates with the Vacancy Hotels REST API
using Axios and manages shared state with Redux Toolkit.

## 🚀 Getting Started

### Prerequisites

-   Node.js (LTS recommended)
-   npm
-   Vacancy Hotels backend running locally or deployed
-   Frontend environment values required by the app (API URL and OAuth
    client ID, if enabled)

Clone the repository:

``` bash
git clone https://github.com/Samukelokhathi/vacancy-hotel-booking.git
cd vacancy-hotel-booking/frontend
npm install
```

Create a `.env` file and set the variables referenced by
`src/api/axios.ts` and the Google sign-in configuration. Use the exact
names expected by the source code. Do not commit credentials.

Start the development server:

``` bash
npm run dev
```

Vite normally serves the app at `http://localhost:5173`.

## ✨ Features

-   🏨 Browse hotel listings
-   🔍 Search and filter hotels
-   📍 View hotel details, location, facilities, policies, and images
-   🛏️ View room information and submit booking requests
-   🔐 Register and sign in
-   🌐 Google sign-in integration
-   👤 Manage profile information
-   ❤️ Save and view favourite hotels
-   📅 View booking history
-   💳 Verify payments through the payment integration
-   🛡️ Protected routes for authenticated users
-   👨‍💼 Admin dashboard for hotel and reservation management
-   📱 Responsive layouts for desktop, tablet, and mobile

Feature availability depends on the matching backend endpoints and
configuration.

## 🛠️ Technologies Used

-   React
-   TypeScript
-   Vite
-   Redux Toolkit and React Redux
-   React Router
-   Axios
-   CSS Modules
-   Google OAuth integration
-   Paystack payment workflow

## 📚 What I Learned

-   Building a multi-page React application with TypeScript
-   Creating reusable components and layouts
-   Managing global state with Redux Toolkit
-   Creating asynchronous Redux actions
-   Connecting a frontend to REST APIs using Axios
-   Handling authentication and protected routes
-   Managing hotel, booking, favourite, and payment state
-   Defining and using TypeScript interfaces
-   Handling forms and user input
-   Integrating third-party authentication and payment workflows
-   Organizing code into components, pages, hooks, models, store, and
    utilities
-   Creating responsive interfaces with CSS Modules
-   Using Git and GitHub during development

## 📁 Project Structure

``` text
frontend/
├── public/
├── src/
│   ├── api/                 # Axios API configuration
│   ├── assets/
│   ├── components/
│   │   ├── admin/
│   │   ├── bookingCard/
│   │   ├── bookingForm/
│   │   ├── bookingList/
│   │   ├── button/
│   │   ├── dateRangeCalendar/
│   │   ├── facilityIcon/
│   │   ├── favoriteButton/
│   │   ├── footer/
│   │   ├── hotelCard/
│   │   ├── hotelMap/
│   │   ├── hotelRow/
│   │   ├── icons/
│   │   ├── inputs/
│   │   ├── layout/
│   │   ├── modal/
│   │   ├── navbar/
│   │   ├── photoGallery/
│   │   ├── protectedRoute/
│   │   ├── searchBar/
│   │   └── userMenu/
│   ├── hooks/
│   ├── models/
│   ├── pages/
│   │   ├── admin/
│   │   ├── home/
│   │   ├── hotelDetails/
│   │   ├── landingPage/
│   │   ├── login/
│   │   ├── myBookings/
│   │   ├── paymentVerify/
│   │   ├── profile/
│   │   └── register/
│   ├── store/
│   ├── utils/
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json
└── vite.config.ts
```

## 🔧 Run Application

``` bash
npm run dev
npm run build
npm run lint
npm run preview
```

These are common Vite scripts; confirm the exact available scripts in
`frontend/package.json`.

## 🔗 Project Links

-   🔗 **Live Site:** https://vacancy-hotel-booking.vercel.app/
-   🔗 **GitHub Repository:**
    https://github.com/Samukelokhathi/vacancy-hotel-booking
-   🔗 **Backend README:** `../backend/README.md`
-   🔗 **Full-Stack README:** `../README.md`
