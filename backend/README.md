# My Fullstack App - Backend

This is the backend part of the Blog API project. It is built using Express and Prisma, providing a RESTful API to interact with the database.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- PostgreSQL (make sure to have a running instance)

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd odin-blog-api/backend
   ```

2. Install the dependencies:

   ```
   npm install
   ```

3. Set up your environment variables:
   Create a `.env` file in the `backend` directory and add your database connection string:
   ```
   DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<database>
   JWT_SECRET=<your-session-secret>
   ```

### Running the Application

To start the backend server, run:

```
npm run dev
```

This will start the server in development mode.

### API Endpoints

- `GET /`: Returns a welcome message.
- Additional endpoints can be defined in the `src/routes/index.ts` file.

### Database Schema

The database schema is defined in `prisma/schema.prisma`. You can modify it according to your application's needs and run migrations using Prisma.

### Testing

To run tests, use:

```
npm test
```

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
