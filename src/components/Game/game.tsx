import { useEffect, useState } from "react";
import * as io from "socket.io-client"; // import all req for typescript
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import { useSearchParams, useNavigate } from "react-router-dom";
import { Chat } from "../Chat/Chat";
import rock from "../../assets/rock.svg";
import paper from "../../assets/paper.svg";
import scissor from "../../assets/scissor.svg";
import Box from "@mui/material/Box";
import { useReadLocalStorage } from "usehooks-ts";

export function Game() {
  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const userName = useReadLocalStorage("username");

  // state data passed from lobby page
  const [searchparams] = useSearchParams();

  const roomId = searchparams.get("room");
  // console.log(searchparams.get("room"));
  const [socket, setSocket] = useState<io.Socket<any, any>>();
  const [message, setMessage] = useState("");

  // sends user input to server
  function handleClick(userChoice: string) {
    setIsClicked(true);
    socket!.emit("user_choice", {
      roomId: roomId,
      username: userName,
      input: userChoice,
    });
  }

  const restartGame = () => {
    setMessage("");
    setIsClicked(false);
    setIsGameOver(false);
  };

  const returnToLobby = () => {
    navigate("/s/lobby");
  };

  useEffect(() => {
    //connect to server
    // const sk = io.connect(import.meta.env.VITE_GAMESERVER_URL); --- used with .env and .env.production files enabled. tried another method for learning purposes

    // used different variable to differenciate socket variable in this useEffect scope
    let sk;

    // checking environment to conditionally use different server URL
    // if (import.meta.env.DEV) {
    //   sk = io.connect("http://localhost:3001");
    // } else {
    //   sk = io.connect("https://capstone-gameserver.onrender.com");
    // }
    if (window.navigator.userAgent.includes("Android")) {
      sk = io.connect("https://a0b1-67-71-196-232.ngrok-free.app");
    } else {
      sk = io.connect("http://localhost:3001");
    }

    setSocket(sk);

    sk.on("game_result", (gameResult) => {
      console.log(gameResult);
      setMessage(gameResult);
      setIsGameOver(true);
    });

    // join room
    sk.emit("join_room", roomId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Typography variant={"h6"} sx={{ mb: "1em" }}>
        Click on one of the buttons below to declare your hand!
      </Typography>
      <Box sx={{ display: "flex", gap: "1em", justifyContent: "space-around" }}>
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
            Match Result: <strong>{message}</strong>
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
      {/* @ts-ignore */}
      {socket && <Chat roomId={roomId} socket={socket} username={userName} />}
    </>
  );
}
