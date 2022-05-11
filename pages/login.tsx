import { NextPage } from "next";
import Head from "next/head";
import axios from "axios";

const Login: NextPage = () => {
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
        <button onClick={createUser}>create user</button>
      </main>
    </>
  );
};

export default Login;
