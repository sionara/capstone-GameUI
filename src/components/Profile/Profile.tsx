import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import useProfile from "../../hooks/useProfile";

export const Profile = () => {
  const navigate = useNavigate();
  const { profile, loading, error } = useProfile();

  if (loading) {
    return <Typography sx={{ mt: 4, textAlign: "center" }}>Loading...</Typography>;
  }

  if (error || !profile) {
    return (
      <Typography color="error" sx={{ mt: 4, textAlign: "center" }}>
        {error || "Could not load profile"}
      </Typography>
    );
  }

  const totalGames = profile.win + profile.loss;
  const winRate = totalGames > 0 ? Math.round((profile.win / totalGames) * 100) : 0;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
      <Card sx={{ maxWidth: 480, width: "100%" }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <Avatar
            src={profile.avatar || undefined}
            alt={profile.name}
            sx={{ width: 120, height: 120, fontSize: "3rem" }}
          >
            {profile.name?.charAt(0).toUpperCase()}
          </Avatar>

          <Typography variant="h5">{profile.name}</Typography>
          <Typography color="text.secondary">{profile.email}</Typography>

          <Button variant="contained" onClick={() => navigate("/s/edit-profile")}>
            Edit Profile
          </Button>

          <Box sx={{ display: "flex", gap: 4, mt: 2 }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4">{profile.win}</Typography>
              <Typography color="text.secondary">Wins</Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4">{profile.loss}</Typography>
              <Typography color="text.secondary">Losses</Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4">{winRate}%</Typography>
              <Typography color="text.secondary">Win rate</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
