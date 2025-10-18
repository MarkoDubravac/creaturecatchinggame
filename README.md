# Pokemon Catcher

A full-stack web application for catching and collecting Pokemon with authentication, trading, and rate limiting features.

## Features

- 🎮 **Catch Pokemon** - Random Pokemon catching with cooldown timer
- 📋 **Browse Pokemon** - View all 151 Generation 1 Pokemon
- 🎒 **Collection** - Track your caught Pokemon
- 🔄 **Trading** - Trade Pokemon with other users
- 🔐 **Authentication** - Secure login/register with JWT tokens
- 🛡️ **Security** - BCrypt password hashing, JWT authentication
- 🐳 **Docker Ready** - Containerized deployment with Docker Compose

## Tech Stack

### Backend
- **Spring Boot 3.3.0** - Java framework
- **Kotlin 1.9.24** - Programming language
- **PostgreSQL** - Production database
- **H2** - Development database
- **Spring Data JPA** - Database ORM
- **Spring WebFlux** - PokeAPI integration
- **JWT (JJWT)** - Authentication tokens
- **BCrypt** - Password encryption

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Material-UI 5** - Component library
- **Axios** - HTTP client

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd pokemon-catcher

# Set up environment variables
cp .env.example .env
# Edit .env and set secure passwords

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost
# Backend: http://localhost:8080
```

### Option 2: Local Development

**Backend:**
```bash
# Start backend (uses H2 database)
./mvnw spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Demo Accounts

- Username: `ash`, Password: `password`
- Username: `misty`, Password: `password`
- Username: `brock`, Password: `password`
- Username: `gary`, Password: `password`

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
POSTGRES_PASSWORD=your_secure_password

# Security
JWT_SECRET=your-256-bit-secret-key

# Application
COOLDOWN_MINUTES=5
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

See `.env.example` for all available variables.

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Pokemon
- `GET /api/pokemon/list` - List all Pokemon
- `GET /api/pokemon/{id}` - Get Pokemon details
- `POST /api/pokemon/catch` - Catch a random Pokemon
- `GET /api/pokemon/catch/status` - Check catch cooldown
- `GET /api/pokemon/caught` - Get user's caught Pokemon

### Trading
- `POST /api/trades/offer` - Offer a trade
- `POST /api/trades/{id}/accept` - Accept trade
- `POST /api/trades/{id}/reject` - Reject trade
- `GET /api/trades/pending` - Get pending trades

### Users
- `GET /api/users` - List all users
- `GET /api/users/{username}/pokemon` - Get user's Pokemon

## Project Structure

```
pokemon-catcher/
├── src/main/kotlin/com/pokemon/catcher/
│   ├── controller/     # REST endpoints
│   ├── service/        # Business logic
│   ├── repository/     # Database access
│   ├── model/          # JPA entities
│   ├── dto/            # Data transfer objects
│   └── config/         # Configuration
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   └── api/        # API client
│   └── public/
├── Dockerfile          # Backend Docker image
├── docker-compose.yml  # Multi-container setup
└── DEPLOYMENT.md       # Deployment guide
```

## Development

### Backend Development
```bash
# Run tests
./mvnw test

# Build JAR
./mvnw clean package

# Run with specific profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=prod
```

### Frontend Development
```bash
cd frontend

# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive deployment instructions including:
- Docker deployment
- Cloud platform deployment (Heroku, Railway, Render)
- Kubernetes deployment
- Security checklist
- Monitoring setup

## Database

### Development
Uses H2 in-memory database. Access H2 console at:
- URL: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:pokemondb`
- Username: `sa`
- Password: (empty)

### Production
Uses PostgreSQL with persistent storage. Configure via environment variables.

## Security Features

- ✅ BCrypt password hashing (12 rounds)
- ✅ JWT token-based authentication
- ✅ CORS protection
- ✅ Environment-based configuration
- ✅ SQL injection prevention (JPA/Hibernate)
- ✅ XSS protection (React escaping)

## Configuration

### Backend (application.yml)
```yaml
catching:
  cooldown-minutes: 5  # Catch cooldown period

jwt:
  secret: ${JWT_SECRET}
  expiration: 86400000  # 24 hours
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8080/api
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

**Backend won't start:**
- Check Java 21 is installed
- Verify database connection
- Check environment variables

**Frontend shows CORS errors:**
- Update `CORS_ALLOWED_ORIGINS` in backend
- Verify backend is running
- Check API URL in frontend .env

**Login not working:**
- Clear browser localStorage
- Check JWT_SECRET is set
- Verify BCrypt is working (check logs)

## License

This project is licensed under the MIT License.

## Acknowledgments

- Pokemon data from [PokeAPI](https://pokeapi.co/)
- Built with Spring Boot and React
- Material-UI for components
