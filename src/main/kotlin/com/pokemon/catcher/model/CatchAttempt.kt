package com.pokemon.catcher.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "catch_attempts")
data class CatchAttempt(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    val userId: String = "default", // For multi-user support in the future
    val attemptTime: LocalDateTime = LocalDateTime.now()
)
