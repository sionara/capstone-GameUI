import React, { useEffect, useState } from "react";
import * as io from "socket.io-client"; // import all req for typescript
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Chat } from "../Chat/Chat";

//game result message card
const card = (
  <React.Fragment>
    <CardContent>
      <Typography variant="h5" component="div">
        {/* win or lose message */}
        message
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        adjective
      </Typography>
      <Typography variant="body2">
        well meaning and kindly.
        <br />
        {'"a benevolent smile"'}
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small">Learn More</Button>
    </CardActions>
  </React.Fragment>
);

export function Game() {
  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

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
      input: userChoice,
    });
  }

  const restartGame = () => {
    setMessage("");
    setIsClicked(!isClicked);
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
    if (import.meta.env.DEV) {
      sk = io.connect("http://localhost:3001");
    } else {
      sk = io.connect("https://capstone-gameserver.onrender.com");
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
      <Button
        variant="contained"
        onClick={() => handleClick("Rock")}
        value="Rock"
        disabled={isClicked}
      >
        Rock
      </Button>

      <Button
        variant="contained"
        onClick={() => handleClick("Paper")}
        value="Paper"
        disabled={isClicked}
      >
        Paper
      </Button>

      <Button
        variant="contained"
        onClick={() => handleClick("Scissor")}
        value="Scissor"
        disabled={isClicked}
      >
        Scissor
      </Button>

      <Card variant="outlined"> {card} </Card>

      <p style={isClicked ? { display: "block" } : { display: "none" }}>
        Waiting for Other Player...
      </p>
      <p>Result: {message}</p>

      <Button
        variant="contained"
        onClick={restartGame}
        style={isGameOver ? { display: "block" } : { display: "none" }}
      >
        Replay
      </Button>
      <Button
        variant="contained"
        onClick={returnToLobby}
        style={isGameOver ? { display: "block" } : { display: "none" }}
      >
        Return to Lobby
      </Button>
      {/* @ts-ignore */}
      {socket && <Chat roomId={roomId} socket={socket} />}
    </>
  );
}
