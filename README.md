# Periodic Tables - Restaurant Reservation System

View the live site here: https://periodic-tables.ariicodes.com

## Overview

> Welcome to the Restaurant Reservation System, a full-stack application developed for _Periodic Tables_, a startup focusing on creating a reservation system for fine dining restaurants. 
> Let me guide you through the features, existing files, setup, and user stories implemented.

## Project Structure

This project follows best practices and patterns learned during my time at Thinkful.
It is organized as a monorepo, containing both frontend and backend projects.

### Backend Files

The backend project is located in the `./back-end` folder. Key files and folders include:

- `./back-end/knexfile.js`: Knex configuration file.
- `./back-end/src/app.js`: Defines the Express application and connects routers.
- `./back-end/src/db/connection.js`: Knex connection file.
- `./back-end/src/db/migrations`: Knex migrations folder.
- `./back-end/src/db/seeds/`: Knex seeds folder.
- `./back-end/src/errors/`: Error handling components.
- `./back-end/src/reservations/`: Components related to reservations.
- `./back-end/src/tables/`: Components related to tables.
- `./back-end/src/server.js`: Defines the node server.
- `./back-end/test/`: Folder containing integration tests.
- `./back-end/vercel.json`: Vercel deployment configuration file.

### Frontend Files

The frontend project is located in the `./front-end` folder. Key files and folders include:

- `./front-end/e2e`: End-to-end tests.
- `./front-end/src/`: Source code for the React application.
- `./front-end/src/utils/`: Utility functions.
- `./front-end/src/layout/`: Components for layout and structure.
- `./front-end/src/dashboard/`: Components related to the dashboard.
- `./front-end/src/reservations/`: Components related to reservations.
- `./front-end/src/tables/`: Components related to the tables.
- `./front-end/src/index.js`: Main entry point for the React application.
- `./front-end/.env.sample` and `./back-end/.env.sample`: Sample environment files for configuration.

## Database Setup

Before running the application, set up four PostgreSQL database instances (development, test, preview, and production).
> You can use DBeaver to connect to your new database instances.

### Knex Commands

Run `npx knex` commands from within the `back-end` folder, where the `knexfile.js` file is located.

## Installation

Follow these steps to set up and run the project:

1. Fork and clone this repository.
2. Run `cp ./back-end/.env.sample ./back-end/.env`.
3. Update the `./back-end/.env` file with the connection URL's to your PostgreSQL database instance.
4. Run `cp ./front-end/.env.sample ./front-end/.env`.
5. Optionally, update the `./front-end/.env` file if you want to connect to a backend at a location other than `http://localhost:5001`.
6. Run `npm install` to install project dependencies.
7. Run `npm run start:dev` to start your server in development mode.

If you encounter issues, don't hesitate to seek assistance.

## Running Tests

This project includes unit, integration, and end-to-end tests. Run tests for specific user stories or all tests using npm scripts. Examples include:

- `npm run test:1`: Run all tests for user story 1.
- `npm run test:backend`: Run all backend tests.
- `npm run test:frontend`: Run all frontend tests.
- `npm run test:e2e`: Run only the end-to-end tests.

Refer to `npm run` for a list of available commands.

## Product Backlog

The Product Manager has created user stories for _Periodic Tables_. Each user story represents a feature or improvement in the reservation system. I've implemented the following user stories:

1. **Create and list reservations (US-01)**
2. **Create reservation on a future, working date (US-02)**
3. **Create reservation within eligible timeframe (US-03)**
4. **Seat reservation (US-04)**
5. **Finish an occupied table (US-05)**
6. **Reservation Status (US-06)**
7. **Search for a reservation by phone number (US-07)**
8. **Change an existing reservation (US-08)**

Each user story comes with specific acceptance criteria that guided the implementation process. The application now provides robust reservation management capabilities for restaurant managers.

Feel free to explore the application, test different scenarios, and enjoy the seamless reservation system developed through my capstone project!
