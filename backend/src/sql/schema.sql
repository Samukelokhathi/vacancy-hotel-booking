CREATE TABLE IF NOT EXISTS users ( 
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    cellphone VARCHAR(20) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'client'
    CHECK (role IN ('client', 'admin')),
    displayPicture TEXT,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hotels (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  latitude NUMERIC(9, 6),
  longitude NUMERIC(9, 6),
  starRating SMALLINT CHECK (starRating BETWEEN 1 AND 5),
  pricePerNight NUMERIC(10, 2) NOT NULL CHECK (pricePerNight >= 0),
  facilities TEXT[] NOT NULL DEFAULT '{}',
  policies TEXT,
  createdBy INTEGER REFERENCES users(id) ON DELETE SET NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT NOW()
);

