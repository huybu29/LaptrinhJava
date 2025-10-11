package project.repo.controllers;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import project.repo.service.UserService;
import project.repo.dtos.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor

public class UserController {
  private final UserService userService;
  @GetMapping("/{id}")
  public UserDTO getUserById(@PathVariable Long id) {
      return userService.getUserById(id);
  }  
}
