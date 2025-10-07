package project.repo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RepoApplication {
    public static void main(String[] args) {
        SpringApplication.run(RepoApplication.class, args);
        System.out.println("✅ Spring Boot started successfully on http://localhost:8080");
    }
}
