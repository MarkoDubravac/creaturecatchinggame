package com.pokemon.catcher.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "caught_pokemons")
data class CaughtPokemon(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,

    val pokemonId: Int,
    val name: String,
    val imageUrl: String,

    @ElementCollection
    @CollectionTable(name = "caught_pokemon_types", joinColumns = [JoinColumn(name = "caught_pokemon_id")])
    @Column(name = "type")
    val types: List<String> = emptyList(),

    val caughtAt: LocalDateTime = LocalDateTime.now()
)
