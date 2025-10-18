package com.pokemon.catcher.service

import com.pokemon.catcher.dto.CaughtPokemonDto
import com.pokemon.catcher.dto.TradeDto
import com.pokemon.catcher.dto.TradeOfferRequest
import com.pokemon.catcher.dto.TradeResponse
import com.pokemon.catcher.model.Trade
import com.pokemon.catcher.model.TradeStatus
import com.pokemon.catcher.repository.CaughtPokemonRepository
import com.pokemon.catcher.repository.TradeRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

@Service
class TradeService(
    private val tradeRepository: TradeRepository,
    private val caughtPokemonRepository: CaughtPokemonRepository,
    private val userService: UserService
) {
    companion object {
        private val DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME
    }

    @Transactional
    fun offerTrade(initiatorUsername: String, request: TradeOfferRequest): TradeResponse {
        val initiator = userService.getCurrentUser(initiatorUsername)
        val receiver = userService.getCurrentUser(request.receiverUsername)

        val offeredPokemon = caughtPokemonRepository.findById(request.offeredPokemonId)
            .orElseThrow { IllegalArgumentException("Offered Pokemon not found") }

        val requestedPokemon = caughtPokemonRepository.findById(request.requestedPokemonId)
            .orElseThrow { IllegalArgumentException("Requested Pokemon not found") }

        // Validate ownership
        if (offeredPokemon.user.id != initiator!!.id) {
            return TradeResponse(
                success = false,
                message = "You don't own the offered Pokemon",
                trade = null
            )
        }

        if (requestedPokemon.user.id != receiver!!.id) {
            return TradeResponse(
                success = false,
                message = "The requested Pokemon doesn't belong to ${receiver!!.displayName}",
                trade = null
            )
        }

        val trade = Trade(
            initiator = initiator,
            receiver = receiver,
            offeredPokemon = offeredPokemon,
            requestedPokemon = requestedPokemon,
            status = TradeStatus.PENDING
        )

        val savedTrade = tradeRepository.save(trade)

        return TradeResponse(
            success = true,
            message = "Trade offer sent to ${receiver.displayName}",
            trade = mapToTradeDto(savedTrade)
        )
    }

    @Transactional
    fun acceptTrade(tradeId: Long, receiverUsername: String): TradeResponse {
        val receiver = userService.getCurrentUser(receiverUsername)
        val trade = tradeRepository.findById(tradeId)
            .orElseThrow { IllegalArgumentException("Trade not found") }

        if (trade.receiver.id != receiver!!.id) {
            return TradeResponse(
                success = false,
                message = "You are not authorized to accept this trade",
                trade = null
            )
        }

        if (trade.status != TradeStatus.PENDING) {
            return TradeResponse(
                success = false,
                message = "This trade is no longer pending",
                trade = null
            )
        }

        // Swap Pokemon ownership
        val offeredPokemon = trade.offeredPokemon
        val requestedPokemon = trade.requestedPokemon

        val updatedOfferedPokemon = offeredPokemon.copy(user = trade.receiver)
        val updatedRequestedPokemon = requestedPokemon.copy(user = trade.initiator)

        caughtPokemonRepository.save(updatedOfferedPokemon)
        caughtPokemonRepository.save(updatedRequestedPokemon)

        trade.status = TradeStatus.ACCEPTED
        trade.completedAt = LocalDateTime.now()
        val completedTrade = tradeRepository.save(trade)

        return TradeResponse(
            success = true,
            message = "Trade completed successfully!",
            trade = mapToTradeDto(completedTrade)
        )
    }

    @Transactional
    fun rejectTrade(tradeId: Long, receiverUsername: String): TradeResponse {
        val receiver = userService.getCurrentUser(receiverUsername)
        val trade = tradeRepository.findById(tradeId)
            .orElseThrow { IllegalArgumentException("Trade not found") }

        if (trade.receiver.id != receiver!!.id) {
            return TradeResponse(
                success = false,
                message = "You are not authorized to reject this trade",
                trade = null
            )
        }

        if (trade.status != TradeStatus.PENDING) {
            return TradeResponse(
                success = false,
                message = "This trade is no longer pending",
                trade = null
            )
        }

        trade.status = TradeStatus.REJECTED
        trade.completedAt = LocalDateTime.now()
        val rejectedTrade = tradeRepository.save(trade)

        return TradeResponse(
            success = true,
            message = "Trade rejected",
            trade = mapToTradeDto(rejectedTrade)
        )
    }

    @Transactional
    fun cancelTrade(tradeId: Long, initiatorUsername: String): TradeResponse {
        val initiator = userService.getCurrentUser(initiatorUsername)
        val trade = tradeRepository.findById(tradeId)
            .orElseThrow { IllegalArgumentException("Trade not found") }

        if (trade.initiator.id != initiator!!.id) {
            return TradeResponse(
                success = false,
                message = "You are not authorized to cancel this trade",
                trade = null
            )
        }

        if (trade.status != TradeStatus.PENDING) {
            return TradeResponse(
                success = false,
                message = "This trade is no longer pending",
                trade = null
            )
        }

        trade.status = TradeStatus.CANCELLED
        trade.completedAt = LocalDateTime.now()
        val cancelledTrade = tradeRepository.save(trade)

        return TradeResponse(
            success = true,
            message = "Trade cancelled",
            trade = mapToTradeDto(cancelledTrade)
        )
    }

    fun getPendingTradesForUser(username: String): List<TradeDto> {
        val user = userService.getCurrentUser(username)
        return tradeRepository.findByUserAndStatus(user!!, TradeStatus.PENDING)
            .map { mapToTradeDto(it) }
    }

    fun getAllTradesForUser(username: String): List<TradeDto> {
        val user = userService.getCurrentUser(username)
        return tradeRepository.findByInitiatorOrReceiver(user!!, user)
            .sortedByDescending { it.createdAt }
            .map { mapToTradeDto(it) }
    }

    private fun mapToTradeDto(trade: Trade): TradeDto {
        return TradeDto(
            id = trade.id!!,
            initiatorUsername = trade.initiator.username,
            initiatorDisplayName = trade.initiator.displayName,
            receiverUsername = trade.receiver.username,
            receiverDisplayName = trade.receiver.displayName,
            offeredPokemon = mapToCaughtPokemonDto(trade.offeredPokemon),
            requestedPokemon = mapToCaughtPokemonDto(trade.requestedPokemon),
            status = trade.status.name,
            createdAt = trade.createdAt.format(DATE_FORMATTER),
            completedAt = trade.completedAt?.format(DATE_FORMATTER)
        )
    }

    private fun mapToCaughtPokemonDto(pokemon: com.pokemon.catcher.model.CaughtPokemon): CaughtPokemonDto {
        return CaughtPokemonDto(
            id = pokemon.id!!,
            pokemonId = pokemon.pokemonId,
            name = pokemon.name,
            imageUrl = pokemon.imageUrl,
            types = pokemon.types,
            caughtAt = pokemon.caughtAt.format(DATE_FORMATTER)
        )
    }
}
