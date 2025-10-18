package com.pokemon.catcher.controller

import com.pokemon.catcher.dto.TradeDto
import com.pokemon.catcher.dto.TradeOfferRequest
import com.pokemon.catcher.dto.TradeResponse
import com.pokemon.catcher.service.TradeService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/trades")
class TradeController(
    private val tradeService: TradeService
) {

    @PostMapping("/offer")
    fun offerTrade(
        @RequestHeader("X-Username", defaultValue = "default") username: String,
        @RequestBody request: TradeOfferRequest
    ): ResponseEntity<TradeResponse> {
        return ResponseEntity.ok(tradeService.offerTrade(username, request))
    }

    @PostMapping("/{id}/accept")
    fun acceptTrade(
        @PathVariable id: Long,
        @RequestHeader("X-Username", defaultValue = "default") username: String
    ): ResponseEntity<TradeResponse> {
        return ResponseEntity.ok(tradeService.acceptTrade(id, username))
    }

    @PostMapping("/{id}/reject")
    fun rejectTrade(
        @PathVariable id: Long,
        @RequestHeader("X-Username", defaultValue = "default") username: String
    ): ResponseEntity<TradeResponse> {
        return ResponseEntity.ok(tradeService.rejectTrade(id, username))
    }

    @PostMapping("/{id}/cancel")
    fun cancelTrade(
        @PathVariable id: Long,
        @RequestHeader("X-Username", defaultValue = "default") username: String
    ): ResponseEntity<TradeResponse> {
        return ResponseEntity.ok(tradeService.cancelTrade(id, username))
    }

    @GetMapping("/pending")
    fun getPendingTrades(
        @RequestHeader("X-Username", defaultValue = "default") username: String
    ): ResponseEntity<List<TradeDto>> {
        return ResponseEntity.ok(tradeService.getPendingTradesForUser(username))
    }

    @GetMapping
    fun getAllTrades(
        @RequestHeader("X-Username", defaultValue = "default") username: String
    ): ResponseEntity<List<TradeDto>> {
        return ResponseEntity.ok(tradeService.getAllTradesForUser(username))
    }
}
