package server.example.chatroom.Dto;

public class VcRequest {
    private String sender;
    private String recipient;
    private boolean accept;
    private boolean decline;
    public VcRequest(String sender, String recipient, boolean accept, boolean decline) {
        this.sender = sender;
        this.recipient = recipient;
        this.accept = accept;
        this.decline = decline;
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

    public boolean getAccept() {
        return accept;
    }

    public void setAccept(boolean accept) {
        this.accept = accept;
    }

    public boolean getDecline() {
        return decline;
    }

    public void setDecline(boolean decline) {
        this.decline = decline;
    }
}
