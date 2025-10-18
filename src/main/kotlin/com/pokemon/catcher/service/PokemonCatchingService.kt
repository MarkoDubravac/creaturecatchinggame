package com.pokemon.catcher.service

import com.pokemon.catcher.dto.CatchResponse
import com.pokemon.catcher.dto.CatchStatusResponse
import com.pokemon.catcher.dto.CaughtPokemonDto
import com.pokemon.catcher.model.CatchAttempt
import com.pokemon.catcher.model.CaughtPokemon
import com.pokemon.catcher.repository.CatchAttemptRepository
import com.pokemon.catcher.repository.CaughtPokemonRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit

@Service
class PokemonCatchingService(
    private val pokeApiService: PokeApiService,
    private val caughtPokemonRepository: CaughtPokemonRepository,
    private val catchAttemptRepository: CatchAttemptRepository,
    private val userService: UserService,
    @Value("\${catching.cooldown-minutes}")
    private val cooldownMinutes: Long
) {
    companion object {
        private val DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME
        private const val DEFAULT_USER_ID = "default"
    }

    fun catchPokemon(username: String = DEFAULT_USER_ID): CatchResponse {
        val user = userService.getCurrentUser(username)
        val now = LocalDateTime.now()
        val lastAttempt = catchAttemptRepository.findFirstByUserIdOrderByAttemptTimeDesc(username)

        // Check if user can catch
        if (lastAttempt != null) {
            val minutesSinceLastCatch = ChronoUnit.MINUTES.between(lastAttempt.attemptTime, now)
            if (minutesSinceLastCatch < cooldownMinutes) {
                val nextAvailable = lastAttempt.attemptTime.plusMinutes(cooldownMinutes)
                return CatchResponse(
                    success = false,
                    pokemon = null,
                    message = "You can only catch a Pokemon once per hour. Please wait.",
                    nextCatchAvailable = nextAvailable.format(DATE_FORMATTER)
                )
            }
        }

        // Record attempt
        catchAttemptRepository.save(CatchAttempt(userId = username, attemptTime = now))

        // Catch a random Pokemon
        val pokemon = pokeApiService.getRandomPokemon()

        val caughtPokemon = CaughtPokemon(
            user = user!!,
            pokemonId = pokemon.id,
            name = pokemon.name,
            imageUrl = pokemon.imageUrl,
            types = pokemon.types,
            caughtAt = now
        )

        caughtPokemonRepository.save(caughtPokemon)

        val nextAvailable = now.plusMinutes(cooldownMinutes)

        return CatchResponse(
            success = true,
            pokemon = pokemon,
            message = "Congratulations! You caught ${pokemon.name}!",
            nextCatchAvailable = nextAvailable.format(DATE_FORMATTER)
        )
    }

    fun getCatchStatus(username: String = DEFAULT_USER_ID): CatchStatusResponse {
        val now = LocalDateTime.now()
        val lastAttempt = catchAttemptRepository.findFirstByUserIdOrderByAttemptTimeDesc(username)

        if (lastAttempt == null) {
            return CatchStatusResponse(
                canCatch = true,
                nextCatchAvailable = null,
                remainingMinutes = null
            )
        }

        val minutesSinceLastCatch = ChronoUnit.MINUTES.between(lastAttempt.attemptTime, now)

        return if (minutesSinceLastCatch >= cooldownMinutes) {
            CatchStatusResponse(
                canCatch = true,
                nextCatchAvailable = null,
                remainingMinutes = null
            )
        } else {
            val nextAvailable = lastAttempt.attemptTime.plusMinutes(cooldownMinutes)
            val remainingMinutes = ChronoUnit.MINUTES.between(now, nextAvailable)

            CatchStatusResponse(
                canCatch = false,
                nextCatchAvailable = nextAvailable.format(DATE_FORMATTER),
                remainingMinutes = remainingMinutes
            )
        }
    }

    fun getAllCaughtPokemons(username: String = DEFAULT_USER_ID): List<CaughtPokemonDto> {
        val user = userService.getCurrentUser(username)
        return caughtPokemonRepository.findByUserOrderByCaughtAtDesc(user!!)
            .map {
                CaughtPokemonDto(
                    id = it.id!!,
                    pokemonId = it.pokemonId,
                    name = it.name,
                    imageUrl = it.imageUrl,
                    types = it.types,
                    caughtAt = it.caughtAt.format(DATE_FORMATTER)
                )
            }
    }
}
