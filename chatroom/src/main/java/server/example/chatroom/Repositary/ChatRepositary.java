package server.example.chatroom.Repositary;

import org.springframework.data.jpa.repository.JpaRepository;
import server.example.chatroom.Model.ChatMessage;

import java.util.List;

public interface ChatRepositary extends JpaRepository<ChatMessage,Integer> {
    List<ChatMessage> findBySenderAndRecipient(String sender,String recipient);
    List<ChatMessage> findByRecipientAndSender(String recipient,String sender);
}
