import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const API = "http://localhost:5001";

  // GET notes
  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${API}/notes`);
      setNotes(res.data);
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // POST note
  const addNote = async () => {
    if (!title || !content) return;

    try {
      await axios.post(`${API}/notes`, { title, content });
      setTitle("");
      setContent("");
      fetchNotes();
    } catch (err) {
      console.error("Error adding note:", err);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>StudyNet</h1>

      <h2>Add Note</h2>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "300px", padding: "5px" }}
      />
      <br /><br />

      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ width: "300px", height: "100px", padding: "5px" }}
      />
      <br /><br />

      <button onClick={addNote}>Add Note</button>

      <h2>Notes</h2>

      {notes.map((note) => (
        <div
          key={note.id}
          style={{
            border: "1px solid gray",
            margin: "10px",
            padding: "10px",
            width: "320px"
          }}
        >
          <h3>{note.title}</h3>
          <p>{note.content}</p>
        </div>
      ))}
    </div>
  );
}

export default App;