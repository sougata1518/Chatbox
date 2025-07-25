package server.example.chatroom.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import server.example.chatroom.Dto.Message;
import server.example.chatroom.Model.ChatMessage;
import server.example.chatroom.Service.ChatService;

import java.util.List;

@CrossOrigin("*")
@RestController
public class ChatController {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    @Autowired
    private ChatService chatService;

    @MessageMapping("/private-message")
    public void handleMessage(Message message){
        ChatMessage chatMessage = new ChatMessage(
                message.getSender(),
                message.getRecipient(),
                message.getContent(),
                message.getMsgTime()
        );
        chatService.saveChat(chatMessage);
        simpMessagingTemplate.convertAndSendToUser(
                message.getRecipient(),
                "/queue/message",
                message
        );
    }

    @GetMapping("/chatHistory/{user1}/{user2}")
    public List<ChatMessage> getChatHistory(
            @PathVariable String user1,
            @PathVariable String user2
    ){
        List<ChatMessage> senderToRecipient = chatService.fetchSenderAndRecipient(user1,user2);
        List<ChatMessage> recipientToSender = chatService.fetchSenderAndRecipient(user2,user1);
        senderToRecipient.addAll(recipientToSender);
        senderToRecipient.stream()
                .sorted((u1,u2) -> u1.getMsgTime().compareTo(u2.getMsgTime()))
                .toList();
        return senderToRecipient;
    }
}
