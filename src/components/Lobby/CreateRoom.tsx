import { useContext, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { useReadLocalStorage } from "usehooks-ts";

import { SocketContext } from "../../context/Context";
import { getClientId } from "../../utils/clientId";

interface CreateRoomResponse {
  ok: boolean;
  message?: string;
  room?: { code: string };
}

export const CreateRoom = () => {
  const [open, setOpen] = useState(false);
  const [bestOf, setBestOf] = useState<"3" | "5">("3");
  const [error, setError] = useState("");
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const username = useReadLocalStorage("username") as string;
  const userId = useReadLocalStorage("userId") as string;

  const handleClickOpen = () => {
    setError("");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreate = () => {
    socket.emit(
      "create_room",
      { username, userId, clientId: getClientId(), bestOf: Number(bestOf) },
      (response: CreateRoomResponse) => {
        if (response.ok && response.room) {
          setOpen(false);
          navigate({
            pathname: "/s/game",
            search: `code=${response.room.code}`,
          });
        } else {
          setError(response.message || "Could not create room");
        }
      }
    );
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Create Room
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create Room</DialogTitle>
        <DialogContent>
          <FormControl>
            <FormLabel>Game length</FormLabel>
            <RadioGroup
              value={bestOf}
              onChange={(e) => setBestOf(e.target.value as "3" | "5")}
            >
              <FormControlLabel
                value="3"
                control={<Radio />}
                label="Best of 3 (first to 2 wins)"
              />
              <FormControlLabel
                value="5"
                control={<Radio />}
                label="Best of 5 (first to 3 wins)"
              />
            </RadioGroup>
          </FormControl>
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
