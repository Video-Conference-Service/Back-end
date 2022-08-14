package com.ssafy.api.request;

import com.google.gson.JsonParser;

import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("AvatarCustomRequest")
public class AvatarCustomReq {

	Long user_id;
	String name;
	String base64;
	Long slot;
	JsonParser pic_info;
}
