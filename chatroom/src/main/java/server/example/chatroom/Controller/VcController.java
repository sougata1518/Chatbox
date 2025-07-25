package server.example.chatroom.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import server.example.chatroom.Dto.VcRequest;
import server.example.chatroom.Dto.VideoCallSignal;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin("*")
@RestController
@RequestMapping("/call")
public class VcController {
    private Map<String, VcRequest> call_map = new HashMap<>();
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @PostMapping("/request")
    public void requestCall(@RequestBody VcRequest vcRequest){
        call_map.put(vcRequest.getRecipient(), vcRequest);
    }

    @GetMapping("/status/{username}")
    public ResponseEntity<VcRequest> getStatus(@PathVariable String username){
        VcRequest request = call_map.get(username);
        if(request==null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(request);
    }

    @PostMapping("/respond")
    public void respond(@RequestBody VcRequest vcRequest){
        call_map.put(vcRequest.getRecipient(), vcRequest);
    }

    @DeleteMapping("/clear/{username}")
    public void clearRequestCall(@PathVariable String username){
        call_map.remove(username);
    }

    @MessageMapping("/video-signal")
    public void handleVideoSignal(@Payload VideoCallSignal signal){
        simpMessagingTemplate.convertAndSendToUser(
                signal.getTo(),
                "/queue/video",
                signal
        );
    }
}
