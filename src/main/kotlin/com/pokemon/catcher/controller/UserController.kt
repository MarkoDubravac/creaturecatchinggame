package com.pokemon.catcher.controller

import com.pokemon.catcher.dto.CaughtPokemonDto
import com.pokemon.catcher.dto.UserDto
import com.pokemon.catcher.service.PokemonCatchingService
import com.pokemon.catcher.service.UserService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = ["http://localhost:3000", "http://localhost:5173"])
class UserController(
    private val userService: UserService,
    private val pokemonCatchingService: PokemonCatchingService
) {

    @GetMapping
    fun getAllUsers(): ResponseEntity<List<UserDto>> {
        val users = userService.getAllUsers().map { user ->
            val pokemonCount = pokemonCatchingService.getAllCaughtPokemons(user.username).size
            UserDto(
                id = user.id!!,
                username = user.username,
                displayName = user.displayName,
                pokemonCount = pokemonCount
            )
        }
        return ResponseEntity.ok(users)
    }

    @GetMapping("/{username}/pokemon")
    fun getUserPokemon(@PathVariable username: String): ResponseEntity<List<CaughtPokemonDto>> {
        return ResponseEntity.ok(pokemonCatchingService.getAllCaughtPokemons(username))
    }
}
