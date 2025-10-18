package com.pokemon.catcher.dto

data class TradeOfferRequest(
    val offeredPokemonId: Long,
    val requestedPokemonId: Long,
    val receiverUsername: String
)

data class TradeDto(
    val id: Long,
    val initiatorUsername: String,
    val initiatorDisplayName: String,
    val receiverUsername: String,
    val receiverDisplayName: String,
    val offeredPokemon: CaughtPokemonDto,
    val requestedPokemon: CaughtPokemonDto,
    val status: String,
    val createdAt: String,
    val completedAt: String?
)

data class TradeResponse(
    val success: Boolean,
    val message: String,
    val trade: TradeDto?
)

data class UserDto(
    val id: Long,
    val username: String,
    val displayName: String,
    val pokemonCount: Int
)

data class LoginRequest(
    val username: String,
    val password: String
)

data class RegisterRequest(
    val username: String,
    val displayName: String,
    val password: String
)

data class AuthResponse(
    val success: Boolean,
    val message: String,
    val user: UserDto? = null,
    val token: String? = null
)
