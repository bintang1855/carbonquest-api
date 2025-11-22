# Installation & Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18 or higher
- **npm** or **yarn**
- **PostgreSQL** database (local or remote)

## Step-by-Step Installation

### 1. Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required dependencies including:

- TypeScript and type definitions (@types/\*)
- Express and middleware packages
- Prisma ORM
- Swagger documentation tools
- Development tools (tsx, nodemon)

### 2. Set Up Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Then edit `.env` with your configuration:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/carbonquest?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=4000
NODE_ENV=development
```

**Important:** Replace the database credentials with your actual PostgreSQL credentials.

### 3. Generate Prisma Client

Generate the Prisma Client with TypeScript types:

```bash
npm run prisma:generate
```

This creates the `@prisma/client` with full TypeScript support based on your `schema.prisma`.

### 4. Run Database Migrations

Apply the database schema to your PostgreSQL database:

```bash
npm run prisma:migrate
```

When prompted for a migration name, you can use something like: `init` or `initial_setup`

This will:

- Create all tables defined in your Prisma schema
- Apply any pending migrations
- Keep your database in sync with your schema

### 5. Verify TypeScript Compilation

Check that TypeScript compiles without errors:

```bash
npm run build
```

This should create a `dist/` folder with compiled JavaScript files.

### 6. Start the Development Server

Run the development server with hot-reload:

```bash
npm run dev
```

You should see:

```
🚀 Server running on port 4000
📚 API Documentation available at http://localhost:4000/docs
```

### 7. Test the API

Open your browser and visit:

**API Health Check:**

```
http://localhost:4000/
```

**Swagger Documentation:**

```
http://localhost:4000/docs
```

## Troubleshooting

### Issue: "Cannot find module" errors

**Solution:** Make sure you've run `npm install` to install all dependencies.

### Issue: Prisma Client errors

**Solution:** Run `npm run prisma:generate` to generate the Prisma Client.

### Issue: Database connection errors

**Solution:**

1. Verify PostgreSQL is running
2. Check DATABASE_URL in `.env` file
3. Ensure database exists or create it:
   ```sql
   CREATE DATABASE carbonquest;
   ```

### Issue: Port already in use

**Solution:** Change the PORT in your `.env` file to a different port (e.g., 5000).

### Issue: TypeScript compilation errors

**Solution:**

1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Run `npm run build`

## Project Scripts Reference

| Script          | Command                   | Description                              |
| --------------- | ------------------------- | ---------------------------------------- |
| dev             | `npm run dev`             | Start development server with hot-reload |
| build           | `npm run build`           | Compile TypeScript to JavaScript         |
| start           | `npm start`               | Start production server (after build)    |
| prisma:generate | `npm run prisma:generate` | Generate Prisma Client                   |
| prisma:migrate  | `npm run prisma:migrate`  | Run database migrations                  |

## Testing the API with Swagger

1. Start the server: `npm run dev`
2. Open browser: `http://localhost:4000/docs`
3. Try the health check endpoint first
4. Register a user or organization
5. Copy the JWT token from the response
6. Click "Authorize" button in Swagger UI
7. Enter: `Bearer YOUR_TOKEN_HERE`
8. Now you can test authenticated endpoints

## Testing with cURL

### Register a User

```bash
curl -X POST http://localhost:4000/auth/user/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"password123\"}"
```

### Login

```bash
curl -X POST http://localhost:4000/auth/user/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"john@example.com\",\"password\":\"password123\"}"
```

### Get Users (with token)

```bash
curl -X GET http://localhost:4000/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Production Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
NODE_ENV=production npm start
```

### Environment Variables for Production

Make sure to set proper production values:

```env
DATABASE_URL="your-production-database-url"
JWT_SECRET="a-very-secure-random-string-minimum-32-characters"
PORT=4000
NODE_ENV=production
```

## Docker Deployment (Optional)

If you want to use Docker:

```bash
docker-compose up -d
```

This will start both the API and PostgreSQL database in containers.

## What's Next?

- ✅ API is running
- ✅ Database is connected
- ✅ Swagger documentation is available
- ✅ All endpoints are functional

You can now:

1. Test all endpoints via Swagger UI
2. Integrate with your frontend application
3. Add more features following the same architecture pattern
4. Deploy to production

## Need Help?

- Check the README.md for detailed documentation
- Review MIGRATION_SUMMARY.md for architecture overview
- Visit `/docs` endpoint for API documentation
- Check error logs in the terminal for debugging

## Common First Steps

1. **Create an organization:**

   ```bash
   POST /auth/org/register
   {
     "name": "Green Earth Org",
     "email": "admin@greenearth.com",
     "password": "securePassword123",
     "desc": "Environmental sustainability organization"
   }
   ```

2. **Create a mission (as organization):**

   ```bash
   POST /missions
   Authorization: Bearer ORG_TOKEN
   {
     "title": "Reduce Plastic Usage",
     "desc": "Complete 10 actions to reduce plastic",
     "points": 100
   }
   ```

3. **Register a user:**

   ```bash
   POST /auth/user/register
   {
     "name": "Jane Smith",
     "email": "jane@example.com",
     "password": "userPassword123"
   }
   ```

4. **User starts a mission:**
   ```bash
   POST /user-missions
   Authorization: Bearer USER_TOKEN
   {
     "id_mission": 1
   }
   ```

Enjoy building with your new TypeScript API! 🚀
