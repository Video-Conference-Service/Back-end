package com.ssafy.api.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.api.dto.ChatMessage;
import com.ssafy.api.request.ChattingMessagePostReq;
import com.ssafy.api.response.ChattingMessageRes;
import com.ssafy.api.service.ChatService;
import com.ssafy.api.service.ChattingMessageService;
import com.ssafy.db.entity.ChattingMessage;
import com.ssafy.db.repository.ChattingMessageRepository;
import com.ssafy.db.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/chatting")
public class MessageController {

    private final SimpMessageSendingOperations sendingOperations;

    private final ChatService chattingRoomService;
    private final ChattingMessageService chattingMessageService;
    private final ChattingMessageRepository chattingMessageRepository;
    private final UserRepository userRepository;
    
    @PostMapping("/send")
    public void sendMessage(@RequestBody ChattingMessagePostReq messageReq) throws Exception {
    	ChattingMessage message = ChattingMessage.builder()
    			.userId(messageReq.getUser_id())
    			.content(messageReq.getMessage())
    			.chattingRoom(chattingRoomService.findByChatId(messageReq.getChattingroom_id()))
    			.build();
    	message = chattingMessageRepository.save(message);
    	List<ChattingMessage> messages = chattingMessageService.findByChattingRoomId(message.getChattingRoom().getId());
    	List<ChattingMessageRes> list = new ArrayList<>();
    	for(ChattingMessage m : messages) {
    		ChattingMessageRes chat = ChattingMessageRes.builder()
    				.type(m.getType())
        			.userId(m.getUserId())
        			.userName(chattingMessageService.findUserName(message.getChattingRoom(), m.getUserId()))
        			.message(m.getContent())
        			.createdTime(m.getCreatedTime().toString())
        			.build();
    		list.add(chat);
    	}
    	sendingOperations.convertAndSend("/topic/chat/room/"+message.getChattingRoom().getId(), list);
    }
    
    @MessageMapping("/chat/message")
    public void enter(ChatMessage message) {
        if (ChatMessage.MessageType.ENTER.equals(message.getType())) {
            message.setMessage(message.getUserName()+"님이 입장하였습니다.");
        }
        ChattingMessage chat = ChattingMessage.builder()
        		.type(message.getType().toString())
        		.userId(222222L)
        		.chattingRoom(chattingRoomService.findByChatId(message.getChatRoomId()))
        		.content(message.getMessage())
        		.build();
        chattingMessageRepository.save(chat);
        
        sendingOperations.convertAndSend("/topic/chat/room/"+message.getChatRoomId(),message);
    }
}
