package com.pokemon.catcher

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class PokemonCatcherApplication

fun main(args: Array<String>) {
    runApplication<PokemonCatcherApplication>(*args)
}
