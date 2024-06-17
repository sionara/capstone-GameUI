import { useEffect, useState, useContext } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Chat } from "../Chat/Chat";
import rock from "../../assets/rock.svg";
import paper from "../../assets/paper.svg";
import scissor from "../../assets/scissor.svg";
import Box from "@mui/material/Box";
import { useReadLocalStorage } from "usehooks-ts";
import { SocketContext } from "../../context/Context";

export const Game = () => {
  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const userName = useReadLocalStorage("username") as string;

  //list of players in game room
  const [players, setPlayers] = useState<string[]>([]);

  // state data passed from lobby page
  const [searchparams] = useSearchParams();

  const room = searchparams.get("room");

  // socket client from context
  const socket = useContext(SocketContext);

  const [result, setResult] = useState("");

  const [player1Wins, setPlayer1Wins] = useState(0);
  const [player2Wins, setPlayer2Wins] = useState(0);

  // sends user input to server
  function handleClick(userChoice: string) {
    setIsClicked(true);
    socket!.emit("user_choice", {
      room: room,
      username: userName,
      input: userChoice,
    });
  }

  const restartGame = () => {
    setResult("");
    setIsClicked(false);
    setIsGameOver(false);
  };

  const returnToLobby = () => {
    navigate("/s/lobby");
  };

  useEffect(() => {
    //connect to server
    // const sk = io.connect(import.meta.env.VITE_GAMESERVER_URL); --- used with .env and .env.production files enabled. tried another method for learning purposes
    // join room. uses room id passed as param from lobby to join the room here.
    socket.emit("join_room", {
      room: room,
      username: userName,
    });

    const displayPlayers = (users) => {
      setPlayers((prevPlayers) => {
        if (prevPlayers !== users) {
          return users;
        }
        return prevPlayers;
      });
    };

    socket.on("display_players", displayPlayers);

    socket.on("game_result", (gameResult) => {
      setResult(gameResult);

      // here should be some function to post game data to the db

      setIsGameOver(true);
    });

    socket.on("gameUpdate", (data) => {
      setPlayer1Wins(data.player1_wins);
      console.log("function ran");
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Box id="players">
          <List>
            {players.map((player, index) => (
              <ListItem key={index}>{player}</ListItem>
            ))}
          </List>
        </Box>
        {/* main content */}
        <Box>
          <Typography variant={"h6"} sx={{ mb: "1em" }}>
            Click on one of the buttons below to declare your hand!
          </Typography>
          <Box
            sx={{ display: "flex", gap: "1em", justifyContent: "space-around" }}
          >
            <Button
              variant="contained"
              onClick={() => handleClick("Rock")}
              value="Rock"
              disabled={isClicked}
              startIcon={<img src={rock} width={"25em"}></img>}
            >
              Rock
            </Button>

            <Button
              variant="contained"
              onClick={() => handleClick("Paper")}
              value="Paper"
              disabled={isClicked}
              startIcon={<img src={paper} width={"25em"}></img>}
            >
              Paper
            </Button>

            <Button
              variant="contained"
              onClick={() => handleClick("Scissor")}
              value="Scissor"
              disabled={isClicked}
              startIcon={<img src={scissor} width={"25em"}></img>}
            >
              Scissor
            </Button>
          </Box>
          <Card sx={{ my: 4 }}>
            <CardContent>
              <Typography variant="h4">
                Match Result: <strong>{result}</strong>
              </Typography>
            </CardContent>
          </Card>
          {isClicked && <p>Waiting for Other Player...</p>}
          {isGameOver && (
            <Button variant="contained" onClick={restartGame}>
              Replay
            </Button>
          )}
          {isGameOver && (
            <Button variant="contained" onClick={returnToLobby}>
              Return to Lobby
            </Button>
          )}

          {socket && (
            /* @ts-ignore */
            <Chat room={room} socket={socket} username={userName} />
          )}
        </Box>
      </Box>
    </>
  );
};
