# Calendar Booking System

A full-stack scheduling and calendar booking application built with React, Vite, Express, and Tailwind CSS.

## Features

- **Event Management**: Create custom event types with specific durations and details.
- **Meeting Dashboard**: View and manage upcoming and past meetings.
- **Modern UI**: Built with Tailwind CSS and Radix UI components for a clean, accessible interface.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [pnpm](https://pnpm.io/) (used as the primary package manager)

## Getting Started

Follow these steps to set up and run the project locally.

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Start the Development Server**
   ```bash
   pnpm run dev
   ```
   This command starts a single development server using Vite, which serves the React frontend and also runs the Express backend middleware concurrently.

3. **Access the Application**
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
- **Backend / Server**: Express, Zod (for validation).
- **Tooling**: Vite, TypeScript, Vitest, pnpm.
