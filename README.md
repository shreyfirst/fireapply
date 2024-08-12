# Welcome to FireApply

Sup Pratik! 👋 Here's a guide.

## 🚀 First-Time Setup

Getting started is easy. Just follow these steps:

1. **Clone the repository** to your local machine.

2. **Set up your environment variables**:
   - Copy the `.env.example` file and rename it to `.env`.
   - Fill in the values (we'll explain more about this later).

3. **Start the Docker containers**:
   ```
   npm run docker:up
   ```
   This command sets up your database and any other services we need.

4. **Run database migrations**:
   ```
   npm run migrate:up
   ```
   This sets up your database schema.

5. **Start the development server**:
   ```
   npm run dev:server
   ```

Voila! Your server should now be running at `http://localhost:3000`. 🎉

## 🔐 Authentication: How It Works

We use JWT (JSON Web Tokens) for authentication. Here's what you need to know:

- When a user registers or logs in, they receive a JWT token.
- For authenticated requests, include this token in the `Authorization` header:
  ```
  Authorization: Bearer your-jwt-token-here
  ```
- Our server will automatically check this token for protected routes.

## 🧪 Testing the API with tRPC Panel

We've set up a nifty tool called tRPC Panel to help you explore and test the API:

1. Make sure your server is running in development mode.
2. Visit `http://localhost:3000/panel` in your browser.
3. You'll see a list of all available API procedures.
4. Click on a procedure, fill in the required inputs, and hit "Run" to test it out.

It's a great way to familiarize yourself with the API without writing any code!

## 🛠 Development Workflow

### Editing Entities and Creating Migrations

1. Entity files are in the `src/modules` directory. Each module (like `user`) has its own entity file (e.g., `user.entity.ts`).
2. Our entities extend `CoreEntity`, which provides common fields like `id` and timestamps.
3. After modifying an entity, create a new migration:
   ```
   npm run migrate:create
   ```
4. This uses the MikroORM CLI to generate a migration file based on your changes.
5. Review the generated migration in the `src/migrations` directory.
6. Apply the migration with `npm run migrate:up`.

### Working with Environment Variables

We use `envalid` for type-safe environment variables:

1. Environment variables are defined in the `.env` file.
2. We access them using `$env` throughout the codebase. For example:
   ```typescript
   import { $env } from './env';
   
   console.log($env.DB_NAME);
   ```
3. This approach gives us autocomplete and type checking for env variables!

## 🤔 Need Help?

If you're stuck or have questions, don't hesitate to reach out to Shrey.

Happy coding! 🚀👩‍💻👨‍💻