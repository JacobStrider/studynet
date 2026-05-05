import { useState } from "react";
import axios from "axios";
import Notes from "./Notes";
import "./index.css";

function App() {
  const API = "https://studynet-q8mu.onrender.com"; 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  // REGISTER
  const register = async () => {
    if (!username.trim() || !password.trim()) {
      alert("Enter username and password");
      return;
    }

    try {
      await axios.post(`${API}/register`, {
        username,
        password,
      });

      alert("User created! Now login.");
    } catch (err) {
      console.error(err.response?.data);

      alert(err.response?.data?.error || "Register failed");
    }
  };

  // LOGIN
  const login = async () => {
    if (!username.trim() || !password.trim()) {
      alert("Enter username and password");
      return;
    }

    try {
      await axios.post(
        `${API}/login`,
        { username, password },
        { withCredentials: true }
      );

      setLoggedIn(true);
    } catch (err) {
      alert("Login failed");
      console.error(err);
    }
  };

  // LOGOUT
  const logout = async () => {
    await axios.post(`${API}/logout`, {}, { withCredentials: true });
    setLoggedIn(false);
  };

  return (
    <div className="container">
      <h1>StudyNet</h1>

      {!loggedIn ? (
        <div>
          <h2>Login / Register</h2>

          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div style={{ marginTop: "10px" }}>
            <button onClick={login}>Login</button>
            <button onClick={register} style={{ marginLeft: "10px" }}>
              Register
            </button>
          </div>
        </div>
      ) : (
        <div>
          <button onClick={logout}>Logout</button>
          <Notes API={API} />
        </div>
      )}
    </div>
  );
}

export default App;