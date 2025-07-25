package server.example.chatroom.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import server.example.chatroom.Model.User;
import server.example.chatroom.Service.UserService;

import java.util.List;

@CrossOrigin("*")
@RestController
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/saveUser")
    public User saveUserData(@RequestBody User user){
        return userService.saveUser(user);
    }

    @GetMapping("/getUsers")
    public List<User> getAllUsers(){
        return userService.getAllUser();
    }
}
