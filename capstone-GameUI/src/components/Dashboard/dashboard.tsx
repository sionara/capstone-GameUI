import React from "react";
import ResponsiveAppBar from "./nav";
import Button from "@mui/material/Button";
import * as io from "socket.io-client"


const socket = io.connect("http://localhost:3001");

export const Dashboard = () => {
  
  function createGameRoom() {
    
    // emits event to create a room with id of room1
    socket.emit("join_room", "room1")
    // when another user joins, this should take us to game page.

  };
  
  return (
    <>
      <header>
        <ResponsiveAppBar />
      </header>
      <h1>This is the dashboard</h1>
      
      <Button 
      variant= "contained"
      onClick={createGameRoom}> Play 1V1 Rock Paper Scissors! </Button>
      <div>
        more content
      </div>
      <div>
        more content
      </div>
      <div>
        more content
      </div>
      <div>
        more content
      </div>
      <div>
        more content
      </div>
      <div>
        more content
      </div>
    </>
  )
}