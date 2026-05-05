import { useEffect, useState } from "react";
import axios from "axios";

function Notes() {
  const API = "http://localhost:5001";

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [quote, setQuote] = useState("");

  const fetchNotes = async () => {
    const res = await axios.get(`${API}/notes`, { withCredentials: true });
    setNotes(res.data);
  };

  const addNote = async () => {
    await axios.post(`${API}/notes`, { title, content }, { withCredentials: true });
    setTitle("");
    setContent("");
    fetchNotes();
  };

  const updateNote = async (id) => {
    await axios.put(`${API}/notes/${id}`, { title, content }, { withCredentials: true });
    setEditingId(null);
    setTitle("");
    setContent("");
    fetchNotes();
  };

  const deleteNote = async (id) => {
    await axios.delete(`${API}/notes/${id}`, { withCredentials: true });
    fetchNotes();
  };

  const fetchQuote = async () => {
    const res = await axios.get("https://api.quotable.io/random");
    setQuote(res.data.content);
  };

  useEffect(() => {
    fetchNotes();
    fetchQuote();
  }, []);

  return (
    <>
      <div className="api-box">
        <h3>📡 Study Tip</h3>
        <p>{quote}</p>
      </div>

      <h2>{editingId ? "Edit Note" : "Add Note"}</h2>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        className="primary-btn"
        onClick={() => editingId ? updateNote(editingId) : addNote()}
      >
        {editingId ? "Update Note" : "Add Note"}
      </button>

      <h2>Notes</h2>

      {notes.map((note) => (
        <div key={note.id} className="note-card">
          <h3>{note.title}</h3>
          <p>{note.content}</p>

          <button
            className="primary-btn"
            onClick={() => {
              setEditingId(note.id);
              setTitle(note.title);
              setContent(note.content);
            }}
          >
            Edit
          </button>

          <button className="logout-btn" onClick={() => deleteNote(note.id)}>
            Delete
          </button>
        </div>
      ))}
    </>
  );
}

export default Notes;