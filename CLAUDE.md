# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pokemon Catcher is a full-stack web application for catching Pokemon with rate limiting (once per configurable period). The application integrates with the PokeAPI to fetch Pokemon data.

**Tech Stack:**
- Backend: Spring Boot 3.3.0 + Kotlin 1.9.24 (Java 21)
- Frontend: React 18 + Vite + Material-UI 5
- Database: H2 in-memory database
- API: Spring WebFlux WebClient for PokeAPI integration

## Common Commands

### Backend (Maven)

**Build and run:**
```bash
mvnw clean install
mvnw spring-boot:run
```

**Build only:**
```bash
mvnw clean package
```

The backend runs on `http://localhost:8080`

### Frontend (Vite + npm)

**Install dependencies:**
```bash
cd frontend
npm install
```

**Run development server:**
```bash
cd frontend
npm run dev
```

**Build for production:**
```bash
cd frontend
npm run build
```

The frontend dev server runs on `http://localhost:5173` (Vite default) or `http://localhost:3000`

### Database

Access H2 console at `http://localhost:8080/h2-console`:
- JDBC URL: `jdbc:h2:mem:pokemondb`
- Username: `sa`
- Password: (empty)

## Architecture

### Backend Architecture

**Package structure:**
- `controller/` - REST API endpoints with CORS support for frontend
- `service/` - Business logic layer
  - `PokeApiService` - Handles all external PokeAPI calls via WebClient
  - `PokemonCatchingService` - Manages catching logic, cooldown enforcement, and caught Pokemon tracking
- `repository/` - Spring Data JPA repositories for database access
- `model/` - JPA entities (`CaughtPokemon`, `CatchAttempt`)
- `dto/` - Data Transfer Objects for API responses

**Key architectural patterns:**
- Rate limiting implemented via `CatchAttempt` entity tracking timestamps
- Single user model (userId = "default") stored in service companion object
- Cooldown period configured in `application.yml` (`catching.cooldown-minutes`)
- WebClient configured with PokeAPI base URL from `application.yml` (`pokeapi.base-url`)

**External API integration:**
- PokeAPI base URL: `https://pokeapi.co/api/v2`
- First generation Pokemon only (IDs 1-151, defined in `PokeApiService.MAX_POKEMON_ID`)
- API responses mapped from PokeAPI format to internal DTOs
- Sprite URLs extracted from `sprites.other.official-artwork.front_default` with fallback to `sprites.front_default`

**Time handling:**
- All timestamps use `LocalDateTime`
- Cooldown calculations use `ChronoUnit.MINUTES.between()`
- DateTime formatted as ISO_LOCAL_DATE_TIME for API responses

### Frontend Architecture

**Component structure:**
- `App.jsx` - Main component with MUI ThemeProvider, AppBar, and tab navigation
- `components/CatchPokemon.jsx` - Catch functionality with cooldown timer
- `components/PokemonList.jsx` - Browse all 151 Pokemon in a grid
- `components/CaughtPokemons.jsx` - Display user's caught Pokemon collection
- `api/pokemonApi.js` - Axios client for backend API calls

**State management:**
- Local component state with React hooks (useState, useEffect)
- No global state management library
- API calls trigger component re-renders

**Styling:**
- Material-UI components throughout
- Custom theme with Pokemon-inspired colors (red primary: #EE1515, blue secondary: #3B4CCA)
- Responsive grid layouts with MUI Grid system

## API Endpoints

All endpoints prefixed with `/api/pokemon`:

- `GET /list?limit=151&offset=0` - Fetch Pokemon list from PokeAPI
- `GET /{id}` - Get specific Pokemon details
- `POST /catch` - Attempt to catch a random Pokemon (rate limited)
- `GET /catch/status` - Check cooldown status and remaining time
- `GET /caught` - Retrieve user's caught Pokemon sorted by catch time (descending)

## Configuration

**Cooldown period:**
Edit `src/main/resources/application.yml`:
```yaml
catching:
  cooldown-minutes: 1  # Currently set to 1 minute for development
```

**CORS configuration:**
Currently allows `http://localhost:3000` and `http://localhost:5173` in `PokemonController.kt:14`

**Frontend API URL:**
Configured in `frontend/src/api/pokemonApi.js:3` as `http://localhost:8080/api/pokemon`
