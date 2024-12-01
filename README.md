# 🔧 Project Management Backend

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development](#development)
- [Deployment](#deployment)
- [Technologies](#technologies)
- [Contributing](#contributing)

## 🛠 Prerequisites

- **Node.js**: v18 or later
- **npm**: v9 or later
- **PostgreSQL**: Latest stable version

## 🏁 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/project-management-backend.git
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/project-management
PORT=9000
JWT_SECRET=your-secret-key
ACCESS_TOKEN_EXPIRES=1d
REFRESH_TOKEN_EXPIRES=7d
NODE_ENV=development
CLIENT_ENDPOINT=http://localhost:3000
WEBSOCKET_PORT=8080
```

### 4. Database Setup

Initialize Prisma and run migrations:

```bash
npm run prisma:migrate
```

## 📂 Project Structure

```
src/
│
├── controllers/   # Request handlers
├── models/        # Database models
├── routes/        # API route definitions
├── services/      # Business logic
├── middleware/    # Express middleware
├── utils/         # Utility functions
└── config/        # Configuration files
```

## 🔧 Development Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run database migrations |

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## 📦 Key Technologies

- **Framework**: Express.js
- **ORM**: Prisma
- **Language**: TypeScript
- **Authentication**: JWT
- **Real-time**: Socket.IO
- **Validation**: Zod
- **Logging**: Winston

## 🔐 Authentication

- JWT-based authentication
- Refresh and access token mechanism

## 🌐 WebSocket

Real-time communication implemented using Socket.IO

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes
   ```bash
   git commit -m 'Add some Amazing Feature'
   ```
4. Push to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

## 🛡️ Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `PORT` | Server port |
| `JWT_SECRET` | Secret key for JWT |
| `ACCESS_TOKEN_EXPIRES` | Access token expiration |
| `REFRESH_TOKEN_EXPIRES` | Refresh token expiration |
| `NODE_ENV` | Application environment |
| `CLIENT_ENDPOINT` | Frontend application URL |
| `WEBSOCKET_PORT` | WebSocket server port |

## 🚨 Troubleshooting

- Verify PostgreSQL is running
- Check database connection string
- Ensure all environment variables are set
- Confirm Prisma client is generated

## 🔒 Security Features

- Password hashing with bcrypt
- JWT authentication
- Environment-specific configurations

## 📝 Logging

Comprehensive logging implemented with Winston

## 📄 License

[Specify Your License]

## 📞 Contact

[Your Contact Information]
```
