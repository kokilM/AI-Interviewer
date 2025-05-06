package com.ai.SpringAiDemo2.controller;

import com.ai.SpringAiDemo2.model.User;
import com.ai.SpringAiDemo2.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") 
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            if (userRepository.existsByUsername(user.getUsername())) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Username already exists"));
            }

            if (userRepository.existsByEmail(user.getEmail())) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Email already exists"));
            }

            User savedUser = userRepository.save(user);
            
            return ResponseEntity.ok(Map.of(
                "message", "User registered successfully",
                "userId", savedUser.getId(),
                "username", savedUser.getUsername(),
                "email", savedUser.getEmail()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Error registering user: " + e.getMessage()));
        }
    }

    @GetMapping("/login/{username}/{password}")
    public ResponseEntity<?> login(@PathVariable String username, @PathVariable String password) {
        try {
            Optional<User> user = userRepository.findByUsernameAndPassword(username, password);
            
            if (user.isPresent()) {
                User foundUser = user.get();
                return ResponseEntity.ok(Map.of(
                    "id", foundUser.getId(),
                    "username", foundUser.getUsername(),
                    "email", foundUser.getEmail(),
                    "message", "Login successful"
                ));
            } else {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid username or password"));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Error during login: " + e.getMessage()));
        }
    }
}
