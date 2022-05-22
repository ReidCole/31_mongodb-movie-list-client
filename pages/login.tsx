import { NextPage } from "next";
import Head from "next/head";
import axios from "axios";
import Header from "../components/Header/Header";
import styles from "../styles/Login.module.css";
import Container from "../components/Container/Container";
import { useContext, useEffect, useState } from "react";
import Button from "../components/Button/Button";
import useNotificationState from "../hooks/useNotificationState";
import Notification from "../components/Notification/Notification";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/router";
import Loading from "../components/Loading/Loading";

const Login: NextPage = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [notificationState, showNotification] = useNotificationState();
  const [isLoading, setIsLoading] = useState(false);
  const auth = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (auth && auth.username) {
      router.push("/");
    }
  }, [auth, router]);

  function authenticate(method: "login" | "signup") {
    if (auth === null) return;
    setIsLoading(true);
    if (method === "login") {
      auth.login(
        username,
        password,
        () => {},
        (msg) => {
          showNotification(msg, "red");
          setIsLoading(false);
        }
      );
    } else {
      auth.signup(
        username,
        password,
        () => {},
        (msg) => {
          showNotification(msg, "red");
          setIsLoading(false);
        }
      );
    }
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
                  onClick={() => authenticate("login")}
                  disabled={username.length === 0 || password.length === 0}
                >
                  Log In
                </Button>
                <Button
                  className={styles.button}
                  onClick={() => authenticate("signup")}
                  disabled={username.length === 0 || password.length === 0}
                >
                  Sign Up
                </Button>
              </div>
            </form>
          }
        />

        <Notification state={notificationState} />
        <Loading isVisible={isLoading} />
      </main>
    </>
  );
};

export default Login;
