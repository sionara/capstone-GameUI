import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import * as io from "socket.io-client";
import { useNavigate, createSearchParams } from "react-router-dom";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Paper } from "@mui/material";

export const Lobby = () => {
  //global variables should be inside function
  const navigate = useNavigate();
  const [gameRooms, setgameRooms] = useState<string[]>([]);
  const [socket, setSocket] =
    useState<io.Socket<DefaultEventsMap, DefaultEventsMap>>();

  const makeid = (length: number) => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  };

  const joinRoom = (room: string) => {
    // emits event to create a room with id of room1
    // socket!.emit("join_game", room);
    navigate({
      pathname: "/s/game",
      search: createSearchParams({
        room: room,
      }).toString(),
    });
  };

  const handleCreateRoom = () => {
    const roomName = makeid(4);
    //display some form to fill out to create a room
    socket!.emit("create_room", roomName);
  };

  const refreshList = () => {
    socket!.emit("get_rooms");
  };
  // register functions to handle responses from server here
  useEffect(() => {
    const _socket = io.connect(import.meta.env.VITE_GAMESERVER_URL);

    setSocket(_socket);

    console.log("Created connection");

    //when user creates room. rendered before initial get_rooms call.
    _socket.on("send_rooms", (rooms: any) => {
      setgameRooms(rooms);
      console.log("display rooms ran.");
      console.log(gameRooms);
    });

    // when user presses join room
    _socket.on("display_game", () => {
      // console.log("Redirected to Game page");
      // navigate('/game');
    });

    // first fetch when user enters lobby page. rendered after receiver (send_rooms)
    _socket.emit("get_rooms");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const returnToDash = () => {
    navigate("/s/dashboard");
  };

  return (
    <>
      <Button variant="contained" onClick={returnToDash}>
        Back to DashBoard
      </Button>
      <Container>
        <Paper elevation={4}>
          <Box sx={{ border: 1 }}>
            <List className="gameRooms">
              {gameRooms.map((room) => (
                <ListItem key={room}>
                  {room}
                  <Button onClick={() => joinRoom(room)}>Join Room</Button>
                </ListItem>
              ))}
            </List>
            <Button variant="contained" onClick={handleCreateRoom}>
              Create Room
            </Button>
            <Button variant="contained" onClick={refreshList}>
              Refresh List
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
};
