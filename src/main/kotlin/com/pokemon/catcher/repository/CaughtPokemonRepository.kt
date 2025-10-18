package com.pokemon.catcher.repository

import com.pokemon.catcher.model.CaughtPokemon
import com.pokemon.catcher.model.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface CaughtPokemonRepository : JpaRepository<CaughtPokemon, Long> {
    fun findByUser(user: User): List<CaughtPokemon>
    fun findByUserOrderByCaughtAtDesc(user: User): List<CaughtPokemon>
}
