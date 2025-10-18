package com.pokemon.catcher.nocontroller

import com.pokemon.catcher.dto.CatchResponse
import com.pokemon.catcher.dto.CatchStatusResponse
import com.pokemon.catcher.dto.CaughtPokemonDto
import com.pokemon.catcher.dto.PokemonDto
import com.pokemon.catcher.service.PokeApiService
import com.pokemon.catcher.service.PokemonCatchingService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/pokemon")
class PokemonController(
    private val pokeApiService: PokeApiService,
    private val pokemonCatchingService: PokemonCatchingService
) {

    @GetMapping("/list")
    fun getAllPokemons(
        @RequestParam(defaultValue = "151") limit: Int,
        @RequestParam(defaultValue = "0") offset: Int
    ): ResponseEntity<List<PokemonDto>> {
        return ResponseEntity.ok(pokeApiService.getAllPokemons(limit, offset))
    }

    @GetMapping("/{id}")
    fun getPokemonById(@PathVariable id: Int): ResponseEntity<PokemonDto> {
        return ResponseEntity.ok(pokeApiService.getPokemonById(id))
    }

    @PostMapping("/catch")
    fun catchPokemon(
        @RequestHeader("X-Username", defaultValue = "default") username: String
    ): ResponseEntity<CatchResponse> {
        return ResponseEntity.ok(pokemonCatchingService.catchPokemon(username))
    }

    @GetMapping("/catch/status")
    fun getCatchStatus(
        @RequestHeader("X-Username", defaultValue = "default") username: String
    ): ResponseEntity<CatchStatusResponse> {
        return ResponseEntity.ok(pokemonCatchingService.getCatchStatus(username))
    }

    @GetMapping("/caught")
    fun getCaughtPokemons(
        @RequestHeader("X-Username", defaultValue = "default") username: String
    ): ResponseEntity<List<CaughtPokemonDto>> {
        return ResponseEntity.ok(pokemonCatchingService.getAllCaughtPokemons(username))
    }
}
