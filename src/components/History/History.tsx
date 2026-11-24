import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { useReadLocalStorage } from "usehooks-ts";
import { API_BASE_URL } from "../../utils/apiBase";
import { authFetch } from "../../utils/auth";

interface GameRecord {
  id: number;
  opponentName: string;
  result: "win" | "loss";
  yourScore: number;
  opponentScore: number;
  reason: string;
  createdAt: string;
}

export const History = () => {
  const userId = useReadLocalStorage("userId") as string;
  const [games, setGames] = useState<GameRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError("Not logged in");
      return;
    }
    // The server reads the user id from the token, not from the URL.
    authFetch(`${API_BASE_URL}/history?limit=10`)
      .then((response) => response.json())
      .then((data) => {
        if (data.msg === "success") {
          setGames(data.games);
        } else {
          setError(data.msg || "Could not load match history");
        }
      })
      .catch(() => setError("Could not load match history"))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return <Typography sx={{ mt: 4, textAlign: "center" }}>Loading...</Typography>;
  }

  if (error) {
    return (
      <Typography color="error" sx={{ mt: 4, textAlign: "center" }}>
        {error}
      </Typography>
    );
  }

  if (games.length === 0) {
    return (
      <Typography sx={{ mt: 4, textAlign: "center" }} color="text.secondary">
        No games played yet. Head to the Lobby to start one!
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 480, mx: "auto", mt: 2 }}>
      {games.map((game) => (
        <Card key={game.id} variant="outlined">
          <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="h6">vs {game.opponentName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(game.createdAt).toLocaleString()}
              </Typography>
              {game.reason === "forfeit" && (
                <Typography variant="body2" color="warning.main">
                  Opponent forfeited
                </Typography>
              )}
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Chip
                label={game.result === "win" ? "Won" : "Lost"}
                color={game.result === "win" ? "success" : "error"}
                sx={{ mb: 1 }}
              />
              <Typography variant="body2">
                {game.yourScore} - {game.opponentScore}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};
