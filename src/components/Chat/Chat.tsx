import { useState, useEffect } from "react";

// import { ChatMessageDto } from "./ChatMessageDto";
import {
  Box,
  Container,
  Divider,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import "./Chat.css";
import * as io from "socket.io-client";

import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  room: string;
  socket: io.Socket<any, any>;
  username: string;
}

export const Chat = ({ room, socket, username }: Props) => {
  const [allMessages, setAllMessages] = useState([]);
  const [message, setMessage] = useState("");
  const userName = username;
  const ENTERKEY = 13;
  // const scrollBottomRef = useRef(null);

  const ListMessages = allMessages.map(({ user, message }, i) => (
    <ListItem key={i}>
      <ListItemText primary={`${user}: ${message}`} />
    </ListItem>
  ));

  const [open, setOpen] = useState(false);

  const handleToggleChatbox = () => {
    setOpen(!open);
  };
  //handles receiving message
  useEffect(() => {
    socket.on("receive_message", (data: JSON) => {
      // console.log(data);
      setAllMessages([
        //@ts-ignore
        ...allMessages,
        //@ts-ignore
        { user: data.user, message: data.message },
      ]);
      // if (scrollBottomRef.current) {
      //   scrollBottomRef.current.scrollIntoView({ behavior: "smooth" });
      // }
    });
  }, [allMessages]);

  const sendMessage = () => {
    if (message) {
      socket!.emit("send_message", {
        room: room,
        user: userName,
        message: message,
      });
      setMessage("");
    }
  };

  const handleEnterKey = (event: { keyCode: number }) => {
    if (event.keyCode === ENTERKEY) {
      // console.log("pressed enter key");
      sendMessage();
    }
  };
  return (
    <div>
      {!open ? (
        <IconButton
          color="primary"
          onClick={handleToggleChatbox}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
          }}
        >
          <ChatIcon />
        </IconButton>
      ) : (
        <Container>
          <Paper elevation={4}>
            <Box>
              {/* toggle chat code */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                }}
              >
                <IconButton onClick={handleToggleChatbox}>
                  <CloseIcon />
                </IconButton>
              </Box>
              {/* main textbox code */}
              <Typography variant="h4" gutterBottom>
                Chat
              </Typography>
              <Divider />
              <Grid container spacing={4} alignItems="center">
                <Grid id="chat-window" xs={12} item>
                  <List id="chat-window-messages">{ListMessages}</List>
                </Grid>
                <Grid xs={9} item>
                  <FormControl fullWidth>
                    <TextField
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleEnterKey}
                      label="Aa"
                      variant="outlined"
                    />
                  </FormControl>
                </Grid>
                <Grid xs={1} item>
                  <IconButton
                    onClick={sendMessage}
                    aria-label="send"
                    color="primary"
                  >
                    <SendIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Container>
      )}
    </div>
  );
};
