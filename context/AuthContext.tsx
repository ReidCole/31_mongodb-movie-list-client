import axios from "axios";
import React, { ReactNode, useCallback, useEffect, useState } from "react";

export const AuthContext = React.createContext<AuthContextType | null>(null);

type Props = {
  children: ReactNode;
};

const AuthProvider: React.FC<Props> = ({ children }) => {
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [currentAccessToken, setCurrentAccessToken] = useState<string | null>(null);

  const startRefreshInterval = useCallback(async () => {
    const success = await refreshToken();
    if (!success) {
      console.log("failed to auto log in. not setting interval");
      return;
    }

    console.log("setting interval");
    const interval = setInterval(async () => {
      const success = await refreshToken();
      if (!success) {
        clearInterval(interval);
      }
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    startRefreshInterval();
  }, [startRefreshInterval]);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === "logout" && e.newValue === "true") {
        logout();
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function login(
    username: string,
    password: string,
    onSuccess: () => void,
    onError: (message: string) => void
  ) {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/login`,
        {
          username: username,
          password: password,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setCurrentUsername(username);
        setCurrentAccessToken(res.data.accessToken);
        onSuccess();
        localStorage.setItem("logout", "false");

        // refresh token loop
        startRefreshInterval();
      })
      .catch((e) => {
        let errorText = "";
        if (typeof e.response === "undefined") {
          errorText = "Something went wrong. Please try again later.";
        } else {
          switch (e.response.status) {
            case 404:
              errorText = "No user with this username exists. Did you mean to sign up?";
              break;
            case 405:
              errorText = "Incorrect password for this username";
              break;
            default:
              errorText = "Something went wrong. Please try again later.";
          }
        }

        onError(errorText);
        console.error(e);
      });
  }

  async function refreshToken(): Promise<boolean> {
    console.log("refreshToken");
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/token`,
        {},
        {
          withCredentials: true,
        }
      );
      if (typeof res.data.accessToken === "undefined") {
        throw new Error("access token in refresh token response is undefined");
      }
      setCurrentAccessToken(res.data.accessToken);
      setCurrentUsername(res.data.username);
      return true;
    } catch (e) {
      if (e) console.error(e);
      setCurrentAccessToken(null);
      setCurrentUsername(null);
      return false;
    }
  }

  function signup(
    username: string,
    password: string,
    onSuccess: () => void,
    onError: (message: string) => void
  ) {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/signup`,
        {
          username: username,
          password: password,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log("signed up", res.data);
        setCurrentUsername(username);
        setCurrentAccessToken(res.data.accessToken);
        onSuccess();

        // refresh token loop
        startRefreshInterval();
      })
      .catch((e) => {
        let errorText = "";
        switch (e.response.status) {
          case 409:
            errorText = "This username is taken.";
            break;
          default:
            errorText = "Something went wrong. Please try again later.";
        }
        onError(errorText);
        console.error(e);
      });
  }

  function logout() {
    setCurrentUsername(null);
    setCurrentAccessToken(null);
    axios
      .post(`${process.env.NEXT_PUBLIC_SERVER_HOST}/logout`, {}, { withCredentials: true })
      .then(() => {
        console.log("successfully logged out");
        localStorage.setItem("logout", "true");
      })
      .catch((e) => {
        console.error("error logging out", e);
      });
  }

  const value: AuthContextType = {
    username: currentUsername,
    accessToken: currentAccessToken,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

type AuthContextType = {
  username: string | null;
  accessToken: string | null;
  login(
    username: string,
    password: string,
    onSuccess: () => void,
    onError: (message: string) => void
  ): void;
  signup(
    username: string,
    password: string,
    onSuccess: () => void,
    onError: (message: string) => void
  ): void;
  logout(): void;
};

export default AuthProvider;
