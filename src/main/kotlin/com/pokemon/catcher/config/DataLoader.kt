package com.pokemon.catcher.config

import com.pokemon.catcher.model.User
import com.pokemon.catcher.repository.UserRepository
import com.pokemon.catcher.service.AuthService
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component

@Component
class DataLoader(
    private val userRepository: UserRepository,
    private val authService: AuthService
) : CommandLineRunner {

    override fun run(vararg args: String?) {
        // Initialize default users if database is empty
        if (userRepository.count() == 0L) {
            val defaultUsers = listOf(
                User(username = "ash", displayName = "Ash Ketchum", passwordHash = authService.hashPassword("password")),
                User(username = "misty", displayName = "Misty", passwordHash = authService.hashPassword("password")),
                User(username = "brock", displayName = "Brock", passwordHash = authService.hashPassword("password")),
                User(username = "gary", displayName = "Gary Oak", passwordHash = authService.hashPassword("password"))
            )

            userRepository.saveAll(defaultUsers)
            println("Initialized ${defaultUsers.size} default users (password: 'password')")
        }
    }
}
