import axios from "axios";
import React, { ReactNode, useState } from "react";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";

export const AuthContext = React.createContext<AuthContextType | null>(null);

type Props = {
  children: ReactNode;
};

type AccessToken = {
  token: string;
  expires: Date;
};

const AuthProvider: React.FC<Props> = ({ children }) => {
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [currentAccessToken, setCurrentAccessToken] = useState<string | null>(null);
  const [currentTokenExpTimeout, setCurrentTokenExpTimeout] = useState<NodeJS.Timeout | null>(null);

  // todo: state for account lists

  function login(
    username: string,
    password: string,
    onSuccess: () => void,
    onError: (message: string) => void
  ) {
    axios
      .post(
        "http://localhost:4000/login",
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
        setNewAccessToken(res.data.accessToken);
        onSuccess();
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

  function refreshToken() {
    axios
      .post(
        "http://localhost:4000/token",
        {},
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (typeof res.data.accessToken === "undefined") {
          throw new Error("access token in refresh token response is undefined");
        }
        setNewAccessToken(res.data.accessToken);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  function setNewAccessToken(token: string) {
    if (currentTokenExpTimeout !== null) {
      clearTimeout(currentTokenExpTimeout);
      setCurrentTokenExpTimeout(null);
      console.log("cleared previous token timeout");
    }
    const decoded = jwt.decode(token);
    if (decoded === null || typeof decoded === "string" || typeof decoded.exp === "undefined") {
      throw new Error("error decoding jwt");
    }
    setCurrentAccessToken(token);
    const expDate = new Date(decoded.exp * 1000);
    const earlyExpDate = dayjs(expDate).subtract(5, "seconds").toDate();
    const timeUntilExp = earlyExpDate.getTime() - Date.now();
    console.log("timeout in " + timeUntilExp + "ms");
    const timeout = setTimeout(() => {
      console.log("refreshing token before it expires");
      setCurrentTokenExpTimeout(null);
      refreshToken();
    }, timeUntilExp);
    setCurrentTokenExpTimeout(timeout);
    console.log("set new access token");
  }

  function signup(
    username: string,
    password: string,
    onSuccess: () => void,
    onError: (message: string) => void
  ) {
    axios
      .post(
        "http://localhost:4000/signup",
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
        setNewAccessToken(res.data.accessToken);
        onSuccess();
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
    if (currentTokenExpTimeout !== null) {
      clearTimeout(currentTokenExpTimeout);
      setCurrentTokenExpTimeout(null);
    }
    setCurrentAccessToken(null);
    axios
      .post("http://localhost:4000/logout", {}, { withCredentials: true })
      .then(() => {
        console.log("refresh token successfully deleted");
      })
      .catch((e) => {
        console.error("couldn't remove refresh token", e);
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
