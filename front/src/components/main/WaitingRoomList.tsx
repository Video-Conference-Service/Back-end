import React, { FC, useCallback, useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import SearchIcon from "@mui/icons-material/Search";
import { WaitingRoomInfoRes } from "../../apis/response/waitingRoomRes";
import * as Stomp from "stompjs";
import SockJS from "sockjs-client";
import { useDispatch, useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import ava2 from "../../assets/result_waiting_ava2.gif";
import { Box, Button, IconButton, InputBase, Stack, ToggleButton, Typography } from "@mui/material";
import { WS_BASE_URL } from "../../apis/axiosInstance";
import { requestEnterRoomApi } from "../../apis/waitingRoomApi";
import { ResultWaitingModal } from "../waitingRoom/ResultWaitingModal";
import {
  setWaitingRoomId,
  setRoomName,
  setAge,
  setRegion,
  setMaster,
  setHeadCount,
} from "../../stores/slices/waitingSlice";
import { useNavigate } from "react-router";

interface IProps {}

/**
 * @author
 * @function @
 **/

interface Column {
  id: "name" | "cnt_man" | "cnt_woman" | "age" | "sido" | "status";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: any) => string;
}

const columns: Column[] = [
  { id: "name", label: "방제목", minWidth: 170 },
  {
    id: "cnt_man",
    label: "남자",
    minWidth: 50,
    align: "right",
    format: (obj) => `${obj.cnt_man} / ${obj.head_count / 2}`,
  },
  {
    id: "cnt_woman",
    label: "여자",
    minWidth: 50,
    align: "right",
    format: (obj) => `${obj.cnt_woman} / ${obj.head_count / 2}`,
  },
  {
    id: "age",
    label: "나이",
    minWidth: 40,
    align: "right",
  },
  {
    id: "sido",
    label: "지역",
    minWidth: 170,
    align: "right",
  },

  {
    id: "status",
    label: "활성화상태",
    minWidth: 170,
    align: "right",
  },
];

export const WaitingRoomList: FC<IProps> = (props) => {
  const userId = useSelector((state: any) => state.user.userId);

  //소켓 통신----------------------------------------------
  const [originData, setOriginData] = useState<WaitingRoomInfoRes[]>([]);
  const [data, setData] = useState<WaitingRoomInfoRes[]>([]);
  const [stompClient, setStompClient] = useState<any>();

  //방제목으로 검색 & 필터-----------------------------------------------------------------
  const userGender = useSelector((state: any) => state.user.userGender);
  const [selected, setSelected] = useState(false);
  const handleChangeStatus = (
    event: React.MouseEvent<HTMLElement>,
    newRoom: WaitingRoomInfoRes[]
  ) => {
    setSelected((prev) => !prev);
  };

  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const searchByName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  useEffect(() => {
    if (stompClient) {
      return;
    }
    const socket = new SockJS(WS_BASE_URL);
    const client = Stomp.over(socket);
    client.connect({}, function (frame) {
      console.log("소켓 연결 성공", frame);

      client.subscribe("/topic/getList", function (response) {
        console.log(response.body);
        setOriginData(JSON.parse(response.body));
      });
      client.send("/app/getList", {}, "aaa");

      //대기방 입장신청 결과 소켓 통신
      client.subscribe(`/enter/result/${userId}`, function (response: { body: string }) {
        console.log(response.body);
        if (JSON.parse(response.body).success) {
          navigate("/waiting");
          //웨이팅방입장!!!!!
        } else {
          setopenWaiting(false);
        }
      });
    });

    setStompClient(client);
  }, [navigate, stompClient, userId]);

  useEffect(() => {
    setData(
      originData
        .filter((room) => {
          if (!selected) {
            return true;
          }

          if (room.status !== 0) {
            return false;
          }

          return (userGender === "M" ? room.cnt_max : room.cnt_woman) !== room.head_count / 2;
        })
        .filter((room) => room.name.includes(keyword))
    );
  }, [keyword, originData, selected, userGender]);

  const [roomId, setRoomId] = useState(0);

  const [openWaiting, setopenWaiting] = useState(false);
  const rejectRoom = () => {
    setopenWaiting(false);

    requestEnterRoomApi.requestEnterRoom({
      user_id: userId,
      room_id: roomId,
      type: 3,
    });
    console.log(roomId);
  };

  const dispatch = useDispatch();
  const enterRoom = (waitingRoomInfoRes: WaitingRoomInfoRes) => {
    setRoomId(waitingRoomInfoRes.id);

    requestEnterRoomApi.requestEnterRoom({
      user_id: userId,
      room_id: waitingRoomInfoRes.id,
      type: 2,
    });

    setopenWaiting(true);
    dispatch(setWaitingRoomId(waitingRoomInfoRes.id));
    dispatch(setRoomName(waitingRoomInfoRes.name));
    dispatch(setAge(waitingRoomInfoRes.age));
    dispatch(setRegion(waitingRoomInfoRes.sido));
    dispatch(setMaster(false));
    dispatch(setHeadCount(waitingRoomInfoRes.head_count));
  };

  //------------------------------------------------------------------------------------------
  return (
    <div>
      <Stack direction="row">
        <ToggleButton
          selected={selected}
          color="primary"
          onClick={handleChangeStatus}
          sx={{ marginRight: "auto", padding: "0", marginBottom: "1%" }}
          value="status"
        >
          참여가능한 방만 보기
        </ToggleButton>
        <Paper
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: 400,
            right: "10%",
            top: "12%",
            marginLeft: "auto",
            marginBottom: "1%",
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="방제목으로 검색해보세요"
            value={keyword}
            onChange={searchByName}
          />

          <IconButton sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
      </Stack>
      <Paper sx={{ overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: "50%" }}>
          <Table stickyHeader aria-label="sticky table" style={{ border: "5px ridge" }}>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((row, idx) => (
                <TableRow hover onClick={() => enterRoom(row)} key={idx}>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align}>
                      {column.format ? column.format(row) : row[column.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <ResultWaitingModal open={openWaiting} justifyContent={"center"}>
        <>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            width="100%"
            mb={4}
            sx={{ marginTop: "10%" }}
          >
            <img src={ava2} alt="ava2" />
            <Typography variant="h4">방장이 입장 심사 중 ~</Typography>
          </Box>

          <Button size="large" color="error" onClick={rejectRoom}>
            <CloseIcon /> 입장 대기 취소
          </Button>
        </>
      </ResultWaitingModal>
    </div>
  );
};