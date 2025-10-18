package com.pokemon.catcher.repository

import com.pokemon.catcher.model.CatchAttempt
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
interface CatchAttemptRepository : JpaRepository<CatchAttempt, Long> {
    fun findFirstByUserIdOrderByAttemptTimeDesc(userId: String): CatchAttempt?
    fun findByUserIdAndAttemptTimeAfter(userId: String, time: LocalDateTime): List<CatchAttempt>
}
