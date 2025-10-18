package com.pokemon.catcher.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(unique = true, nullable = false)
    val username: String,

    val displayName: String,

    @Column(nullable = false)
    val passwordHash: String,

    val createdAt: LocalDateTime = LocalDateTime.now()
)
