import { useEffect, useState } from "react";
import axios from "axios";

function Notes({ API }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // SAFETY: ensure API exists
  if (!API) {
    console.error("API is undefined");
  }

  // GET notes
  const fetchNotes = async () => {
    try {
      console.log("Fetching notes from:", API);

      const res = await axios.get(`${API}/notes`, {
        withCredentials: true,
      });

      setNotes(res.data);
    } catch (err) {
      console.error("Fetch notes error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [API]);

  // ADD note
  const addNote = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Enter title and content");
      return;
    }

    try {
      console.log("POST →", `${API}/notes`);

      await axios.post(
        `${API}/notes`,
        { title, content },
        { withCredentials: true }
      );

      setTitle("");
      setContent("");
      fetchNotes();
    } catch (err) {
      console.error("Add note error:", err.response?.data || err.message);
      alert("Failed to add note (check login)");
    }
  };

  // DELETE note
  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API}/notes/${id}`, {
        withCredentials: true,
      });
      fetchNotes();
    } catch (err) {
      console.error("Delete error:", err.response?.data);
    }
  };

  return (
    <div>
      <h2>Add Note</h2>

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

      <br />
      <button onClick={addNote}>Add Note</button>

      <h2>Notes</h2>

      {notes.map((note) => (
        <div
          key={note.id}
          style={{
            border: "1px solid gray",
            margin: "10px",
            padding: "10px",
          }}
        >
          <h3>{note.title}</h3>
          <p>{note.content}</p>

          <button onClick={() => deleteNote(note.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default Notes;