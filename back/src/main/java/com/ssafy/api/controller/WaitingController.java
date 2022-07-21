package com.ssafy.api.controller;

import java.util.List;
import java.util.Map;

import org.apache.commons.collections4.map.HashedMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.api.service.SidoService;
import com.ssafy.api.service.WaitingRoomService;
import com.ssafy.api.service.WaitingRoomUserRelationService;
import com.ssafy.db.entity.Sido;
import com.ssafy.db.entity.User;
import com.ssafy.db.entity.WaitingRoom;
import com.ssafy.dto.WaitingRoomValue;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@Api(value = "미팅방 API", tags = {"waiting"})
@RestController
@RequestMapping("/api/v1/waiting")
public class WaitingController {
	
	@Autowired
	SidoService sidoService;
	
	@Autowired
	WaitingRoomService waitingRoomService;
	
	@Autowired
	WaitingRoomUserRelationService waitingRoomUserRelationService;
	
	
	@GetMapping("")
	@ApiOperation(value = "대기방 목록 조회", notes = "대기방 전부 보여줌.")
	public ResponseEntity<List<WaitingRoom>> waitingRoom() {
		List<WaitingRoom> waitingRoom = waitingRoomService.findAll();
		return new ResponseEntity<List<WaitingRoom>>(waitingRoom, HttpStatus.OK);
	}
	
	@GetMapping("/sido")
	@ApiOperation(value = "지역검색", notes = "지역목록 보여줌.")
	public ResponseEntity<List<Sido>> sido() {
		 List<Sido> sido = sidoService.findAll();
		return new ResponseEntity<List<Sido>>(sido, HttpStatus.OK);
		
	}
	
	@PostMapping("create")
	@ApiOperation(value = "대기방 생성", notes = "대기방을 생성합니다.")
	public void create(@RequestBody WaitingRoomValue value) {
		Map<String, Long> userRelation = new HashedMap<>();
		WaitingRoom waitingRoom = waitingRoomService.save(value);
		userRelation.put("user_id", value.getUser_id());
		waitingRoomUserRelationService.save(userRelation, waitingRoom);
	}
}
