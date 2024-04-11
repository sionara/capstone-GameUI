import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import * as io from "socket.io-client";
import { useNavigate, createSearchParams } from "react-router-dom";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { IconButton, Paper, Typography } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import "./lobby.css";
import LoginIcon from "@mui/icons-material/Login";
import { yellow } from "@mui/material/colors";
import { ThemeProvider } from "@emotion/react";

const theme = createTheme({
  palette: {
    secondary: yellow,
  },
});

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
    // const sk = io.connect(import.meta.env.VITE_GAMESERVER_URL);

    // used different variable to differenciate socket variable in this useEffect scope
    let sk;

    // checking environment to conditionally use different server URL
    // if (import.meta.env.DEV) {
    //   sk = io.connect("http://localhost:3001");
    // } else {
    //   sk = io.connect("https://capstone-gameserver.onrender.com");
    // }

    if (window.navigator.userAgent.includes("Android")) {
      console.log("mobile");
      sk = io.connect("https://a0b1-67-71-196-232.ngrok-free.app");
    } else {
      console.log("desktop");
      sk = io.connect("http://localhost:3001");
    }

    setSocket(sk);

    console.log("Created connection");

    //when user creates room. rendered before initial get_rooms call.
    sk.on("send_rooms", (rooms: any) => {
      setgameRooms(rooms);
      console.log("display rooms ran.");
      console.log(gameRooms);
    });

    // when user presses join room
    sk.on("display_game", () => {
      // console.log("Redirected to Game page");
      // navigate('/game');
    });

    // first fetch when user enters lobby page. rendered after receiver (send_rooms)
    sk.emit("get_rooms");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const returnToDash = () => {
    navigate("/s/dashboard");
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Button variant="contained" onClick={returnToDash}>
          Back to DashBoard
        </Button>
        <Container sx={{ width: "100vw" }}>
          <Paper elevation={4}>
            <Box id="rooms-window">
              <List id="rooms-window-list">
                {gameRooms.map((room) => (
                  <ListItem sx={{ justifyContent: "center" }} key={room}>
                    {room}
                    <Button
                      variant="contained"
                      endIcon={<LoginIcon />}
                      onClick={() => joinRoom(room)}
                      size="small"
                      sx={{ mx: "0.5em" }}
                      color="secondary"
                    >
                      <Typography>Join</Typography>
                    </Button>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Paper>
          <Box className="buttons-container">
            <Button
              sx={{ mt: "1em" }}
              variant="contained"
              onClick={handleCreateRoom}
            >
              Create Room
            </Button>
            <Button variant="contained" onClick={refreshList}>
              Refresh List
            </Button>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
};
