import React, {useEffect} from "react";
import * as io from "socket.io-client"; // import all req for typescript
import Button from "@mui/material/Button"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from "@mui/material/CardActions";

//connection to backend server
const socket = io.connect("http://localhost:3001");
let message = "";

//game result message card
const card = (
    <React.Fragment>
      <CardContent>
        <Typography variant="h5" component="div">
          {/* win or lose message */}
          {message}
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
    
    function handleClick(value: string) {
        
        console.log(value);
        socket.emit("user_choice", value);
    }

    useEffect(() => {
        //use this to receive game results
        socket.on("game_result", (gameResult) => {
            
            //game result logic
            if (gameResult == "Win") {
                message = "You Won!";
            } else {
                message = "You Lost!"
            }
        })
    },[socket])
    
    return (
        <>
            <Button 
            variant="contained"
            onClick = {() => handleClick("Rock")}
            value = "Rock" >  
                Rock
            </Button>
            
            <Button 
            variant="contained"
            onClick = {() => handleClick("Paper")}
            value = "Paper" >
                Paper
            </Button>
            
            <Button 
            variant="contained"
            onClick = {() => handleClick("Scissor")}
            value = "Scissor" >
                Scissor
            </Button>

            <Card 
            variant="outlined" > {card} </Card>
        </>

    )
};
