import { useEffect, useRef, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";
import useProfile from "../../hooks/useProfile";
import { API_BASE_URL } from "../../utils/apiBase";
import { authFetch } from "../../utils/auth";

// ~1.5MB raw, which lands under the server's ~2MB base64-encoded cap once
// FileReader inflates it (base64 adds roughly 33%).
const MAX_FILE_BYTES = 1.5 * 1024 * 1024;

export const EditProfile = () => {
  const navigate = useNavigate();
  const { profile, loading, error: loadError } = useProfile();
  const [, setStoredEmail] = useLocalStorage("userEmail", "");

  const [seeded, setSeeded] = useState(false);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  // undefined = no change, null = remove photo, string = new photo (data URI)
  const [avatar, setAvatar] = useState<string | null | undefined>(undefined);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile && !seeded) {
      setEmail(profile.email);
      setAvatarPreview(profile.avatar || null);
      setSeeded(true);
    }
  }, [profile, seeded]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setError("Image is too large (max 1.5MB)");
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      const dataUri = reader.result as string;
      setAvatar(dataUri);
      setAvatarPreview(dataUri);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatar(null);
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCancel = () => {
    navigate("/s/profile");
  };

  const handleSubmit = () => {
    if (!profile) return;
    setError("");

    const emailChanged = email !== profile.email;
    const passwordChanged = newPassword.length > 0;

    if (passwordChanged && newPassword !== confirmNewPassword) {
      setError("New passwords do not match");
      return;
    }

    if ((emailChanged || passwordChanged) && !currentPassword) {
      setError("Enter your current password to change your email or password");
      return;
    }

    // No id in the payload: the server updates whoever the token belongs to.
    const payload: Record<string, unknown> = {};
    if (emailChanged) payload.email = email;
    if (passwordChanged) payload.password = newPassword;
    if (emailChanged || passwordChanged) payload.currentPassword = currentPassword;
    if (avatar !== undefined) payload.avatar = avatar;

    setSubmitting(true);
    authFetch(`${API_BASE_URL}/profile/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.msg === "success") {
          if (emailChanged) setStoredEmail(email);
          navigate("/s/profile");
        } else {
          setError(data.msg || "Could not update profile");
        }
      })
      .catch(() => setError("Could not update profile"))
      .finally(() => setSubmitting(false));
  };

  if (loading) {
    return <Typography sx={{ mt: 4, textAlign: "center" }}>Loading...</Typography>;
  }

  if (loadError || !profile) {
    return (
      <Typography color="error" sx={{ mt: 4, textAlign: "center" }}>
        {loadError || "Could not load profile"}
      </Typography>
    );
  }

  const needsCurrentPassword = email !== profile.email || newPassword.length > 0;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
      <Card sx={{ maxWidth: 480, width: "100%" }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Edit Profile
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
            <Avatar src={avatarPreview || undefined} sx={{ width: 96, height: 96, fontSize: "2.5rem" }}>
              {profile.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Button variant="outlined" component="label" size="small">
              Change Photo
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </Button>
            {avatarPreview && (
              <Button size="small" color="error" onClick={handleRemovePhoto}>
                Remove Photo
              </Button>
            )}
          </Box>

          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />

          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            helperText="Leave blank to keep your current password"
            fullWidth
          />

          <TextField
            label="Confirm New Password"
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            fullWidth
          />

          {needsCurrentPassword && (
            <TextField
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              helperText="Required to change your email or password"
              fullWidth
            />
          )}

          {error && <Typography color="error">{error}</Typography>}

          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 1 }}>
            <Button variant="outlined" onClick={handleCancel} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
              Save Changes
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
