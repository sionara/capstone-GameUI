import { useEffect, useRef, useState, useContext } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Chat } from "../Chat/Chat";
import rock from "../../assets/rock.svg";
import paper from "../../assets/paper.svg";
import scissor from "../../assets/scissor.svg";
import Box from "@mui/material/Box";
import { useReadLocalStorage } from "usehooks-ts";
import { SocketContext } from "../../context/Context";
import { getClientId } from "../../utils/clientId";

interface PlayerPublic {
  clientId: string;
  username: string;
  connected: boolean;
  hasChosen: boolean;
}

interface RoomState {
  code: string;
  status: "waiting" | "playing" | "finished";
  bestOf: number;
  firstTo: number;
  hostId: string;
  players: PlayerPublic[];
  score: Record<string, number>;
  winnerId: string | null;
  reason: string | null;
}

interface JoinRoomResponse {
  ok: boolean;
  message?: string;
  room?: RoomState;
}

interface RoundResult {
  choices: Record<string, string>;
  winnerId: string | null;
  score: Record<string, number>;
}

interface GameOverPayload {
  winnerId: string | null;
  reason: string | null;
  score: Record<string, number>;
}

export const Game = () => {
  const navigate = useNavigate();
  const userName = useReadLocalStorage("username") as string;
  const userId = useReadLocalStorage("userId") as string;
  const clientId = getClientId();

  const [searchparams] = useSearchParams();
  const code = searchparams.get("code");

  const socket = useContext(SocketContext);

  const [room, setRoom] = useState<RoomState | null>(null);
  const [joinError, setJoinError] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const [lastRound, setLastRound] = useState<RoundResult | null>(null);
  const [gameOver, setGameOver] = useState<GameOverPayload | null>(null);
  const [forfeitMessage, setForfeitMessage] = useState("");
  const [closedBanner, setClosedBanner] = useState("");

  // Mirrors `room` so the unmount cleanup always sees the latest status,
  // not whatever it was when the effect first ran.
  const roomRef = useRef<RoomState | null>(null);
  roomRef.current = room;

  function handleClick(userChoice: string) {
    if (!code) return;
    setIsClicked(true);
    socket!.emit("user_choice", {
      code,
      clientId,
      choice: userChoice,
    });
  }

  const returnToLobby = () => {
    navigate("/s/lobby");
  };

  const leaveGame = () => {
    if (code) {
      socket.emit("leave_room", { code, clientId });
    }
    navigate("/s/lobby");
  };

  useEffect(() => {
    if (!code) {
      setJoinError("No room code given.");
      return;
    }

    socket.emit(
      "join_room",
      { code, username: userName, userId, clientId },
      (response: JoinRoomResponse) => {
        if (response.ok && response.room) {
          setRoom(response.room);
        } else {
          setJoinError(response.message || "Could not join room");
        }
      }
    );

    const onRoomUpdate = (nextRoom: RoomState) => {
      setRoom(nextRoom);
      const me = nextRoom.players.find((p) => p.clientId === clientId);
      if (me && !me.hasChosen) {
        setIsClicked(false);
      }
    };

    const onRoundResult = (result: RoundResult) => {
      setLastRound(result);
      setIsClicked(false);
    };

    const onGameOver = (payload: GameOverPayload) => {
      setGameOver(payload);
    };

    const onOpponentLeft = (data: { message: string }) => {
      setForfeitMessage(data.message);
    };

    const onRoomClosed = (data: { message: string }) => {
      setClosedBanner(data.message || "This room has closed.");
      setRoom(null);
    };

    socket.on("room_update", onRoomUpdate);
    socket.on("round_result", onRoundResult);
    socket.on("game_over", onGameOver);
    socket.on("opponent_left", onOpponentLeft);
    socket.on("room_closed", onRoomClosed);

    return () => {
      socket.off("room_update", onRoomUpdate);
      socket.off("round_result", onRoundResult);
      socket.off("game_over", onGameOver);
      socket.off("opponent_left", onOpponentLeft);
      socket.off("room_closed", onRoomClosed);

      // Navigating away in-app (e.g. clicking a nav link) doesn't close the
      // socket - it's the same long-lived connection. If the match is still
      // live, leaving this page counts as leaving the game.
      if (code && roomRef.current && roomRef.current.status === "playing") {
        socket.emit("leave_room", { code, clientId });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  if (joinError) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h5" color="error" sx={{ mb: 2 }}>
          {joinError}
        </Typography>
        <Button variant="contained" onClick={returnToLobby}>
          Return to Lobby
        </Button>
      </Box>
    );
  }

  if (!room) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography>Connecting...</Typography>
      </Box>
    );
  }

  const me = room.players.find((p) => p.clientId === clientId);
  const opponent = room.players.find((p) => p.clientId !== clientId);
  const myScore = me ? room.score[me.clientId] ?? 0 : 0;
  const opponentScore = opponent ? room.score[opponent.clientId] ?? 0 : 0;

  return (
    <>
      <Dialog open={Boolean(closedBanner)}>
        <DialogTitle>Room closed</DialogTitle>
        <DialogContent>
          <Typography>{closedBanner}</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={returnToLobby}>
            Return to Lobby
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ display: "flex" }}>
        <Box id="players">
          <Typography variant="subtitle2">Room {room.code}</Typography>
          <List>
            {room.players.map((player) => (
              <ListItem key={player.clientId}>
                {player.username}
                {player.clientId === clientId ? " (You)" : ""}
                {!player.connected ? " - disconnected" : ""}
              </ListItem>
            ))}
          </List>
        </Box>
        {/* main content */}
        <Box>
          {room.status === "waiting" && (
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h5">Room code: {room.code}</Typography>
                <Typography>
                  Share this code with your opponent. Waiting for them to
                  join...
                </Typography>
              </CardContent>
            </Card>
          )}

          {room.status === "playing" && opponent && !opponent.connected && (
            <Typography color="warning.main" sx={{ mb: 2 }}>
              Opponent disconnected - waiting up to 15s for them to reconnect...
            </Typography>
          )}

          {room.status === "playing" && !gameOver && (
            <>
              <Typography variant={"h6"} sx={{ mb: "1em" }}>
                Best of {room.bestOf} - first to {room.firstTo} wins. Score:
                You {myScore} - {opponentScore} Opponent
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: "1em",
                  justifyContent: "space-around",
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => handleClick("rock")}
                  disabled={isClicked}
                  startIcon={<img src={rock} width={"25em"}></img>}
                >
                  Rock
                </Button>

                <Button
                  variant="contained"
                  onClick={() => handleClick("paper")}
                  disabled={isClicked}
                  startIcon={<img src={paper} width={"25em"}></img>}
                >
                  Paper
                </Button>

                <Button
                  variant="contained"
                  onClick={() => handleClick("scissors")}
                  disabled={isClicked}
                  startIcon={<img src={scissor} width={"25em"}></img>}
                >
                  Scissors
                </Button>
              </Box>

              {lastRound && (
                <Card sx={{ my: 4 }}>
                  <CardContent>
                    <Typography variant="h5">
                      {lastRound.winnerId === null
                        ? "Tie! Replay the round."
                        : lastRound.winnerId === clientId
                        ? "You won that round!"
                        : "Opponent won that round."}
                    </Typography>
                  </CardContent>
                </Card>
              )}

              {isClicked && <p>Waiting for Other Player...</p>}

              <Button variant="outlined" color="error" onClick={leaveGame}>
                Leave Game
              </Button>
            </>
          )}

          {gameOver && (
            <Card sx={{ my: 4 }}>
              <CardContent>
                <Typography variant="h4">
                  {gameOver.winnerId === null
                    ? "Game ended - no winner"
                    : gameOver.winnerId === clientId
                    ? "You Won!"
                    : "You Lost"}
                </Typography>
                <Typography variant="subtitle1">
                  Final score: {myScore} - {opponentScore}
                </Typography>
                {gameOver.reason === "forfeit" && forfeitMessage && (
                  <Typography color="warning.main">
                    {forfeitMessage}
                  </Typography>
                )}
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={returnToLobby}
                >
                  Return to Lobby
                </Button>
              </CardContent>
            </Card>
          )}

          {socket && (
            <Chat room={room.code} socket={socket} username={userName} />
          )}
        </Box>
      </Box>
    </>
  );
};
