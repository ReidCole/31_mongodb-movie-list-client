import axios from "axios";
import React, { ReactNode, useState } from "react";

export const AuthContext = React.createContext<AuthContextType | null>(null);

type Props = {
  children: ReactNode;
};

const AuthProvider: React.FC<Props> = ({ children }) => {
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);

  // add functions for logging in, logging out, and signing up here instead of declaring them in login component
  // account lists

  function login(
    username: string,
    password: string,
    onSuccess: () => void,
    onError: (message: string) => void
  ) {
    axios
      .post("http://localhost:4000/login", {
        username: username,
        password: password,
      })
      .then((res) => {
        const data = res.data;
        console.log("logged in", res.data);
        setCurrentUsername(username);
        onSuccess();
      })
      .catch((e) => {
        let errorText = "s";
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
        onError("Error: " + errorText);
        console.error(e);
      });
  }

  function signup(
    username: string,
    password: string,
    onSuccess: () => void,
    onError: (message: string) => void
  ) {
    axios
      .post("http://localhost:4000/signup", {
        username: username,
        password: password,
      })
      .then((res) => {
        const data = res.data;
        console.log("signed up", res.data);
        setCurrentUsername(username);
        onSuccess();
      })
      .catch((e) => {
        let errorText = "s";
        switch (e.response.status) {
          case 409:
            errorText = "This username is taken.";
            break;
          default:
            errorText = "Something went wrong. Please try again later.";
        }
        onError("Error: " + errorText);
        console.error(e);
      });
  }

  function logout() {
    setCurrentUsername(null);
    console.log("logged out. TODO: delete jwt");
  }

  const value: AuthContextType = {
    username: currentUsername,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

type AuthContextType = {
  username: string | null;
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
