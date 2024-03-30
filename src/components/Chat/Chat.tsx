import {
  Box,
  Container,
  Divider,
  FormControl,
  Grid,
  IconButton,
  List,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";

export const Chat = () => {
  const [allMessages, setAllMessages] = useState([]);
  const [message, setMessage] = useState("");

  // const messageList = allMessages.map(())

  return (
    <Container>
      <Paper elevation={4}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Text here
          </Typography>
          <Divider />
          <Grid container spacing={4} alignItems="center">
            <Grid id="chat-window" xs={12} item>
              <List id="chat-window-messages">{/* {messageList} */}</List>
            </Grid>
            <Grid item></Grid>
            <Grid item></Grid>
            <Grid xs={9} item>
              <FormControl fullWidth>
                <TextField value={message} label="Aa" variant="outlined" />
              </FormControl>
            </Grid>
            <Grid xs={1} item>
              <IconButton aria-label="send" color="primary">
                <SendIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};
