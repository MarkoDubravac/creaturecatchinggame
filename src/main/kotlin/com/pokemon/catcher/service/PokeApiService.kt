package com.pokemon.catcher.service

import com.pokemon.catcher.dto.*
import org.springframework.beans.factory.annotation.Value
import org.springframework.cache.annotation.Cacheable
import org.springframework.http.client.reactive.ReactorClientHttpConnector
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.ExchangeStrategies
import org.springframework.web.reactive.function.client.WebClient
import reactor.netty.http.client.HttpClient
import kotlin.random.Random

@Service
class PokeApiService(
    @Value("\${pokeapi.base-url}")
    private val baseUrl: String
) {
    private val webClient = WebClient.builder()
        .baseUrl(baseUrl)
        .exchangeStrategies(
            ExchangeStrategies.builder()
                .codecs { configurer ->
                    configurer.defaultCodecs().maxInMemorySize(2 * 1024 * 1024) // 2 MB
                }
                .build()
        )
        .build()

    companion object {
        const val MAX_POKEMON_ID = 151 // First generation
    }

    fun getRandomPokemon(): PokemonDto {
        val randomId = Random.nextInt(1, MAX_POKEMON_ID + 1)
        return getPokemonById(randomId)
    }

    @Cacheable(value = ["pokemonById"], key = "#id")
    fun getPokemonById(id: Int): PokemonDto {
        val response = webClient.get()
            .uri("/pokemon/$id")
            .retrieve()
            .bodyToMono(PokeApiPokemonDetail::class.java)
            .block() ?: throw RuntimeException("Failed to fetch Pokemon with id: $id")

        return mapToPokemonDto(response)
    }

    @Cacheable(value = ["pokemons"], key = "#limit + '-' + #offset")
    fun getAllPokemons(limit: Int = 151, offset: Int = 0): List<PokemonDto> {
        val listResponse = webClient.get()
            .uri("/pokemon?limit=$limit&offset=$offset")
            .retrieve()
            .bodyToMono(PokeApiPokemonListResponse::class.java)
            .block() ?: throw RuntimeException("Failed to fetch Pokemon list")

        return listResponse.results.mapIndexed { index, reference ->
            val id = offset + index + 1
            try {
                getPokemonById(id)
            } catch (e: Exception) {
                null
            }
        }.filterNotNull()
    }

    private fun mapToPokemonDto(detail: PokeApiPokemonDetail): PokemonDto {
        val imageUrl = detail.sprites.other?.officialArtwork?.frontDefault
            ?: detail.sprites.frontDefault
            ?: ""

        return PokemonDto(
            id = detail.id,
            name = detail.name.replaceFirstChar { it.uppercase() },
            imageUrl = imageUrl,
            types = detail.types.map { it.type.name.replaceFirstChar { c -> c.uppercase() } },
            height = detail.height,
            weight = detail.weight
        )
    }
}
