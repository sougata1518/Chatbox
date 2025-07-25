package server.example.chatroom.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import server.example.chatroom.Model.User;
import server.example.chatroom.Repositary.UserRepositary;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepositary userRepositary;
    public User saveUser(User user){
        User Username = userRepositary.findByUsername(user.getUsername());
        if(Username != null){
            return Username;
        }
        return userRepositary.save(user);
    }
    public List<User> getAllUser(){
        return userRepositary.findAll();
    }
}
