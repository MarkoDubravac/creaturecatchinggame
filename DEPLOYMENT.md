# Pokemon Catcher - Deployment Guide

## Production-Ready Features

✅ **PostgreSQL Database** - Persistent data storage
✅ **BCrypt Password Hashing** - Secure password encryption
✅ **JWT Authentication** - Token-based authentication
✅ **Environment Variables** - Configurable deployment
✅ **Docker Support** - Containerized deployment
✅ **Multi-stage Builds** - Optimized Docker images

---

## Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- Git (to clone the repository)

### 1. Setup Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and set secure values
nano .env
```

**Important: Change these values in .env:**
- `POSTGRES_PASSWORD` - Strong database password
- `JWT_SECRET` - Random 256-bit secret key (use a password generator)

### 2. Deploy with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove all data
docker-compose down -v
```

### 3. Access the Application

- **Frontend:** http://localhost
- **Backend API:** http://localhost:8080/api
- **Database:** localhost:5432

### 4. Default Demo Accounts

- Username: `ash`, Password: `password`
- Username: `misty`, Password: `password`
- Username: `brock`, Password: `password`
- Username: `gary`, Password: `password`

---

## Deployment Options

### Option 1: Docker Compose (Easiest)

Perfect for VPS deployment (DigitalOcean, Linode, etc.)

```bash
# On your server
git clone <your-repo>
cd pokemon-catcher
cp .env.example .env
nano .env  # Set production values
docker-compose up -d
```

**Pros:** Simple, all-in-one, includes database
**Cons:** Single server only

---

### Option 2: Cloud Platform (Heroku, Railway, Render)

#### Backend Deployment

1. **Build the JAR:**
```bash
./mvnw clean package -DskipTests
```

2. **Deploy to platform:**
   - Upload `target/pokemon-catcher-1.0.0.jar`
   - Set environment variables (see below)
   - Add PostgreSQL addon/service

3. **Environment Variables:**
```
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=<postgres-connection-string>
DATABASE_USERNAME=<db-user>
DATABASE_PASSWORD=<db-password>
JWT_SECRET=<your-secret-key>
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

#### Frontend Deployment (Netlify, Vercel)

1. **Build:**
```bash
cd frontend
npm install
npm run build
```

2. **Deploy:**
   - Upload `dist` folder
   - Set environment variable: `VITE_API_BASE_URL=https://your-backend-url.com/api`

**Pros:** Managed services, auto-scaling
**Cons:** May have costs, vendor lock-in

---

### Option 3: Kubernetes (Advanced)

For production at scale. Create Kubernetes manifests:
- Deployment for backend
- Deployment for frontend
- Service for database (or use managed PostgreSQL)
- Ingress for routing
- ConfigMap and Secrets for environment variables

---

## Environment Variables Reference

### Backend Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection string | jdbc:h2:mem:pokemondb | Yes (prod) |
| `DATABASE_USERNAME` | Database username | sa | Yes (prod) |
| `DATABASE_PASSWORD` | Database password | (empty) | Yes (prod) |
| `JWT_SECRET` | Secret key for JWT signing (min 256 bits) | (dev key) | **Required** |
| `JWT_EXPIRATION` | Token expiration in milliseconds | 86400000 | No |
| `COOLDOWN_MINUTES` | Pokemon catch cooldown | 1 | No |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend URLs (comma-separated) | localhost URLs | Yes (prod) |
| `PORT` | Server port | 8080 | No |

### Frontend Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | http://localhost:8080/api |

---

## Security Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong random value (minimum 256 bits)
- [ ] Change `POSTGRES_PASSWORD` to a strong password
- [ ] Update `CORS_ALLOWED_ORIGINS` to only include your frontend domain
- [ ] Remove or disable default demo accounts (in DataLoader.kt)
- [ ] Enable HTTPS with SSL/TLS certificates
- [ ] Set up database backups
- [ ] Review and harden nginx configuration
- [ ] Enable rate limiting on authentication endpoints
- [ ] Set up monitoring and logging
- [ ] Use secrets management (AWS Secrets Manager, HashiCorp Vault, etc.)

---

## Database Migrations

The application uses Hibernate with `ddl-auto: update`. For production:

**Option 1:** Continue with Hibernate auto-update (simpler, less control)

**Option 2:** Use Flyway or Liquibase for versioned migrations (recommended for production)

Add Flyway to `pom.xml`:
```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```

Change `application-prod.yml`:
```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: validate  # Don't auto-modify schema
```

---

## Monitoring and Health Checks

### Add Spring Boot Actuator

Update `pom.xml`:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

Update `application-prod.yml`:
```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info
  endpoint:
    health:
      show-details: when-authorized
```

**Health endpoint:** `GET /actuator/health`

---

## Backup Strategy

### Database Backups

**Automated PostgreSQL backup:**
```bash
# Backup
docker exec pokemon-postgres pg_dump -U pokemon pokemondb > backup.sql

# Restore
cat backup.sql | docker exec -i pokemon-postgres psql -U pokemon pokemondb
```

**Scheduled backups (cron):**
```bash
# Add to crontab
0 2 * * * docker exec pokemon-postgres pg_dump -U pokemon pokemondb > /backups/pokemon-$(date +\%Y\%m\%d).sql
```

---

## Scaling Considerations

1. **Horizontal Scaling:**
   - Backend: Stateless, can scale with load balancer
   - Frontend: Static files, use CDN
   - Database: Use managed PostgreSQL with read replicas

2. **Performance:**
   - Enable caching for PokeAPI responses (already implemented)
   - Add Redis for session management
   - Use connection pooling for database

3. **Cost Optimization:**
   - Use spot instances for non-critical environments
   - Implement auto-scaling based on load
   - Use CDN for frontend assets

---

## Troubleshooting

### Backend won't start
- Check environment variables are set correctly
- Verify database is accessible
- Check logs: `docker-compose logs backend`

### Database connection failed
- Verify PostgreSQL is running: `docker-compose ps`
- Check credentials in .env
- Ensure port 5432 is not already in use

### Frontend shows API errors
- Verify `VITE_API_BASE_URL` is correct
- Check CORS settings in backend
- Verify backend is running and accessible

### Authentication not working
- Clear browser localStorage
- Verify JWT_SECRET is set and consistent
- Check token expiration settings

---

## Support

For issues or questions:
1. Check application logs
2. Verify environment variables
3. Review this deployment guide
4. Check Docker container health: `docker-compose ps`

---

## Next Steps

1. **SSL/TLS:** Set up HTTPS with Let's Encrypt
2. **Domain:** Configure your domain name
3. **CDN:** Add CloudFlare or similar for static assets
4. **Monitoring:** Set up logging and error tracking (Sentry, DataDog)
5. **CI/CD:** Automate deployment with GitHub Actions or GitLab CI
