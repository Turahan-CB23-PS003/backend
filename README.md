# Turahan Backend

Welcome to the Turahan backend repository! This repository contains the codebase for the backend of Turahan built with Hapi.js. Follow the instructions below to set up the project and start development.

# Status
![Cloud Run](https://github.com/Turahan-CB23-PS003/backend/actions/workflows/cloud-run.yml/badge.svg)

## Deployments

- Production: [https://turahan.ziakode.com/](https://turahan.ziakode.com/)
- Development: [https://turahan-run-rad3c73vaa-et.a.run.app](https://turahan-run-rad3c73vaa-et.a.run.app)

## Getting Started

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Turahan-CB23-PS003/backend.git
   cd hapijs-backend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file:**
   Create a new file named `.env` in the root of the project. This file should contain configurations for your database connection. Here's an example:
   ```env
   DB_CONNECTION_STRING=your_database_connection_string
   ```

## Running the Application

- **Development Mode:**
  To run the application in development mode, use the following command:
  ```bash
  npm run start-dev
  ```
  This will start the server using `nodemon`, allowing for automatic restarts when code changes are detected.