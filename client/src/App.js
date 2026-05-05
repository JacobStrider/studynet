import { useState } from "react";
import axios from "axios";
import Notes from "./Notes";
import "./index.css";

function App() {
  const API = "http://localhost:5001";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const login = async () => {
    try {
      await axios.post(`${API}/login`, { username, password }, { withCredentials: true });
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
    <div className="container">
      <h1>StudyNet</h1>

      {!loggedIn ? (
        <>
          <h2>Login</h2>
          <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          <button className="primary-btn" onClick={login}>Login</button>
        </>
      ) : (
        <>
          <button className="logout-btn" onClick={logout}>Logout</button>
          <Notes />
        </>
      )}
    </div>
  );
}

export default App;