package server.example.chatroom.Repositary;

import org.springframework.data.jpa.repository.JpaRepository;
import server.example.chatroom.Model.User;

public interface UserRepositary extends JpaRepository<User,Integer> {

    User findByUsername(String username);

}
