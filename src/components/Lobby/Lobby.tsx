import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Chip, Paper, Typography } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import "./lobby.css";
import LoginIcon from "@mui/icons-material/Login";
import { yellow } from "@mui/material/colors";
import { ThemeProvider } from "@emotion/react";
import { SocketContext } from "../../context/Context";
import { getClientId } from "../../utils/clientId";

//create room button
import { CreateRoom } from "./CreateRoom";

const theme = createTheme({
  palette: {
    secondary: yellow,
  },
});

interface RoomSummary {
  code: string;
  status: "waiting" | "playing" | "finished";
  playerCount: number;
  bestOf: number;
}

interface JoinRoomResponse {
  ok: boolean;
  message?: string;
  room?: { code: string };
}

export const Lobby = () => {
  const navigate = useNavigate();
  const [gameRooms, setGameRooms] = useState<RoomSummary[]>([]);
  const [codeInput, setCodeInput] = useState("");
  const [error, setError] = useState("");

  const socket = useContext(SocketContext);

  const joinRoom = (code: string) => {
    setError("");
    socket.emit(
      "join_room",
      { code, clientId: getClientId() },
      (response: JoinRoomResponse) => {
        if (response.ok && response.room) {
          navigate({
            pathname: "/s/game",
            search: `code=${response.room.code}`,
          });
        } else {
          setError(response.message || "Could not join room");
        }
      }
    );
  };

  const joinByCode = () => {
    if (!codeInput.trim()) return;
    joinRoom(codeInput.trim().toUpperCase());
  };

  const refreshList = () => {
    socket!.emit("get_rooms");
  };

  useEffect(() => {
    const handleRooms = (rooms: RoomSummary[]) => {
      setGameRooms(rooms);
    };

    socket.on("send_rooms", handleRooms);
    socket.emit("get_rooms");

    return () => {
      socket.off("send_rooms", handleRooms);
    };
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
                {gameRooms.length === 0 && (
                  <ListItem sx={{ justifyContent: "center" }}>
                    <Typography color="text.secondary">
                      No open rooms. Create one to get started!
                    </Typography>
                  </ListItem>
                )}
                {gameRooms.map((room) => (
                  <ListItem sx={{ justifyContent: "center" }} key={room.code}>
                    <Typography sx={{ mr: 1 }}>{room.code}</Typography>
                    <Chip
                      size="small"
                      label={`Best of ${room.bestOf}`}
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      size="small"
                      color={room.status === "playing" ? "warning" : "success"}
                      label={`${room.status} ${room.playerCount}/2`}
                      sx={{ mr: 1 }}
                    />
                    <Button
                      variant="contained"
                      endIcon={<LoginIcon />}
                      onClick={() => joinRoom(room.code)}
                      size="small"
                      disabled={room.status !== "waiting"}
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

          {error && (
            <Typography color="error" sx={{ mt: 1, textAlign: "center" }}>
              {error}
            </Typography>
          )}

          <Box
            className="buttons-container"
            sx={{ alignItems: "center", gap: "0.5em" }}
          >
            <CreateRoom />
            <TextField
              size="small"
              label="Room code"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
              inputProps={{ maxLength: 4 }}
            />
            <Button variant="contained" onClick={joinByCode}>
              Join by Code
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
