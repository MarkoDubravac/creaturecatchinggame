package com.pokemon.catcher.service

import com.pokemon.catcher.model.User
import com.pokemon.catcher.repository.UserRepository
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val userRepository: UserRepository
) {
    private val passwordEncoder = BCryptPasswordEncoder()

    fun register(username: String, displayName: String, password: String): User? {
        // Check if username already exists
        if (userRepository.findByUsername(username).isPresent) {
            return null
        }

        val passwordHash = passwordEncoder.encode(password)
        val user = User(
            username = username,
            displayName = displayName,
            passwordHash = passwordHash
        )

        return userRepository.save(user)
    }

    fun login(username: String, password: String): User? {
        val userOptional = userRepository.findByUsername(username)

        if (userOptional.isEmpty) {
            return null
        }

        val user = userOptional.get()

        return if (passwordEncoder.matches(password, user.passwordHash)) {
            user
        } else {
            null
        }
    }

    fun hashPassword(password: String): String {
        return passwordEncoder.encode(password)
    }
}
