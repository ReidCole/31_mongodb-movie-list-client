import { NextPage } from "next";
import Head from "next/head";
import axios from "axios";
import Header from "../components/Header/Header";
import styles from "../styles/Login.module.css";
import Container from "../components/Container/Container";
import { useState } from "react";

const Login: NextPage = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  function createUser() {
    axios.post("http://localhost:4000/createuser", {
      username: "YourMom120",
      password: "456",
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
            <form className={styles.form}>
              <label>
                <p>Username</p>
                <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" />
              </label>
              <label>
                <p>Password</p>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                />
              </label>
              <button>Log In</button>
              <button>Sign Up</button>
            </form>
          }
        />
      </main>
    </>
  );
};

export default Login;
