import { NextPage } from "next";
import Head from "next/head";
import axios from "axios";
import Header from "../components/Header/Header";
import styles from "../styles/Login.module.css";
import Container from "../components/Container/Container";
import { useState } from "react";
import Button from "../components/Button/Button";
import useNotificationState from "../hooks/useNotificationState";
import Notification from "../components/Notification/Notification";

const Login: NextPage = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [notificationState, showNotification] = useNotificationState();

  function login() {
    axios
      .post("http://localhost:4000/login", {
        username: username,
        password: password,
      })
      .then((res) => {
        const data = res.data;
        console.log(res.data);
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
        showNotification("Error: " + errorText, "red");
        console.error(e);
      });
  }

  function signup() {
    axios
      .post("http://localhost:4000/signup", {
        username: username,
        password: password,
      })
      .then((res) => {
        const data = res.data;
        console.log(res.data);
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
        showNotification("Error: " + errorText, "red");
        console.error(e);
      });
  }

  return (
    <>
      <Head>
        <title>Log In - Movie List Maker</title>
      </Head>

      <main>
        <Header />

        <Container
          header={<h2 className={styles.heading}>Log In / Sign Up</h2>}
          body={
            <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
              <label className={styles.label}>
                <p>Username</p>
                <input
                  className={styles.input}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                />
              </label>
              <label className={styles.label}>
                <p>Password</p>
                <input
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                />
              </label>
              <div className={styles.buttons}>
                <Button
                  className={styles.button}
                  onClick={login}
                  disabled={username.length === 0 || password.length === 0}
                >
                  Log In
                </Button>
                <Button
                  className={styles.button}
                  onClick={signup}
                  disabled={username.length === 0 || password.length === 0}
                >
                  Sign Up
                </Button>
              </div>
            </form>
          }
        />

        <Notification state={notificationState} />
      </main>
    </>
  );
};

export default Login;
