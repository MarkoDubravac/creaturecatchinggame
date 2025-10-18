package com.pokemon.catcher.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class PokeApiPokemonListResponse(
    val count: Int,
    val next: String?,
    val previous: String?,
    val results: List<PokemonReference>
)

data class PokemonReference(
    val name: String,
    val url: String
)

data class PokeApiPokemonDetail(
    val id: Int,
    val name: String,
    val sprites: Sprites,
    val types: List<TypeSlot>,
    val height: Int,
    val weight: Int
)

data class Sprites(
    @JsonProperty("front_default")
    val frontDefault: String?,
    val other: Other?
)

data class Other(
    @JsonProperty("official-artwork")
    val officialArtwork: OfficialArtwork?
)

data class OfficialArtwork(
    @JsonProperty("front_default")
    val frontDefault: String?
)

data class TypeSlot(
    val slot: Int,
    val type: Type
)

data class Type(
    val name: String,
    val url: String
)
