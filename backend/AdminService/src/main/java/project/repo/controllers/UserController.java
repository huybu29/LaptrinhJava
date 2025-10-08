package project.repo.controllers;

import java.util.List;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import project.repo.dtos.UserDTO;
import project.repo.service.UserService;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Validated
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
  private final UserService userService;
  @GetMapping
  public List<UserDTO> getAllUsers(){
    return userService.getAllUsers();
  }
  @PostMapping
  public UserDTO createUserDTO(@RequestBody UserDTO dto){
    return userService.createUser(dto);
  }
  @GetMapping("/{id}")
  public UserDTO getUserById(@RequestBody Long id){
    return userService.getUserById(id);
  } 
  @PutMapping("/{id}")
  public UserDTO updateUser(@PathVariable Long id, @RequestBody UserDTO dto){
    return userService.updateUser(id, dto);
  }
  @DeleteMapping("/{id}")
  public void deleteUser(@PathVariable Long id){
    userService.deleteUser(id);
  }
}
