import { useState } from "react";
import axios from "axios";
import Notes from "./Notes";

function App() {
  const API = "https://studynet-q8mu.onrender.com";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const register = async () => {
    try {
      await axios.post(`${API}/register`, { username, password });
      alert("User created!");
    } catch (err) {
      alert(err.response?.data?.error);
    }
  };

  const login = async () => {
    try {
      await axios.post(
        `${API}/login`,
        { username, password },
        { withCredentials: true }
      );
      setLoggedIn(true);
    } catch {
      alert("Login failed");
    }
  };

  const logout = async () => {
    await axios.post(`${API}/logout`, {}, { withCredentials: true });
    setLoggedIn(false);
  };

  return (
    <div>
      <h1>StudyNet</h1>

      {!loggedIn ? (
        <div>
          <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

          <button onClick={login}>Login</button>
          <button onClick={register}>Register</button>
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