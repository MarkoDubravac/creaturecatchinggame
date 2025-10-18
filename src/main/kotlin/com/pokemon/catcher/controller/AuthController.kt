package com.pokemon.catcher.controller

import com.pokemon.catcher.dto.AuthResponse
import com.pokemon.catcher.dto.LoginRequest
import com.pokemon.catcher.dto.RegisterRequest
import com.pokemon.catcher.dto.UserDto
import com.pokemon.catcher.service.AuthService
import com.pokemon.catcher.service.JwtService
import com.pokemon.catcher.service.PokemonCatchingService
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val authService: AuthService,
    private val jwtService: JwtService,
    private val pokemonCatchingService: PokemonCatchingService
) {

    @PostMapping("/register")
    fun register(@RequestBody request: RegisterRequest): ResponseEntity<AuthResponse> {
        if (request.username.isBlank() || request.password.isBlank() || request.displayName.isBlank()) {
            return ResponseEntity.badRequest().body(
                AuthResponse(success = false, message = "All fields are required")
            )
        }

        if (request.password.length < 6) {
            return ResponseEntity.badRequest().body(
                AuthResponse(success = false, message = "Password must be at least 6 characters")
            )
        }

        val user = authService.register(request.username, request.displayName, request.password)

        return if (user != null) {
            val token = jwtService.generateToken(user.username)
            val userDto = UserDto(
                id = user.id!!,
                username = user.username,
                displayName = user.displayName,
                pokemonCount = 0
            )
            ResponseEntity.ok(AuthResponse(
                success = true,
                message = "Registration successful",
                user = userDto,
                token = token
            ))
        } else {
            ResponseEntity.badRequest().body(
                AuthResponse(success = false, message = "Username already exists")
            )
        }
    }

    @PostMapping("/login")
    fun login(@RequestBody request: LoginRequest): ResponseEntity<AuthResponse> {
        if (request.username.isBlank() || request.password.isBlank()) {
            return ResponseEntity.badRequest().body(
                AuthResponse(success = false, message = "Username and password are required")
            )
        }

        val user = authService.login(request.username, request.password)

        return if (user != null) {
            val token = jwtService.generateToken(user.username)
            val pokemonCount = pokemonCatchingService.getAllCaughtPokemons(user.username).size
            val userDto = UserDto(
                id = user.id!!,
                username = user.username,
                displayName = user.displayName,
                pokemonCount = pokemonCount
            )
            ResponseEntity.ok(AuthResponse(
                success = true,
                message = "Login successful",
                user = userDto,
                token = token
            ))
        } else {
            ResponseEntity.badRequest().body(
                AuthResponse(success = false, message = "Invalid username or password")
            )
        }
    }
}
