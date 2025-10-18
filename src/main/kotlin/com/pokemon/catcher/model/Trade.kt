package com.pokemon.catcher.model

import jakarta.persistence.*
import java.time.LocalDateTime

enum class TradeStatus {
    PENDING,
    ACCEPTED,
    REJECTED,
    CANCELLED
}

@Entity
@Table(name = "trades")
data class Trade(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "initiator_id", nullable = false)
    val initiator: User,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", nullable = false)
    val receiver: User,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "offered_pokemon_id", nullable = false)
    val offeredPokemon: CaughtPokemon,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requested_pokemon_id", nullable = false)
    val requestedPokemon: CaughtPokemon,

    @Enumerated(EnumType.STRING)
    var status: TradeStatus = TradeStatus.PENDING,

    val createdAt: LocalDateTime = LocalDateTime.now(),

    var completedAt: LocalDateTime? = null
)
