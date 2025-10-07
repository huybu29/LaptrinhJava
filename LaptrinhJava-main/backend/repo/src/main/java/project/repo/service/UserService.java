package project.repo.service;

import java.util.List;
import org.springframework.stereotype.Service;
import project.repo.entity.User;
import project.repo.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    public String getGreeting() {
        return "Hello from Service Layer — no DB needed!";
    }

    public List<User> getAllUsers() {
        return repo.findAll();
    }
}
