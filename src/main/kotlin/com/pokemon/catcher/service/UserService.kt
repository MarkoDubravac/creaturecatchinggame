package com.pokemon.catcher.service

import com.pokemon.catcher.model.User
import com.pokemon.catcher.repository.UserRepository
import org.springframework.stereotype.Service

@Service
class UserService(
    private val userRepository: UserRepository
) {
    fun getCurrentUser(username: String): User? {
        return userRepository.findByUsername(username).orElse(null)
    }

    fun getAllUsers(): List<User> {
        return userRepository.findAll()
    }

    fun getUserById(id: Long): User? {
        return userRepository.findById(id).orElse(null)
    }
}
