package com.pokemon.catcher.repository

import com.pokemon.catcher.model.Trade
import com.pokemon.catcher.model.TradeStatus
import com.pokemon.catcher.model.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface TradeRepository : JpaRepository<Trade, Long> {
    fun findByInitiatorOrReceiver(initiator: User, receiver: User): List<Trade>
    fun findByReceiverAndStatus(receiver: User, status: TradeStatus): List<Trade>
    fun findByInitiatorAndStatus(initiator: User, status: TradeStatus): List<Trade>

    @Query("SELECT t FROM Trade t WHERE (t.initiator = :user OR t.receiver = :user) AND t.status = :status")
    fun findByUserAndStatus(user: User, status: TradeStatus): List<Trade>
}
