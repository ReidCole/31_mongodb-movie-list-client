import { NextPage } from "next";
import Head from "next/head";
import axios from "axios";
import Header from "../components/Header/Header";
import styles from "../styles/Login.module.css";
import Container from "../components/Container/Container";
import { useState } from "react";
import Button from "../components/Button/Button";

const Login: NextPage = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  function createUser() {
    axios.post("http://localhost:4000/createuser", {
      username: "YourMom120",
      password: "456",
    });
  }

  function login() {
    console.log("log in");
  }

  function signup() {
    console.log("sign up");
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
                <Button className={styles.button} onClick={login}>
                  Log In
                </Button>
                <Button className={styles.button} onClick={signup}>
                  Sign Up
                </Button>
              </div>
            </form>
          }
        />
      </main>
    </>
  );
};

export default Login;
