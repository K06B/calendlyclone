# Calendar Booking System

A full-stack scheduling and calendar booking application built with React, Vite, Express, PostgreSQL, and Tailwind CSS.

## Features

- **Event Management**: Create custom event types with specific durations and details.
- **Interactive Calendar**: Calendar option available to easily choose meeting dates from a dynamic calendar interface.
- **Meeting Dashboard**: View and manage upcoming and past meetings.
- **Authentication**: Secure sign-up and sign-in flow with JWT-based authentication and a default admin fallback.
- **Email Notifications**: Automated email notifications sent to attendees upon booking confirmation using Nodemailer.
- **Modern UI**: Built with Tailwind CSS and Radix UI components for a clean, accessible interface.
- **Robust Database**: Uses PostgreSQL and Prisma ORM for reliable data persistence.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [pnpm](https://pnpm.io/) (used as the primary package manager)
- [PostgreSQL](https://www.postgresql.org/) (running locally or a cloud instance)

## Getting Started

Follow these steps to set up and run the project locally.

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory based on the following required variables:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/calendar_system_db?schema=public"
   JWT_SECRET="your-super-secret-jwt-key"
   SMTP_HOST="smtp.example.com"
   SMTP_PORT="587"
   SMTP_USER="your-email@example.com"
   SMTP_PASS="your-email-password"
   FROM_EMAIL="your-email@example.com"
   ```

3. **Database Setup**
   Push the Prisma schema to your PostgreSQL database to create the necessary tables:
   ```bash
   pnpm dlx prisma db push
   ```
   *(Optional)* Generate the Prisma client if it wasn't done automatically:
   ```bash
   pnpm dlx prisma generate
   ```

4. **Start the Development Server**
   ```bash
   pnpm run dev
   ```
   This command starts a single development server using Vite, which serves the React frontend and also runs the Express backend concurrently.

5. **Access the Application**
   Open your browser and navigate to:
   [http://localhost:8080](http://localhost:8080)

## Available Scripts

- `pnpm run dev`: Starts the application in development mode with hot-reloading for both client and server code.
- `pnpm run build`: Compiles and bundles the application (both frontend and backend) for production.
- `pnpm run start`: Runs the compiled production code.
- `pnpm run typecheck`: Validates TypeScript typings across the project.
- `pnpm run test`: Executes the test suite using Vitest.
- `pnpm run format.fix`: Formats code automatically using Prettier.

## Tech Stack

- **Frontend**: React 18, React Router (SPA), Tailwind CSS, Framer Motion, Radix UI Primitives, Lucide Icons.
- **Backend**: Express, Prisma ORM, PostgreSQL, JWT (Authentication), Nodemailer, Zod (for validation).
- **Tooling**: Vite, TypeScript, Vitest, pnpm.
