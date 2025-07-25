package server.example.chatroom.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import server.example.chatroom.Model.ChatMessage;
import server.example.chatroom.Repositary.ChatRepositary;

import java.util.List;

@Service
public class ChatService {

    @Autowired
    private ChatRepositary chatRepositary;

    public void saveChat(ChatMessage chatMessage){
        chatRepositary.save(chatMessage);
    }

    public List<ChatMessage> fetchSenderAndRecipient(String sender,String recipient){
        return chatRepositary.findBySenderAndRecipient(sender,recipient);
    }
}
