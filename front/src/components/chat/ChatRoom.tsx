import {
  AccordionSummary,
  Button,
  CardContent,
  List,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import chatApi from "../../apis/chatApi";
import { ChatMessageRes } from "../../apis/response/chatRes";
import { ChatBlock } from "./ChatBlock";
import "./style.css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import { styled } from "@mui/material/styles";
import useScrollToBottomRef from "../../hooks/useScrollToBottomRef";
import { grey } from "@mui/material/colors";
import SendIcon from "@mui/icons-material/Send";
import SockJS from "sockjs-client";
import * as Stomp from "stompjs";
import { useSelector } from "react-redux";
import { formatDate } from "../../utils/day";
import { WS_BASE_URL } from '../../apis/axiosInstance';

type ChatType = "all" | "gender";

interface IProps {
  chatType: ChatType;
  isOpened: boolean;
  onClickHeader?: () => void;
  maxHeight: string;
  chattingRoomId: number;
  foldable?: boolean;
}

export const ChatRoom: FC<IProps> = ({
  chatType,
  isOpened,
  onClickHeader,
  maxHeight,
  chattingRoomId,
  foldable = true,
}) => {
  const [chatList, setChatList] = useState<ChatMessageRes[]>([]);
  const userId = useSelector((state: any) => state.user.userId);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const socket = new SockJS(WS_BASE_URL);
    const client = Stomp.over(socket);
    client.connect({}, () => {
      client.subscribe(`/topic/chatting/receive/${chattingRoomId}`, (res) => {
        setChatList(JSON.parse(res.body));
      });

      chatApi.sendMessage({
        chattingroom_id: chattingRoomId,
        chat_type: "ENTER",
        user_id: userId,
        message: "ENTER",
      });
    });

    return () => {
      chatApi.sendMessage({
        chattingroom_id: chattingRoomId,
        chat_type: "LEAVE",
        user_id: userId,
        message: "LEAVE",
      });
    };
  }, [chattingRoomId, userId]);

  const chatBodyRef = useScrollToBottomRef();
  const chatInputRef = useScrollToBottomRef();

  const onKeyUp = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      sendMessage();
    }
  };

  const onKeyDown = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
    }
  };

  const [message, setMessage] = useState("");
  const sendMessage = () => {
    if (!message) {
      return;
    }

    chatApi.sendMessage({
      chattingroom_id: chattingRoomId,
      chat_type: "TALK",
      user_id: userId,
      message,
    });
    setMessage("");
  };

  return (
    <ChatRoomPresenter
      userId={userId}
      title={chatType === "all" ? "전체 채팅" : "성별 채팅"}
      chatList={chatList}
      isOpened={isOpened}
      onClickHeader={onClickHeader}
      maxHeight={maxHeight}
      chatBodyRef={chatBodyRef}
      chatInputRef={chatInputRef}
      message={message}
      onChangeMessage={(s: string) => setMessage(s)}
      onKeyUp={onKeyUp}
      onKeyDown={onKeyDown}
      sendMessage={sendMessage}
      foldable={foldable}
    />
  );
};

interface IPresenterProps {
  userId: number;
  title: string;
  chatList: Array<ChatMessageRes>;
  isOpened: boolean;
  onClickHeader?: () => void;
  maxHeight: string;
  chatBodyRef: any;
  chatInputRef: any;
  message: string;
  onChangeMessage: (s: string) => void;
  onKeyUp: (e: any) => void;
  onKeyDown: (e: any) => void;
  sendMessage: () => void;
  foldable: boolean;
}

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const ChatRoomPresenter: FC<IPresenterProps> = ({
  userId,
  title,
  chatList,
  isOpened,
  onClickHeader,
  maxHeight,
  chatBodyRef,
  chatInputRef,
  message,
  onChangeMessage,
  onKeyUp,
  onKeyDown,
  sendMessage,
  foldable
}) => {
  return (
    <Accordion
      className="chat"
      expanded={!foldable || isOpened}
      onChange={onClickHeader}
      sx={{
        flexGrow: isOpened ? 1 : 0,
        display: "flex",
        flexDirection: "column",
        maxHeight: maxHeight,
        borderRadius: "10px",
        bgcolor: grey[50],
      }}
    >
      <AccordionSummary expandIcon={foldable && <ExpandMoreIcon />}>
        <Typography align="inherit">{title}</Typography>
      </AccordionSummary>

      <List ref={chatBodyRef} sx={{ flexGrow: "1", bgcolor: grey[50], overflow: "auto" }}>
        {chatList.map((it, idx) => {
          const formatedTime = formatDate(it.created_time, "A h:mm");
          return (
            <ChatBlock
              key={idx}
              chatMessageRes={it}
              order={it.user_id === userId ? "right" : "left"}
              showName={
                idx === 0 ||
                chatList[idx - 1].user_id !== it.user_id ||
                chatList[idx - 1].created_time !== it.created_time
              }
              showTime={
                idx === chatList.length - 1 ||
                chatList[idx + 1].user_id !== it.user_id ||
                formatDate(chatList[idx + 1].created_time, "A h:mm") !== formatedTime
              }
              formatedTime={formatedTime}
            />
          );
        })}
      </List>

      <CardContent
        sx={{ borderBottomLeftRadius: "10px", borderBottomRightRadius: "10px", bgcolor: "#D9D9D9" }}
      >
        <Stack direction="row" spacing={1}>
          <TextField
            ref={chatInputRef}
            InputProps={{ className: "chat__input" }}
            inputProps={{ className: "chat__input__textarea" }}
            multiline
            fullWidth={true}
            rows={2}
            placeholder="여기 채팅 메시지를 입력하세요."
            value={message}
            onChange={(e: any) => onChangeMessage(e.target.value)}
            onKeyUp={onKeyUp}
            onKeyDown={onKeyDown}
          />
          <Button variant="contained" onClick={sendMessage} disabled={!message}>
            <SendIcon />
          </Button>
        </Stack>
      </CardContent>
    </Accordion>
  );
};