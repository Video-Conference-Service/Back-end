package com.ssafy.db.entity;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 채팅 메세지 모델 정의.
 */
@DynamicInsert @DynamicUpdate
@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChattingMessage extends BaseEntity {

	@ManyToOne
//	@JoinColumn(name = "chat_room_id", insertable = false, updatable=false)
	private ChattingRoom chattingRoom;
	
	@Column(columnDefinition = "char(10) DEFAULT 'TALK'")
	private String type;
	
	@Column(updatable = false, nullable = false, length=255)
	private String content;
	
	@ManyToOne
//	@Column(updatable = false, nullable = false, columnDefinition = "INT UNSIGNED")
	private User user;
		
	@Temporal(TemporalType.TIMESTAMP)
	@Column(updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
	private Date createdTime;
	    
	@PrePersist
	protected void onCreate() {
	  	createdTime = Timestamp.valueOf(LocalDateTime.now());
	}
}