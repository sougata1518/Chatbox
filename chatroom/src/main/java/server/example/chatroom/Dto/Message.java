package server.example.chatroom.Dto;

public class Message {
    private String sender;
    private String recipient;
    private String content;
    private String msgTime;
    public Message(){}

    public Message(String sender, String recipient, String content, String msgTime) {
        this.sender = sender;
        this.recipient = recipient;
        this.content = content;
        this.msgTime = msgTime;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getRecipient() {
        return recipient;
    }

    public void setRecipient(String recipient) {
        this.recipient = recipient;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getMsgTime() {
        return msgTime;
    }

    public void setMsgTime(String msgTime) {
        this.msgTime = msgTime;
    }
}
