package com.pokemon.catcher.dto

data class PokemonDto(
    val id: Int,
    val name: String,
    val imageUrl: String,
    val types: List<String>,
    val height: Int,
    val weight: Int
)

data class CaughtPokemonDto(
    val id: Long,
    val pokemonId: Int,
    val name: String,
    val imageUrl: String,
    val types: List<String>,
    val caughtAt: String
)

data class CatchResponse(
    val success: Boolean,
    val pokemon: PokemonDto?,
    val message: String,
    val nextCatchAvailable: String?
)

data class CatchStatusResponse(
    val canCatch: Boolean,
    val nextCatchAvailable: String?,
    val remainingMinutes: Long?
)
