import { useCallback, useEffect, useState } from "react";
import { useReadLocalStorage } from "usehooks-ts";
import { API_BASE_URL } from "../utils/apiBase";
import { authFetch } from "../utils/auth";

export interface Profile {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  win: number;
  loss: number;
}

const useProfile = () => {
  const userId = useReadLocalStorage("userId") as string;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refetch = useCallback(() => {
    if (!userId) {
      setLoading(false);
      setError("Not logged in");
      return;
    }
    setLoading(true);
    // The server reads the user id from the token, not from the URL.
    authFetch(`${API_BASE_URL}/profile`)
      .then((response) => response.json())
      .then((data) => {
        if (data.msg === "success") {
          setProfile(data);
          setError("");
        } else {
          setError(data.msg || "Could not load profile");
        }
      })
      .catch(() => setError("Could not load profile"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { profile, loading, error, refetch };
};

export default useProfile;
