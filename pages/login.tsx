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
  const [canLogin, setCanLogin] = useState<boolean>(false);
  const auth = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (auth && auth.username) {
      router.push("/");
    }
  }, [auth, router]);

  useEffect(() => {
    if (
      username.length >= 3 &&
      username.length <= 20 &&
      password.length >= 3 &&
      password.length <= 30
    ) {
      setCanLogin(true);
      return;
    }
    setCanLogin(false);
  }, [username, password]);

  function authenticate(method: "login" | "signup") {
    if (auth === null || !canLogin) return;
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
                <div className={styles.labelText}>
                  <p>Username</p>
                  {username.length > 0 && (
                    <p
                      className={username.length < 3 || username.length > 20 ? styles.invalid : ""}
                    >
                      {username.length}
                    </p>
                  )}
                </div>
                <input
                  className={styles.input}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                />
              </label>
              <label className={styles.label}>
                <div className={styles.labelText}>
                  <p>Password</p>
                  {password.length > 0 && (
                    <p
                      className={password.length < 3 || password.length > 30 ? styles.invalid : ""}
                    >
                      {password.length}
                    </p>
                  )}
                </div>
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
                  disabled={!canLogin}
                >
                  Log In
                </Button>
                <Button
                  className={styles.button}
                  onClick={() => authenticate("signup")}
                  disabled={!canLogin}
                >
                  Sign Up
                </Button>
              </div>
            </form>
          }
        />

        <div className={styles.requirementsText}>
          <p>Username must be 3 - 20 characters long.</p>
          <p>Password must be 3 - 30 characters long.</p>
          <p>All characters are permitted.</p>
        </div>

        <Notification state={notificationState} />
        <Loading isVisible={isLoading} />
      </main>
    </>
  );
};

export default Login;
